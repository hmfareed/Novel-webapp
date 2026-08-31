/**
 * Project Gutenberg / Gutendex Service
 * Handles full-text public-domain book search, text download, and chapter segmentation.
 */

import { ParsedBookChapter, UnifiedBookSearchResult } from "@/types/book";

const GUTENDEX_BASE_URL = "https://gutendex.com/books";
const USER_AGENT = "NovelVerse/2.0 (Legitimate Library Ingestion; contact@novelverse.app)";

export interface GutenbergBookRaw {
  id: number;
  title: string;
  authors: Array<{ name: string; birth_year?: number; death_year?: number }>;
  subjects: string[];
  bookshelves: string[];
  languages: string[];
  copyright: boolean;
  media_type: string;
  formats: Record<string, string>;
  download_count: number;
}

/**
 * Searches the 70,000+ Project Gutenberg catalog via Gutendex
 */
export async function searchGutenberg(params: {
  query?: string;
  topic?: string;
  page?: number;
}): Promise<{ count: number; results: UnifiedBookSearchResult[] }> {
  try {
    const { query = "", topic = "", page = 1 } = params;
    const searchParams = new URLSearchParams();

    if (query.trim()) searchParams.set("search", query.trim());
    if (topic.trim()) searchParams.set("topic", topic.trim());
    if (page > 1) searchParams.set("page", String(page));
    searchParams.set("languages", "en");

    const url = `${GUTENDEX_BASE_URL}?${searchParams.toString()}`;
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`[Gutenberg Service] API returned status ${res.status}`);
      return { count: 0, results: [] };
    }

    const data = await res.json();
    const rawResults: GutenbergBookRaw[] = data.results || [];

    const unifiedResults: UnifiedBookSearchResult[] = rawResults.map((item) => {
      const authorNames = item.authors.map((a) =>
        a.name.includes(",") ? a.name.split(",").reverse().join(" ").trim() : a.name
      );

      const coverUrl =
        item.formats["image/jpeg"] ||
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop";

      return {
        id: String(item.id),
        source: "gutenberg" as const,
        title: item.title.split("\n")[0].trim(),
        authors: authorNames.length > 0 ? authorNames : ["Public Domain Author"],
        description: `Project Gutenberg public domain edition. Subjects: ${(item.subjects || []).slice(0, 3).join(", ") || "General Literature"}`,
        coverUrl,
        isPublicDomain: true,
        isReadable: true,
        downloadCount: item.download_count || 0,
        subjects: item.subjects || [],
        previewUrl: `https://www.gutenberg.org/ebooks/${item.id}`,
      };
    });

    return {
      count: data.count || 0,
      results: unifiedResults,
    };
  } catch (error) {
    console.error("[Gutenberg Service] search error:", error);
    return { count: 0, results: [] };
  }
}

/**
 * Fetches the raw text of a book by Gutenberg ID using multiple mirror failovers
 */
export async function fetchGutenbergText(gutenbergId: number | string): Promise<{
  meta: GutenbergBookRaw | null;
  rawText: string;
}> {
  const id = Number(gutenbergId);
  if (isNaN(id) || id <= 0) {
    throw new Error(`Invalid Gutenberg ID: ${gutenbergId}`);
  }

  const reqHeaders = { "User-Agent": USER_AGENT };

  // 1. Fetch metadata
  const metaRes = await fetch(`${GUTENDEX_BASE_URL}/${id}`, {
    headers: reqHeaders,
  });

  if (!metaRes.ok) {
    throw new Error(`Failed to fetch metadata for Gutenberg ID ${id}`);
  }

  const meta: GutenbergBookRaw = await metaRes.json();

  // 2. Resolve text URLs in order of priority
  const textUrls = [
    meta.formats["text/plain; charset=utf-8"],
    meta.formats["text/plain; charset=us-ascii"],
    meta.formats["text/plain"],
    `https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`,
    `https://www.gutenberg.org/files/${id}/${id}-0.txt`,
    `https://www.gutenberg.org/files/${id}/${id}.txt`,
  ].filter(Boolean) as string[];

  let rawText = "";

  for (const url of textUrls) {
    try {
      const res = await fetch(url, { headers: reqHeaders });
      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 200) {
          rawText = text;
          break;
        }
      }
    } catch {
      // Continue to next mirror
    }
  }

  if (!rawText) {
    throw new Error(`Could not download full text for Gutenberg ID ${id}`);
  }

  return { meta, rawText };
}

/**
 * Intelligent text splitter that detects chapter headings and strips Gutenberg headers/footers
 */
export function parseGutenbergChapters(rawText: string): ParsedBookChapter[] {
  let cleanText = rawText;

  // Strip Gutenberg header
  const startMatch = rawText.match(/\*\*\* START OF (THE|THIS) PROJECT GUTENBERG EBOOK[^\n]*\*\*\*/i);
  if (startMatch && startMatch.index !== undefined) {
    cleanText = cleanText.substring(startMatch.index + startMatch[0].length);
  }

  // Strip Gutenberg footer
  const endMatch = cleanText.match(/\*\*\* END OF (THE|THIS) PROJECT GUTENBERG EBOOK/i);
  if (endMatch && endMatch.index !== undefined) {
    cleanText = cleanText.substring(0, endMatch.index);
  }

  cleanText = cleanText.trim();

  // Multi-pattern regex for standard chapter structures
  const chapterRegex =
    /(?:^|\n\n+)(?:CHAPTER|Chapter|ACT|Act|BOOK|Book|EPISODE|Episode|PART|Part|STAVE|Stave|CANTO|Canto)\s+([0-9IVXLCDMivxlcdm]+|[A-Za-z\s]+)(?:[:.\-–—\s]+([^\n]+))?(?:\n|$)/g;

  const chapters: ParsedBookChapter[] = [];
  const matches: Array<{
    index: number;
    chapterNumStr: string;
    subTitle: string;
    fullMatch: string;
  }> = [];

  let match;
  while ((match = chapterRegex.exec(cleanText)) !== null) {
    matches.push({
      index: match.index,
      chapterNumStr: match[1]?.trim() || "",
      subTitle: match[2]?.trim() || "",
      fullMatch: match[0],
    });
  }

  if (matches.length >= 2) {
    for (let i = 0; i < matches.length; i++) {
      const current = matches[i];
      const nextIndex = i + 1 < matches.length ? matches[i + 1].index : cleanText.length;

      const chapterRaw = cleanText.substring(current.index + current.fullMatch.length, nextIndex).trim();
      const wordCount = chapterRaw.split(/\s+/).filter(Boolean).length;

      // Filter out tiny matches (like table of contents indices)
      if (wordCount > 60 || i === matches.length - 1) {
        const chNum = chapters.length + 1;
        const title = current.subTitle
          ? `Chapter ${chNum}: ${current.subTitle}`
          : `Chapter ${chNum}: ${current.chapterNumStr || `Part ${chNum}`}`;

        chapters.push({
          chapterNumber: chNum,
          title,
          content: chapterRaw,
          wordCount,
          isPremium: chNum > 10,
        });
      }
    }
  }

  // Fallback: If no chapter markers matched, split evenly into readable narrative chapters
  if (chapters.length === 0) {
    const paragraphs = cleanText.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
    const chunkSize = Math.max(12, Math.ceil(paragraphs.length / 15));

    for (let i = 0; i < paragraphs.length; i += chunkSize) {
      const chunkParagraphs = paragraphs.slice(i, i + chunkSize);
      const chunkContent = chunkParagraphs.join("\n\n");
      const chNum = Math.floor(i / chunkSize) + 1;

      chapters.push({
        chapterNumber: chNum,
        title: `Chapter ${chNum}: Part ${chNum}`,
        content: chunkContent,
        wordCount: chunkContent.split(/\s+/).filter(Boolean).length,
        isPremium: chNum > 5,
      });
    }
  }

  return chapters;
}

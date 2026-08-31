/**
 * NovelVerse — Mass Novel Ingestion & Global Scraping Service
 * Fetches, parses, and segments full novels from sources like
 * Gutendex (Project Gutenberg 70,000+ library), web novel HTML scrapers,
 * and custom multi-chapter manuscripts.
 */

import { connectToDatabase } from "@/lib/db";
import { Novel, Chapter, Genre } from "@/models";
import {
  ParsedChapter,
  IngestedNovel,
  GlobalNovelSearchResult,
  CURATED_ICONIC_NOVELS,
} from "@/types/ingestion";

export type { ParsedChapter, IngestedNovel, GlobalNovelSearchResult };
export { CURATED_ICONIC_NOVELS };

// Genre curated mood & cover fallbacks
const GENRE_ART: Record<string, { cover: string; banner: string; mood: string }> = {
  fantasy: {
    cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
    mood: "Mystical & Enchanting",
  },
  adventure: {
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1600&auto=format&fit=crop",
    mood: "Epic & Thrilling",
  },
  dark_fantasy: {
    cover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop",
    mood: "Dark & Intense",
  },
  romance: {
    cover: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1600&auto=format&fit=crop",
    mood: "Passionate & Heartfelt",
  },
  mystery: {
    cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1600&auto=format&fit=crop",
    mood: "Mysterious & Suspenseful",
  },
  scifi: {
    cover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop",
    mood: "Cosmic & Visionary",
  },
  classics: {
    cover: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=1600&auto=format&fit=crop",
    mood: "Timeless & Literary",
  },
};

/**
 * Intelligent text splitter that detects chapter headings across common Gutenberg / literary formats
 */
export function segmentChaptersFromText(rawText: string): ParsedChapter[] {
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

  // Multi-pattern regex for chapter headings
  const chapterRegex =
    /(?:^|\n\n+)(?:CHAPTER|Chapter|ACT|Act|BOOK|Book|EPISODE|Episode|PART|Part|STAVE|Stave|CANTO|Canto)\s+([0-9IVXLCDMivxlcdm]+|[A-Za-z\s]+)(?:[:.\-–—\s]+([^\n]+))?(?:\n|$)/g;

  const chapters: ParsedChapter[] = [];
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

      // Filter out tiny table-of-contents matches
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

  // Fallback: If no headers matched, split into logical narrative chunks (approx 1,500 - 3,000 words per chapter)
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

/**
 * Search the 70,000+ Gutenberg / Gutendex catalog
 */
export async function searchGlobalNovels(params: {
  query?: string;
  topic?: string;
  page?: number;
}): Promise<{ count: number; results: GlobalNovelSearchResult[] }> {
  try {
    const { query = "", topic = "", page = 1 } = params;
    const searchParams = new URLSearchParams();

    if (query) searchParams.set("search", query);
    if (topic) searchParams.set("topic", topic);
    if (page > 1) searchParams.set("page", String(page));
    searchParams.set("languages", "en");

    const url = `https://gutendex.com/books/?${searchParams.toString()}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "NovelVerse/1.0 (https://novelverse.app; contact@novelverse.app)",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return { count: 0, results: [] };
    }

    const data = await res.json();
    const formattedResults: GlobalNovelSearchResult[] = (data.results || []).map(
      (b: {
        id: number;
        title: string;
        authors?: Array<{ name: string }>;
        subjects?: string[];
        download_count?: number;
        languages?: string[];
        formats?: Record<string, string>;
      }) => {
        const formats = b.formats || {};
        const coverUrl =
          formats["image/jpeg"] ||
          GENRE_ART[topic.toLowerCase()]?.cover ||
          "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop";

        return {
          id: b.id,
          title: (b.title || "Untitled").split("\n")[0].trim(),
          authors: b.authors || [],
          subjects: b.subjects || [],
          coverUrl,
          downloadCount: b.download_count || 0,
          languages: b.languages || ["en"],
          formats,
        };
      }
    );

    return {
      count: data.count || 0,
      results: formattedResults,
    };
  } catch (error) {
    console.error("[searchGlobalNovels Error]", error);
    return { count: 0, results: [] };
  }
}

/**
 * Fetch a full novel from Project Gutenberg by ID with fallback mirrors
 */
export async function fetchGutenbergNovel(gutenbergId: number): Promise<IngestedNovel | null> {
  const reqHeaders = {
    "User-Agent": "NovelVerse/1.0 (https://novelverse.app; contact@novelverse.app)",
  };

  try {
    const metaRes = await fetch(`https://gutendex.com/books/${gutenbergId}`, {
      headers: reqHeaders,
    });
    if (!metaRes.ok) return null;
    const metaData = await metaRes.json();

    const textUrl =
      metaData.formats["text/plain; charset=utf-8"] ||
      metaData.formats["text/plain; charset=us-ascii"] ||
      metaData.formats["text/plain"] ||
      `https://www.gutenberg.org/cache/epub/${gutenbergId}/pg${gutenbergId}.txt`;

    let fullText = "";
    try {
      const textRes = await fetch(textUrl, { headers: reqHeaders });
      if (textRes.ok) {
        fullText = await textRes.text();
      }
    } catch {
      // Try fallback direct mirror
      const mirrorUrl = `https://www.gutenberg.org/cache/epub/${gutenbergId}/pg${gutenbergId}.txt`;
      const mirrorRes = await fetch(mirrorUrl, { headers: reqHeaders });
      if (mirrorRes.ok) {
        fullText = await mirrorRes.text();
      }
    }

    if (!fullText) {
      // Second fallback mirror
      const mirrorUrl2 = `https://www.gutenberg.org/files/${gutenbergId}/${gutenbergId}-0.txt`;
      const mirrorRes2 = await fetch(mirrorUrl2, { headers: reqHeaders });
      if (mirrorRes2.ok) {
        fullText = await mirrorRes2.text();
      }
    }

    if (!fullText) return null;

    const chapters = segmentChaptersFromText(fullText);
    const totalWords = chapters.reduce((acc, c) => acc + c.wordCount, 0);

    const title = metaData.title.split("\n")[0].trim();
    const authorName = metaData.authors?.[0]?.name
      ? metaData.authors[0].name.split(",").reverse().join(" ").trim()
      : "Classic Author";

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Determine genre from subjects
    const subjectsStr = (metaData.subjects || []).join(" ").toLowerCase();
    let detectedGenre = "Classics";
    let detectedGenreSlug = "classics";

    if (subjectsStr.includes("fantasy") || subjectsStr.includes("magic") || subjectsStr.includes("fairy")) {
      detectedGenre = "Fantasy";
      detectedGenreSlug = "fantasy";
    } else if (subjectsStr.includes("adventure") || subjectsStr.includes("sea") || subjectsStr.includes("voyages")) {
      detectedGenre = "Adventure";
      detectedGenreSlug = "adventure";
    } else if (subjectsStr.includes("horror") || subjectsStr.includes("gothic") || subjectsStr.includes("vampire") || subjectsStr.includes("ghost")) {
      detectedGenre = "Dark Fantasy";
      detectedGenreSlug = "dark_fantasy";
    } else if (subjectsStr.includes("science fiction") || subjectsStr.includes("space") || subjectsStr.includes("time travel")) {
      detectedGenre = "Sci-Fi";
      detectedGenreSlug = "sci-fi";
    } else if (subjectsStr.includes("mystery") || subjectsStr.includes("detective") || subjectsStr.includes("crime")) {
      detectedGenre = "Mystery";
      detectedGenreSlug = "mystery";
    } else if (subjectsStr.includes("romance") || subjectsStr.includes("love")) {
      detectedGenre = "Romance";
      detectedGenreSlug = "romance";
    }

    const art = GENRE_ART[detectedGenreSlug] || GENRE_ART.classics;
    const coverUrl = metaData.formats["image/jpeg"] || art.cover;

    return {
      slug,
      title,
      synopsis: `Experience the unabridged masterwork "${title}" by ${authorName}. Preserved and formatted for an immersive digital reading experience on NovelVerse.`,
      coverUrl,
      bannerUrl: coverUrl,
      author: {
        name: authorName,
        username: authorName.toLowerCase().replace(/[^a-z0-9]/g, ""),
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(authorName)}`,
        verified: true,
      },
      genres: [
        { id: detectedGenreSlug, name: detectedGenre, slug: detectedGenreSlug },
        { id: "classics", name: "Classics", slug: "classics" },
      ],
      tags: metaData.subjects?.slice(0, 5) || [detectedGenre, "Unabridged", "Full Novel"],
      status: "COMPLETED",
      rating: 4.85,
      reviewCount: Math.floor((metaData.download_count || 100) / 10) + 50,
      readCount: (metaData.download_count || 100) * 15,
      chapterCount: chapters.length,
      wordCount: totalWords,
      isPremium: false,
      isCompleted: true,
      featured: (metaData.download_count || 0) > 1000,
      mood: art.mood,
      category: "popular",
      storyDna: {
        romance: detectedGenreSlug === "romance" ? 85 : 30,
        politics: 50,
        action: detectedGenreSlug === "adventure" || detectedGenreSlug === "fantasy" ? 85 : 45,
        drama: 75,
        magic: detectedGenreSlug === "fantasy" || detectedGenreSlug === "dark_fantasy" ? 90 : 20,
      },
      ageRating: "13+",
      language: "English",
      chapters,
      sourceId: gutenbergId,
    };
  } catch (error) {
    console.error("[fetchGutenbergNovel Error]", error);
    return null;
  }
}

/**
 * Universal Web Novel Scraper
 * Pulls chapters, title, author, and prose from external web novel links
 */
export async function scrapeNovelFromUrl(url: string): Promise<IngestedNovel | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 NovelVerseBot/1.0",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!res.ok) return null;
    const html = await res.text();

    // Extract Title (<title> or <h1> or og:title)
    let title = "Imported Web Novel";
    const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
    const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    const titleTagMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);

    if (ogTitleMatch) {
      title = ogTitleMatch[1].trim();
    } else if (h1Match) {
      title = h1Match[1].trim();
    } else if (titleTagMatch) {
      title = titleTagMatch[1].split(/[|\-–_]/)[0].trim();
    }

    // Extract Author
    let authorName = "Web Novelist";
    const ogAuthorMatch = html.match(/<meta\s+name=["']author["']\s+content=["']([^"']+)["']/i);
    const authorSpanMatch = html.match(/(?:by|author)[:\s]*<a[^>]*>([^<]+)<\/a>/i);
    if (ogAuthorMatch) {
      authorName = ogAuthorMatch[1].trim();
    } else if (authorSpanMatch) {
      authorName = authorSpanMatch[1].trim();
    }

    // Extract Cover image
    let coverUrl = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop";
    const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
    if (ogImageMatch && ogImageMatch[1].startsWith("http")) {
      coverUrl = ogImageMatch[1];
    }

    // Extract Synopsis
    let synopsis = `A thrilling web novel titled "${title}" written by ${authorName}. Scraped and formatted for NovelVerse readers.`;
    const ogDescMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
    if (ogDescMatch) {
      synopsis = ogDescMatch[1].trim();
    }

    // Clean body HTML: remove scripts, styles, iframes, navs, headers, footers
    let cleanedHtml = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, "")
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, "")
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, "")
      .replace(/<aside\b[^<]*(?:(?!<\/aside>)<[^<]*)*<\/aside>/gi, "");

    // Convert paragraph tags to newlines
    cleanedHtml = cleanedHtml
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<br\s*[\/]?>/gi, "\n")
      .replace(/<[^>]+>/g, " ");

    // Decode basic HTML entities
    const rawText = cleanedHtml
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/[ \t]+/g, " ")
      .replace(/\n\s*\n\s*\n+/g, "\n\n")
      .trim();

    const chapters = segmentChaptersFromText(rawText);
    const totalWords = chapters.reduce((acc, c) => acc + c.wordCount, 0);

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    return {
      slug,
      title,
      synopsis,
      coverUrl,
      bannerUrl: coverUrl,
      author: {
        name: authorName,
        username: authorName.toLowerCase().replace(/[^a-z0-9]/g, ""),
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(authorName)}`,
        verified: true,
      },
      genres: [
        { id: "fantasy", name: "Fantasy", slug: "fantasy" },
        { id: "adventure", name: "Adventure", slug: "adventure" },
      ],
      tags: ["Web Novel", "Scraped Novel", "Multi-Chapter"],
      status: "ONGOING",
      rating: 4.8,
      reviewCount: 88,
      readCount: 3200,
      chapterCount: chapters.length,
      wordCount: totalWords,
      isPremium: false,
      isCompleted: false,
      featured: true,
      mood: "Epic & Adventurous",
      category: "trending",
      storyDna: { romance: 40, politics: 60, action: 80, drama: 70, magic: 75 },
      ageRating: "16+",
      language: "English",
      chapters,
    };
  } catch (err) {
    console.error("[scrapeNovelFromUrl Error]", err);
    return null;
  }
}

/**
 * Save an IngestedNovel and its chapters directly to MongoDB collections
 */
export async function saveIngestedNovelToDatabase(novelData: IngestedNovel): Promise<{
  novelId: string;
  chapterCount: number;
}> {
  await connectToDatabase();

  // 1. Ensure genres exist
  for (const g of novelData.genres) {
    await Genre.findOneAndUpdate(
      { slug: g.slug },
      { $setOnInsert: { name: g.name, slug: g.slug, color: "#8b5cf6", novelCount: 1 } },
      { upsert: true }
    );
  }

  // 2. Save/Update Novel
  const { chapters, ...novelProps } = novelData;

  const savedNovel = await Novel.findOneAndUpdate(
    { slug: novelData.slug },
    { $set: { ...novelProps, chapterCount: chapters.length } },
    { upsert: true, new: true }
  );

  // 3. Save all chapters
  if (chapters && chapters.length > 0) {
    for (const ch of chapters) {
      await Chapter.findOneAndUpdate(
        { novelId: savedNovel._id, chapterNumber: ch.chapterNumber },
        {
          $set: {
            novelId: savedNovel._id,
            chapterNumber: ch.chapterNumber,
            title: ch.title,
            content: ch.content,
            wordCount: ch.wordCount,
            isPremium: ch.isPremium,
            status: "PUBLISHED",
          },
        },
        { upsert: true, new: true }
      );
    }
  }

  return {
    novelId: String(savedNovel._id),
    chapterCount: chapters.length,
  };
}

/**
 * Batch ingest top N popular novels for a given topic from Gutenberg
 */
export async function batchIngestTopic(topic: string, count: number = 10): Promise<{
  importedCount: number;
  novels: Array<{ title: string; slug: string; chapterCount: number }>;
}> {
  const searchRes = await searchGlobalNovels({ topic, page: 1 });
  const booksToImport = searchRes.results.slice(0, count);

  const importedList: Array<{ title: string; slug: string; chapterCount: number }> = [];

  for (const book of booksToImport) {
    try {
      const fullNovel = await fetchGutenbergNovel(book.id);
      if (fullNovel && fullNovel.chapters.length > 0) {
        await saveIngestedNovelToDatabase(fullNovel);
        importedList.push({
          title: fullNovel.title,
          slug: fullNovel.slug,
          chapterCount: fullNovel.chapters.length,
        });
      }
    } catch (e) {
      console.warn(`[batchIngestTopic] Skipped book ID ${book.id}`, e);
    }
  }

  return {
    importedCount: importedList.length,
    novels: importedList,
  };
}

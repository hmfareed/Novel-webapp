/**
 * Open Library Service
 * Provides search, metadata resolution, cover artwork retrieval, and edition details from openlibrary.org.
 */

import { UnifiedBookSearchResult } from "@/types/book";

const OPEN_LIBRARY_BASE = "https://openlibrary.org";
const USER_AGENT = "NovelVerse/2.0 (Legitimate Open Library Catalog Service; contact@novelverse.app)";

export interface OpenLibraryDoc {
  key: string; // e.g. "/works/OL45804W"
  title: string;
  subtitle?: string;
  author_name?: string[];
  author_key?: string[];
  first_publish_year?: number;
  isbn?: string[];
  cover_i?: number;
  cover_edition_key?: string;
  publisher?: string[];
  subject?: string[];
  language?: string[];
  number_of_pages_median?: number;
  edition_count?: number;
  ia?: string[];
  public_scan_b?: boolean;
}

/**
 * Searches the Open Library catalog
 */
export async function searchOpenLibrary(params: {
  query?: string;
  subject?: string;
  author?: string;
  page?: number;
  limit?: number;
}): Promise<{ count: number; results: UnifiedBookSearchResult[] }> {
  try {
    const { query = "", subject = "", author = "", page = 1, limit = 20 } = params;
    const searchParams = new URLSearchParams();

    if (query.trim()) searchParams.set("q", query.trim());
    if (subject.trim()) searchParams.set("subject", subject.trim());
    if (author.trim()) searchParams.set("author", author.trim());

    searchParams.set("page", String(page));
    searchParams.set("limit", String(limit));
    searchParams.set("fields", "key,title,subtitle,author_name,author_key,first_publish_year,isbn,cover_i,cover_edition_key,publisher,subject,number_of_pages_median,public_scan_b");

    const url = `${OPEN_LIBRARY_BASE}/search.json?${searchParams.toString()}`;
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`[Open Library Service] Search returned status ${res.status}`);
      return { count: 0, results: [] };
    }

    const data = await res.json();
    const docs: OpenLibraryDoc[] = data.docs || [];

    const results: UnifiedBookSearchResult[] = docs.map((doc) => {
      // Work key or edition key clean ID
      const workId = doc.key.replace("/works/", "").replace("/books/", "");

      // Resolve high-res cover
      let coverUrl = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop";
      if (doc.cover_i) {
        coverUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
      } else if (doc.isbn && doc.isbn[0]) {
        coverUrl = `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-L.jpg`;
      }

      const primaryIsbn = doc.isbn?.[0] || "";

      return {
        id: workId,
        source: "openlibrary" as const,
        title: doc.title,
        subtitle: doc.subtitle,
        authors: doc.author_name && doc.author_name.length > 0 ? doc.author_name : ["Open Library Author"],
        description: `Published in ${doc.first_publish_year || "N/A"} by ${doc.publisher?.[0] || "Various Publishers"}. Subjects: ${(doc.subject || []).slice(0, 3).join(", ") || "General Literature"}`,
        coverUrl,
        publishedDate: doc.first_publish_year ? String(doc.first_publish_year) : undefined,
        publisher: doc.publisher?.[0],
        pageCount: doc.number_of_pages_median || undefined,
        isbn: primaryIsbn,
        isPublicDomain: Boolean(doc.public_scan_b),
        isReadable: false, // Open Library works are metadata-centric unless linked to Internet Archive
        previewUrl: `https://openlibrary.org${doc.key}`,
        subjects: doc.subject || [],
      };
    });

    return {
      count: data.numFound || 0,
      results,
    };
  } catch (error) {
    console.error("[Open Library Service] Search error:", error);
    return { count: 0, results: [] };
  }
}

/**
 * Fetches specific Work / Edition metadata from Open Library by Work ID (e.g. OL45804W)
 */
export async function fetchOpenLibraryWork(workId: string): Promise<{
  title: string;
  description: string;
  authors: string[];
  covers: string[];
  subjects: string[];
  publishDate?: string;
  isbn10?: string;
  isbn13?: string;
  publisher?: string;
  pageCount?: number;
} | null> {
  try {
    const cleanId = workId.replace("/works/", "").replace("/books/", "").trim();
    const url = `${OPEN_LIBRARY_BASE}/works/${cleanId}.json`;

    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
    });

    if (!res.ok) return null;
    const workData = await res.json();

    // Extract Description (can be string or { type: string, value: string })
    let description = "";
    if (typeof workData.description === "string") {
      description = workData.description;
    } else if (workData.description && typeof workData.description.value === "string") {
      description = workData.description.value;
    }

    // Extract Covers
    const covers: string[] = [];
    if (Array.isArray(workData.covers)) {
      for (const covId of workData.covers) {
        if (covId && covId > 0) {
          covers.push(`https://covers.openlibrary.org/b/id/${covId}-L.jpg`);
        }
      }
    }

    // Extract Authors by author keys
    const authorNames: string[] = [];
    if (Array.isArray(workData.authors)) {
      for (const a of workData.authors.slice(0, 3)) {
        const authorKey = a.author?.key || a.key;
        if (authorKey) {
          try {
            const aRes = await fetch(`${OPEN_LIBRARY_BASE}${authorKey}.json`, {
              headers: { "User-Agent": USER_AGENT },
            });
            if (aRes.ok) {
              const aData = await aRes.json();
              if (aData.name) authorNames.push(aData.name);
            }
          } catch {
            // Ignore author fetch failure
          }
        }
      }
    }

    return {
      title: workData.title || "Untitled Book",
      description: description || `Work ${workId} on Open Library catalog.`,
      authors: authorNames.length > 0 ? authorNames : ["Open Library Author"],
      covers,
      subjects: workData.subjects || [],
    };
  } catch (error) {
    console.error("[Open Library Service] fetchWork error:", error);
    return null;
  }
}

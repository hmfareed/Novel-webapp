/**
 * Google Books API Service
 * Fetches volume information, high-res covers, industry identifiers, descriptions, and preview URLs.
 */

import { UnifiedBookSearchResult } from "@/types/book";

const GOOGLE_BOOKS_BASE = "https://www.googleapis.com/books/v1/volumes";

export interface GoogleBookVolumeInfo {
  title: string;
  subtitle?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  industryIdentifiers?: Array<{ type: string; identifier: string }>;
  pageCount?: number;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  imageLinks?: {
    smallThumbnail?: string;
    thumbnail?: string;
    small?: string;
    medium?: string;
    large?: string;
    extraLarge?: string;
  };
  language?: string;
  previewLink?: string;
  infoLink?: string;
  canonicalVolumeLink?: string;
}

export interface GoogleBookItem {
  id: string;
  volumeInfo: GoogleBookVolumeInfo;
  accessInfo?: {
    viewability?: string;
    embeddable?: boolean;
    publicDomain?: boolean;
    webReaderLink?: string;
  };
}

/**
 * Searches the Google Books catalog
 */
export async function searchGoogleBooks(params: {
  query?: string;
  author?: string;
  isbn?: string;
  genre?: string;
  page?: number;
  maxResults?: number;
}): Promise<{ count: number; results: UnifiedBookSearchResult[] }> {
  try {
    const { query = "", author = "", isbn = "", genre = "", page = 1, maxResults = 20 } = params;

    const qTerms: string[] = [];
    if (query.trim()) qTerms.push(query.trim());
    if (author.trim()) qTerms.push(`inauthor:${author.trim()}`);
    if (isbn.trim()) qTerms.push(`isbn:${isbn.trim()}`);
    if (genre.trim()) qTerms.push(`subject:${genre.trim()}`);

    if (qTerms.length === 0) {
      qTerms.push("fiction");
    }

    const startIndex = Math.max(0, (page - 1) * maxResults);
    const searchParams = new URLSearchParams({
      q: qTerms.join("+"),
      startIndex: String(startIndex),
      maxResults: String(Math.min(40, maxResults)),
      printType: "books",
      orderBy: "relevance",
    });

    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    if (apiKey) {
      searchParams.set("key", apiKey);
    }

    const url = `${GOOGLE_BOOKS_BASE}?${searchParams.toString()}`;
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`[Google Books Service] API returned status ${res.status}`);
      return { count: 0, results: [] };
    }

    const data = await res.json();
    const items: GoogleBookItem[] = data.items || [];

    const results: UnifiedBookSearchResult[] = items.map((item) => {
      const v = item.volumeInfo || {};

      // Upgrade Google Books HTTP thumbnail to HTTPS and high resolution
      let coverUrl = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop";
      const rawThumb =
        v.imageLinks?.extraLarge ||
        v.imageLinks?.large ||
        v.imageLinks?.medium ||
        v.imageLinks?.thumbnail ||
        v.imageLinks?.smallThumbnail;

      if (rawThumb) {
        coverUrl = rawThumb.replace(/^http:\/\//i, "https://").replace(/&edge=curl/g, "");
      }

      const isbn13 = v.industryIdentifiers?.find((i) => i.type === "ISBN_13")?.identifier;
      const isbn10 = v.industryIdentifiers?.find((i) => i.type === "ISBN_10")?.identifier;
      const isPublicDomain = Boolean(item.accessInfo?.publicDomain);

      return {
        id: item.id,
        source: "googlebooks" as const,
        title: v.title || "Untitled Book",
        subtitle: v.subtitle,
        authors: v.authors && v.authors.length > 0 ? v.authors : ["Google Books Author"],
        description: v.description || "Official Google Books volume record.",
        coverUrl,
        publishedDate: v.publishedDate,
        publisher: v.publisher,
        pageCount: v.pageCount,
        isbn: isbn13 || isbn10,
        isPublicDomain,
        isReadable: isPublicDomain,
        previewUrl: v.previewLink || v.infoLink || item.accessInfo?.webReaderLink,
        subjects: v.categories || [],
      };
    });

    return {
      count: data.totalItems || 0,
      results,
    };
  } catch (error) {
    console.error("[Google Books Service] search error:", error);
    return { count: 0, results: [] };
  }
}

/**
 * Fetches a single volume directly by Google Books Volume ID
 */
export async function fetchGoogleBookVolume(volumeId: string): Promise<GoogleBookItem | null> {
  try {
    const cleanId = volumeId.trim();
    let url = `${GOOGLE_BOOKS_BASE}/${cleanId}`;

    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    if (apiKey) {
      url += `?key=${apiKey}`;
    }

    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("[Google Books Service] fetchVolume error:", error);
    return null;
  }
}

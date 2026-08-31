/**
 * Unified Book Normalizer
 * Translates and standardizes external API formats (Gutenberg, Open Library, Google Books, Manual)
 * into a single unified `NormalizedBook` matching our MongoDB `Novel` model.
 */

import { NormalizedBook, ParsedBookChapter, StoryDNA, BookGenre, BookAuthor } from "@/types/book";
import { GutenbergBookRaw, parseGutenbergChapters } from "./gutenberg.service";
import { OpenLibraryDoc } from "./open-library.service";
import { GoogleBookItem } from "./google-books.service";

// Curated mood and fallback banner/covers by genre
const GENRE_PALETTES: Record<
  string,
  { name: string; slug: string; mood: string; cover: string; storyDna: StoryDNA }
> = {
  fantasy: {
    name: "Fantasy",
    slug: "fantasy",
    mood: "Mystical & Enchanting",
    cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    storyDna: { romance: 40, politics: 50, action: 75, drama: 60, magic: 95 },
  },
  adventure: {
    name: "Adventure",
    slug: "adventure",
    mood: "Epic & Thrilling",
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
    storyDna: { romance: 30, politics: 45, action: 90, drama: 65, magic: 40 },
  },
  dark_fantasy: {
    name: "Dark Fantasy",
    slug: "dark_fantasy",
    mood: "Dark & Intense",
    cover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
    storyDna: { romance: 35, politics: 65, action: 80, drama: 85, magic: 90 },
  },
  romance: {
    name: "Romance",
    slug: "romance",
    mood: "Passionate & Heartfelt",
    cover: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop",
    storyDna: { romance: 95, politics: 30, action: 20, drama: 80, magic: 20 },
  },
  mystery: {
    name: "Mystery",
    slug: "mystery",
    mood: "Suspenseful & Enigmatic",
    cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop",
    storyDna: { romance: 25, politics: 60, action: 55, drama: 85, magic: 15 },
  },
  scifi: {
    name: "Sci-Fi",
    slug: "sci-fi",
    mood: "Cosmic & Futuristic",
    cover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    storyDna: { romance: 20, politics: 70, action: 85, drama: 65, magic: 60 },
  },
  classics: {
    name: "Classics",
    slug: "classics",
    mood: "Timeless & Literary",
    cover: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=800&auto=format&fit=crop",
    storyDna: { romance: 50, politics: 50, action: 40, drama: 80, magic: 10 },
  },
  african_literature: {
    name: "African Stories",
    slug: "african_stories",
    mood: "Rich & Ancestral",
    cover: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=800&auto=format&fit=crop",
    storyDna: { romance: 45, politics: 80, action: 60, drama: 90, magic: 70 },
  },
};

/**
 * Creates a unique, URL-safe slug from title and optional author
 */
export function generateSlug(title: string, author?: string): string {
  const base = `${title} ${author || ""}`.trim();
  const slug = base
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return slug || `novel-${Date.now()}`;
}

/**
 * Detects genres and mood from subject tags
 */
export function resolveGenreInfo(subjects: string[] = []): {
  primaryGenre: BookGenre;
  genres: BookGenre[];
  mood: string;
  storyDna: StoryDNA;
  category: "african_stories" | "dark_fantasy" | "trending" | "popular" | "new_releases";
} {
  const subStr = subjects.join(" ").toLowerCase();

  if (subStr.includes("africa") || subStr.includes("nigeria") || subStr.includes("yoruba") || subStr.includes("folklore")) {
    const p = GENRE_PALETTES.african_literature;
    return {
      primaryGenre: { id: p.slug, name: p.name, slug: p.slug },
      genres: [{ id: p.slug, name: p.name, slug: p.slug }, { id: "classics", name: "Classics", slug: "classics" }],
      mood: p.mood,
      storyDna: p.storyDna,
      category: "african_stories",
    };
  }

  if (subStr.includes("horror") || subStr.includes("gothic") || subStr.includes("vampire") || subStr.includes("monster") || subStr.includes("dracula")) {
    const p = GENRE_PALETTES.dark_fantasy;
    return {
      primaryGenre: { id: p.slug, name: p.name, slug: p.slug },
      genres: [{ id: p.slug, name: p.name, slug: p.slug }, { id: "fantasy", name: "Fantasy", slug: "fantasy" }],
      mood: p.mood,
      storyDna: p.storyDna,
      category: "dark_fantasy",
    };
  }

  if (subStr.includes("fantasy") || subStr.includes("magic") || subStr.includes("fairy") || subStr.includes("wizard")) {
    const p = GENRE_PALETTES.fantasy;
    return {
      primaryGenre: { id: p.slug, name: p.name, slug: p.slug },
      genres: [{ id: p.slug, name: p.name, slug: p.slug }],
      mood: p.mood,
      storyDna: p.storyDna,
      category: "popular",
    };
  }

  if (subStr.includes("romance") || subStr.includes("love") || subStr.includes("courtship")) {
    const p = GENRE_PALETTES.romance;
    return {
      primaryGenre: { id: p.slug, name: p.name, slug: p.slug },
      genres: [{ id: p.slug, name: p.name, slug: p.slug }],
      mood: p.mood,
      storyDna: p.storyDna,
      category: "trending",
    };
  }

  if (subStr.includes("mystery") || subStr.includes("detective") || subStr.includes("crime") || subStr.includes("holmes")) {
    const p = GENRE_PALETTES.mystery;
    return {
      primaryGenre: { id: p.slug, name: p.name, slug: p.slug },
      genres: [{ id: p.slug, name: p.name, slug: p.slug }],
      mood: p.mood,
      storyDna: p.storyDna,
      category: "trending",
    };
  }

  if (subStr.includes("science fiction") || subStr.includes("space") || subStr.includes("alien") || subStr.includes("time travel")) {
    const p = GENRE_PALETTES.scifi;
    return {
      primaryGenre: { id: p.slug, name: p.name, slug: p.slug },
      genres: [{ id: p.slug, name: p.name, slug: p.slug }],
      mood: p.mood,
      storyDna: p.storyDna,
      category: "trending",
    };
  }

  // Default fallback to Classics
  const p = GENRE_PALETTES.classics;
  return {
    primaryGenre: { id: p.slug, name: p.name, slug: p.slug },
    genres: [{ id: p.slug, name: p.name, slug: p.slug }],
    mood: p.mood,
    storyDna: p.storyDna,
    category: "popular",
  };
}

/**
 * Normalizes Project Gutenberg book with parsed chapters
 */
export function normalizeGutenbergBook(
  meta: GutenbergBookRaw,
  rawText: string
): NormalizedBook {
  const title = meta.title.split("\n")[0].trim();
  const authorName = meta.authors?.[0]?.name
    ? meta.authors[0].name.includes(",")
      ? meta.authors[0].name.split(",").reverse().join(" ").trim()
      : meta.authors[0].name
    : "Classic Public Domain Author";

  const chapters = parseGutenbergChapters(rawText);
  const totalWords = chapters.reduce((acc, c) => acc + c.wordCount, 0);

  const { genres, mood, storyDna, category } = resolveGenreInfo(meta.subjects || []);
  const coverUrl =
    meta.formats["image/jpeg"] ||
    GENRE_PALETTES[genres[0]?.slug || "classics"]?.cover ||
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop";

  const slug = generateSlug(title, authorName);

  return {
    slug,
    title,
    synopsis: `Experience the unabridged masterwork "${title}" by ${authorName}. Digitized and formatted for an immersive digital reading experience on NovelVerse.`,
    description: `Public domain work preserved from Project Gutenberg. Subjects: ${(meta.subjects || []).slice(0, 5).join(", ")}.`,
    coverUrl,
    bannerUrl: coverUrl,
    author: {
      name: authorName,
      username: authorName.toLowerCase().replace(/[^a-z0-9]/g, "") || "author",
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(authorName)}`,
      verified: true,
    },
    genres,
    tags: (meta.subjects || []).slice(0, 5),
    status: "COMPLETED",
    rating: 4.9,
    reviewCount: Math.floor((meta.download_count || 120) / 10) + 25,
    readCount: (meta.download_count || 100) * 12,
    chapterCount: chapters.length,
    wordCount: totalWords,
    isPremium: false,
    isCompleted: true,
    featured: (meta.download_count || 0) > 1000,
    mood,
    category,
    storyDna,
    ageRating: "13+",
    language: meta.languages?.[0] ? meta.languages[0].toUpperCase() : "English",
    source: "gutenberg",
    sourceId: String(meta.id),
    sourceUrl: `https://www.gutenberg.org/ebooks/${meta.id}`,
    readingUrl: `/read/${slug}/1`,
    contentType: "full_text",
    isPublicDomain: true,
    isReadable: true,
    chapters,
  };
}

/**
 * Normalizes Open Library Work / Edition
 */
export function normalizeOpenLibraryBook(doc: {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  authors: string[];
  covers: string[];
  subjects?: string[];
  publishDate?: string;
  publisher?: string;
  isbn10?: string;
  isbn13?: string;
  pageCount?: number;
}): NormalizedBook {
  const authorName = doc.authors[0] || "Open Library Author";
  const { genres, mood, storyDna, category } = resolveGenreInfo(doc.subjects || []);

  const coverUrl =
    doc.covers[0] ||
    GENRE_PALETTES[genres[0]?.slug || "classics"]?.cover ||
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop";

  const slug = generateSlug(doc.title, authorName);

  return {
    slug,
    title: doc.title,
    subtitle: doc.subtitle,
    synopsis: doc.description || `A renowned literary work "${doc.title}" written by ${authorName}. Verified Open Library catalog record.`,
    description: doc.description,
    coverUrl,
    bannerUrl: coverUrl,
    author: {
      name: authorName,
      username: authorName.toLowerCase().replace(/[^a-z0-9]/g, "") || "author",
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(authorName)}`,
      verified: true,
    },
    genres,
    tags: (doc.subjects || []).slice(0, 5),
    status: "COMPLETED",
    rating: 4.8,
    reviewCount: 45,
    readCount: 1500,
    chapterCount: 0,
    wordCount: (doc.pageCount || 250) * 300,
    pageCount: doc.pageCount,
    isPremium: false,
    isCompleted: true,
    featured: false,
    mood,
    category,
    storyDna,
    ageRating: "16+",
    language: "English",
    publisher: doc.publisher,
    publishedDate: doc.publishDate,
    isbn10: doc.isbn10,
    isbn13: doc.isbn13,
    source: "openlibrary",
    sourceId: doc.id,
    sourceUrl: `https://openlibrary.org/works/${doc.id}`,
    previewUrl: `https://openlibrary.org/works/${doc.id}`,
    contentType: "metadata_only",
    isPublicDomain: false,
    isReadable: false,
    chapters: [],
  };
}

/**
 * Normalizes Google Books Volume Item
 */
export function normalizeGoogleBook(item: GoogleBookItem): NormalizedBook {
  const v = item.volumeInfo || {};
  const authorName = v.authors?.[0] || "Google Books Author";
  const { genres, mood, storyDna, category } = resolveGenreInfo(v.categories || []);

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
  const slug = generateSlug(v.title || "book", authorName);

  return {
    slug,
    title: v.title || "Untitled Book",
    subtitle: v.subtitle,
    synopsis: v.description || `An official publication titled "${v.title}" authored by ${authorName}.`,
    description: v.description,
    coverUrl,
    bannerUrl: coverUrl,
    author: {
      name: authorName,
      username: authorName.toLowerCase().replace(/[^a-z0-9]/g, "") || "author",
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(authorName)}`,
      verified: true,
    },
    genres,
    tags: (v.categories || []).slice(0, 5),
    status: "COMPLETED",
    rating: v.averageRating || 4.7,
    reviewCount: v.ratingsCount || 60,
    readCount: 2200,
    chapterCount: 0,
    wordCount: (v.pageCount || 200) * 300,
    pageCount: v.pageCount,
    isPremium: false,
    isCompleted: true,
    featured: false,
    mood,
    category,
    storyDna,
    ageRating: "16+",
    language: v.language ? v.language.toUpperCase() : "English",
    publisher: v.publisher,
    publishedDate: v.publishedDate,
    isbn10,
    isbn13,
    source: "googlebooks",
    sourceId: item.id,
    sourceUrl: v.infoLink || v.canonicalVolumeLink,
    previewUrl: v.previewLink || item.accessInfo?.webReaderLink,
    contentType: isPublicDomain ? "full_text" : "preview_only",
    isPublicDomain,
    isReadable: isPublicDomain,
    chapters: [],
  };
}

/**
 * Normalizes custom or manual raw text input with auto-segmented chapters
 */
export function normalizeManualBook(data: {
  title: string;
  author: string;
  genre?: string;
  synopsis?: string;
  coverUrl?: string;
  rawText: string;
  isPublicDomain?: boolean;
}): NormalizedBook {
  const authorName = data.author || "NovelVerse Author";
  const { genres, mood, storyDna, category } = resolveGenreInfo(data.genre ? [data.genre] : ["Fantasy"]);

  const chapters = parseGutenbergChapters(data.rawText);
  const totalWords = chapters.reduce((acc, c) => acc + c.wordCount, 0);

  const coverUrl =
    data.coverUrl ||
    GENRE_PALETTES[genres[0]?.slug || "fantasy"]?.cover ||
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop";

  const slug = generateSlug(data.title, authorName);

  return {
    slug,
    title: data.title,
    synopsis: data.synopsis || `An original multi-chapter book titled "${data.title}" by ${authorName}.`,
    description: data.synopsis,
    coverUrl,
    bannerUrl: coverUrl,
    author: {
      name: authorName,
      username: authorName.toLowerCase().replace(/[^a-z0-9]/g, "") || "author",
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(authorName)}`,
      verified: true,
    },
    genres,
    tags: [data.genre || "Fiction", "Multi-Chapter", "Original"],
    status: "PUBLISHED",
    rating: 5.0,
    reviewCount: 1,
    readCount: 1,
    chapterCount: chapters.length,
    wordCount: totalWords,
    isPremium: false,
    isCompleted: true,
    featured: true,
    mood,
    category,
    storyDna,
    ageRating: "16+",
    language: "English",
    source: "manual",
    sourceId: `custom-${Date.now()}`,
    readingUrl: `/read/${slug}/1`,
    contentType: "full_text",
    isPublicDomain: Boolean(data.isPublicDomain),
    isReadable: true,
    chapters,
  };
}

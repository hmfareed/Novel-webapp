export type BookSource = "gutenberg" | "openlibrary" | "googlebooks" | "manual";

export type BookContentType = "full_text" | "metadata_only" | "preview_only";

export interface BookAuthor {
  authorId?: string;
  name: string;
  username: string;
  avatar?: string;
  verified?: boolean;
}

export interface BookGenre {
  id: string;
  name: string;
  slug: string;
}

export interface StoryDNA {
  romance: number;
  politics: number;
  action: number;
  drama: number;
  magic: number;
}

export interface ParsedBookChapter {
  chapterNumber: number;
  title: string;
  content: string;
  wordCount: number;
  isPremium: boolean;
}

export interface NormalizedBook {
  slug: string;
  title: string;
  subtitle?: string;
  synopsis: string;
  description?: string;
  coverUrl: string;
  bannerUrl?: string;
  author: BookAuthor;
  genres: BookGenre[];
  tags: string[];
  status: "PUBLISHED" | "COMPLETED" | "ONGOING";
  rating: number;
  reviewCount: number;
  readCount: number;
  chapterCount: number;
  wordCount: number;
  isPremium: boolean;
  isCompleted: boolean;
  featured: boolean;
  mood?: string;
  category?: "african_stories" | "dark_fantasy" | "trending" | "popular" | "new_releases";
  storyDna: StoryDNA;
  ageRating: string;
  language: string;
  publisher?: string;
  publishedDate?: string;
  isbn10?: string;
  isbn13?: string;
  pageCount?: number;
  source: BookSource;
  sourceId?: string;
  sourceUrl?: string;
  previewUrl?: string;
  readingUrl?: string;
  contentType: BookContentType;
  isPublicDomain: boolean;
  isReadable: boolean;
  chapters?: ParsedBookChapter[];
}

export interface UnifiedBookSearchResult {
  id: string;
  source: BookSource;
  title: string;
  subtitle?: string;
  authors: string[];
  description?: string;
  coverUrl: string;
  publishedDate?: string;
  publisher?: string;
  pageCount?: number;
  isbn?: string;
  isPublicDomain: boolean;
  isReadable: boolean;
  previewUrl?: string;
  subjects?: string[];
  downloadCount?: number;
}

export interface ImportBookPayload {
  source: BookSource;
  sourceId?: string;
  title?: string;
  author?: string;
  genre?: string;
  synopsis?: string;
  coverUrl?: string;
  rawText?: string;
  isPublicDomain?: boolean;
}

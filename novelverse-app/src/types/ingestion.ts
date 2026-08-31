export interface ParsedChapter {
  chapterNumber: number;
  title: string;
  content: string;
  wordCount: number;
  isPremium: boolean;
}

export interface IngestedNovel {
  slug: string;
  title: string;
  synopsis: string;
  coverUrl: string;
  bannerUrl: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  genres: Array<{ id: string; name: string; slug: string }>;
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
  mood: string;
  category: "african_stories" | "dark_fantasy" | "trending" | "popular" | "new_releases";
  storyDna: {
    romance: number;
    politics: number;
    action: number;
    drama: number;
    magic: number;
  };
  ageRating: string;
  language: string;
  chapters: ParsedChapter[];
  sourceId?: string | number;
}

export interface GlobalNovelSearchResult {
  id: number;
  title: string;
  authors: Array<{ name: string; birth_year?: number; death_year?: number }>;
  subjects: string[];
  coverUrl: string;
  downloadCount: number;
  languages: string[];
  formats: Record<string, string>;
}

export interface CuratedNovelItem {
  id: number;
  title: string;
  author: string;
  genre: string;
  topic: string;
  description: string;
  estimatedChapters: number;
  coverUrl: string;
}

export const CURATED_ICONIC_NOVELS: CuratedNovelItem[] = [
  {
    id: 84,
    title: "Frankenstein",
    author: "Mary Wollstonecraft Shelley",
    genre: "Dark Fantasy / Sci-Fi",
    topic: "horror",
    description: "The complete iconic gothic masterwork of Victor Frankenstein and the awakened creature.",
    estimatedChapters: 24,
    coverUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 345,
    title: "Dracula",
    author: "Bram Stoker",
    genre: "Dark Fantasy / Gothic",
    topic: "vampires",
    description: "The unabridged vampire classic recounting Count Dracula's voyage to England.",
    estimatedChapters: 27,
    coverUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 35,
    title: "The Time Machine",
    author: "H. G. Wells",
    genre: "Sci-Fi / Adventure",
    topic: "science_fiction",
    description: "Journey into the far future to witness the strange evolutionary fate of humanity.",
    estimatedChapters: 16,
    coverUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 11,
    title: "Alice's Adventures in Wonderland",
    author: "Lewis Carroll",
    genre: "Fantasy / Adventure",
    topic: "fantasy",
    description: "Tumble down the rabbit hole into a realm of talking animals, mad tea parties, and queens.",
    estimatedChapters: 12,
    coverUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 174,
    title: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    genre: "Dark Fantasy / Drama",
    topic: "horror",
    description: "A dark tale of eternal youth, moral corruption, and a sinister portrait that bears all sins.",
    estimatedChapters: 20,
    coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2852,
    title: "The Hound of the Baskervilles",
    author: "Arthur Conan Doyle",
    genre: "Mystery / Thriller",
    topic: "detective",
    description: "Sherlock Holmes and Dr. Watson investigate a spectral demonic hound on the foggy moors.",
    estimatedChapters: 15,
    coverUrl: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 1342,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance / Drama",
    topic: "romance",
    description: "The timeless enemies-to-lovers masterwork between Elizabeth Bennet and Mr. Darcy.",
    estimatedChapters: 61,
    coverUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 1260,
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    genre: "Gothic Romance",
    topic: "romance",
    description: "An orphaned governess uncovers the dark secret haunting Thornfield Hall and Mr. Rochester.",
    estimatedChapters: 38,
    coverUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 120,
    title: "Treasure Island",
    author: "Robert Louis Stevenson",
    genre: "Adventure / Pirates",
    topic: "adventure",
    description: "Jim Hawkins embarks on a dangerous voyage against Long John Silver to find Captain Flint's gold.",
    estimatedChapters: 34,
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
  },
];

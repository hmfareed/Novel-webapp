"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Library,
  Search,
  Download,
  Database,
  Globe,
  BookOpen,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Layers,
  FileText,
  Clock,
  Flame,
  ArrowRight,
  Plus,
  Compass,
  Link as LinkIcon,
  BookMarked,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CatalogStats {
  totalNovels: number;
  totalChapters: number;
  totalGenres: number;
  publicDomainNovels: number;
  readableNovels: number;
  sources: {
    gutenberg: number;
    openlibrary: number;
    googlebooks: number;
    manual: number;
  };
}

interface RecentImportItem {
  _id: string;
  title: string;
  slug: string;
  author: { name: string };
  rating?: number;
  chapterCount?: number;
  coverUrl?: string;
  source?: string;
  isReadable?: boolean;
  isPublicDomain?: boolean;
  createdAt: string;
}

interface SearchResultItem {
  id: string | number;
  title: string;
  author: string;
  coverUrl?: string;
  subjects?: string[];
  source: "gutenberg" | "openlibrary" | "googlebooks";
  isReadable?: boolean;
  pageCount?: number;
  publisher?: string;
  publishYear?: string;
  isbn?: string;
  previewUrl?: string;
  description?: string;
}

export default function AdminLibraryPage() {
  const [stats, setStats] = React.useState<CatalogStats | null>(null);
  const [recentImports, setRecentImports] = React.useState<RecentImportItem[]>([]);
  const [loadingStats, setLoadingStats] = React.useState(true);

  // Search States
  const [searchSource, setSearchSource] = React.useState<"gutenberg" | "openlibrary" | "googlebooks">("gutenberg");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [topicQuery, setTopicQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [importingId, setImportingId] = React.useState<string | number | null>(null);

  // URL Scraper State
  const [scrapeUrl, setScrapeUrl] = React.useState("");
  const [isScraping, setIsScraping] = React.useState(false);

  // Batch Ingestion State
  const [batchTopic, setBatchTopic] = React.useState("fantasy");
  const [batchCount, setBatchCount] = React.useState(5);
  const [isBatchIngesting, setIsBatchIngesting] = React.useState(false);
  const [isSeedingAll, setIsSeedingAll] = React.useState(false);

  // Load stats on mount
  const fetchStats = React.useCallback(async () => {
    try {
      setLoadingStats(true);
      const res = await fetch("/api/books/stats");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setRecentImports(data.recentImports || []);
        }
      }
    } catch (err) {
      console.error("Failed to load catalog stats:", err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  React.useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Execute Live Search across external source
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim() && !topicQuery.trim()) {
      toast.info("Please enter a search keyword or select a topic.");
      return;
    }

    try {
      setIsSearching(true);
      const params = new URLSearchParams({
        source: searchSource,
        query: searchQuery.trim(),
        topic: topicQuery.trim(),
      });

      const res = await fetch(`/api/books/search?${params.toString()}`);
      if (!res.ok) throw new Error("Search request failed");
      const data = await res.json();

      if (data.success) {
        const formatted: SearchResultItem[] = [];

        if (searchSource === "gutenberg") {
          interface GutenbergResult {
            id: number;
            title: string;
            authors?: Array<{ name: string }>;
            coverUrl?: string;
            formats?: Record<string, string>;
            subjects?: string[];
          }
          (data.results as GutenbergResult[] || []).forEach((b) => {
            formatted.push({
              id: b.id,
              title: b.title,
              author: b.authors?.[0]?.name ? b.authors[0].name.split(",").reverse().join(" ").trim() : "Classic Author",
              coverUrl: b.coverUrl || b.formats?.["image/jpeg"],
              subjects: b.subjects?.slice(0, 3),
              source: "gutenberg",
              isReadable: true,
              publishYear: "Public Domain",
            });
          });
        } else if (searchSource === "openlibrary") {
          interface OpenLibraryResult {
            key?: string;
            id?: string;
            title: string;
            authors?: string[];
            author_name?: string[];
            covers?: string[];
            cover_i?: number;
            subjects?: string[];
            subject?: string[];
            publisher?: string[];
            first_publish_year?: number;
            isbn?: string[];
          }
          (data.docs as OpenLibraryResult[] || []).forEach((doc) => {
            const key = doc.key ? doc.key.replace("/works/", "") : doc.id || "";
            formatted.push({
              id: key,
              title: doc.title,
              author: doc.authors?.[0] || doc.author_name?.[0] || "Open Library Author",
              coverUrl: doc.covers?.[0] || (doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : undefined),
              subjects: (doc.subjects || doc.subject || []).slice(0, 3),
              source: "openlibrary",
              isReadable: false,
              publisher: doc.publisher?.[0],
              publishYear: doc.first_publish_year ? String(doc.first_publish_year) : undefined,
              isbn: doc.isbn?.[0],
            });
          });
        } else if (searchSource === "googlebooks") {
          interface GoogleBookResult {
            id: string;
            volumeInfo?: {
              title?: string;
              authors?: string[];
              imageLinks?: { thumbnail?: string; smallThumbnail?: string };
              categories?: string[];
              publisher?: string;
              publishedDate?: string;
              pageCount?: number;
              previewLink?: string;
              description?: string;
            };
            accessInfo?: {
              publicDomain?: boolean;
            };
          }
          (data.items as GoogleBookResult[] || []).forEach((item) => {
            const v = item.volumeInfo || {};
            const thumb = v.imageLinks?.thumbnail || v.imageLinks?.smallThumbnail;
            formatted.push({
              id: item.id,
              title: v.title || "Untitled Book",
              author: v.authors?.[0] || "Google Books Author",
              coverUrl: thumb ? thumb.replace(/^http:\/\//i, "https://") : undefined,
              subjects: v.categories?.slice(0, 3),
              source: "googlebooks",
              isReadable: Boolean(item.accessInfo?.publicDomain),
              publisher: v.publisher,
              publishYear: v.publishedDate,
              pageCount: v.pageCount,
              previewUrl: v.previewLink,
              description: v.description,
            });
          });
        }

        setSearchResults(formatted);
        if (formatted.length === 0) {
          toast.info("No matching books found for this query.");
        }
      }
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to search books.");
    } finally {
      setIsSearching(false);
    }
  };

  // Import single book
  const handleImportBook = async (book: SearchResultItem) => {
    try {
      setImportingId(book.id);
      const res = await fetch("/api/books/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: book.source,
          sourceId: String(book.id),
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Successfully imported "${book.title}"!`);
        fetchStats();
      } else {
        toast.error(data.error || "Failed to import novel.");
      }
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Import failed.");
    } finally {
      setImportingId(null);
    }
  };

  // Scrape Web Novel from URL
  const handleScrapeUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scrapeUrl.trim()) return;

    try {
      setIsScraping(true);
      const res = await fetch("/api/novels/scrape-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scrapeUrl.trim() }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Web novel scraped and saved successfully!");
        setScrapeUrl("");
        fetchStats();
      } else {
        toast.error(data.error || "Failed to scrape URL.");
      }
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Scraping failed.");
    } finally {
      setIsScraping(false);
    }
  };

  // Seed Entire Iconic Library
  const handleSeedAll = async () => {
    try {
      setIsSeedingAll(true);
      const res = await fetch("/api/books/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Database seeded with iconic library!");
        fetchStats();
      } else {
        toast.error(data.error || "Failed to seed library.");
      }
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Seeding failed.");
    } finally {
      setIsSeedingAll(false);
    }
  };

  // Batch Ingest Topic
  const handleBatchIngestTopic = async () => {
    try {
      setIsBatchIngesting(true);
      const res = await fetch("/api/novels/sync-catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "topic_batch",
          topic: batchTopic,
          count: batchCount,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Batch imported ${data.importedCount || batchCount} novels on ${batchTopic}!`);
        fetchStats();
      } else {
        toast.error(data.error || "Batch ingestion failed.");
      }
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Batch ingestion failed.");
    } finally {
      setIsBatchIngesting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
      {/* Top Banner & Quick Seed */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-violet-950/60 via-zinc-900 to-zinc-950 border border-violet-500/30 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-600 text-white uppercase tracking-wider">
              Control Center
            </span>
            <span className="text-xs text-zinc-400">Universal Multi-Source Ingestion</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Library & Source Catalog Ingestion
          </h1>
          <p className="text-xs text-zinc-300 max-w-2xl">
            Search, preview, and import thousands of novels directly from Project Gutenberg (70K+ full text), Open Library, Google Books, or scrape any web novel URL into NovelVerse.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            onClick={fetchStats}
            variant="outline"
            size="sm"
            disabled={loadingStats}
            className="border-white/10 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 text-xs rounded-xl gap-1.5"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", loadingStats && "animate-spin")} />
            <span>Refresh Stats</span>
          </Button>

          <Button
            onClick={handleSeedAll}
            disabled={isSeedingAll}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl px-4 shadow-lg shadow-violet-600/30 border border-violet-400/30 gap-1.5"
          >
            <Sparkles className={cn("w-3.5 h-3.5", isSeedingAll && "animate-spin")} />
            <span>{isSeedingAll ? "Seeding Catalog..." : "Seed Iconic Catalog"}</span>
          </Button>
        </div>
      </div>

      {/* Catalog Overview Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-zinc-950 border border-white/5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-violet-400" /> Total Novels
          </span>
          <p className="text-xl font-black text-white tabular-nums">
            {stats ? stats.totalNovels : "..."}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950 border border-white/5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
            <Layers className="w-3 h-3 text-emerald-400" /> Total Chapters
          </span>
          <p className="text-xl font-black text-white tabular-nums">
            {stats ? stats.totalChapters : "..."}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950 border border-white/5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
            <Globe className="w-3 h-3 text-cyan-400" /> Gutenberg
          </span>
          <p className="text-xl font-black text-cyan-300 tabular-nums">
            {stats ? stats.sources.gutenberg : "..."}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950 border border-white/5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
            <BookMarked className="w-3 h-3 text-amber-400" /> Open Library
          </span>
          <p className="text-xl font-black text-amber-300 tabular-nums">
            {stats ? stats.sources.openlibrary : "..."}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950 border border-white/5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
            <BarChart3 className="w-3 h-3 text-blue-400" /> Google Books
          </span>
          <p className="text-xl font-black text-blue-300 tabular-nums">
            {stats ? stats.sources.googlebooks : "..."}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950 border border-white/5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
            <FileText className="w-3 h-3 text-rose-400" /> Originals / Scraped
          </span>
          <p className="text-xl font-black text-rose-300 tabular-nums">
            {stats ? stats.sources.manual : "..."}
          </p>
        </div>
      </div>

      {/* Main Tabs: Live Search & Ingestion */}
      <Tabs
        defaultValue="search"
        className="space-y-6"
      >
        <TabsList className="bg-zinc-950 border border-white/10 p-1 rounded-2xl">
          <TabsTrigger value="search" className="rounded-xl px-5 text-xs font-semibold">
            <Search className="w-3.5 h-3.5 mr-2" />
            Live Search & Import
          </TabsTrigger>
          <TabsTrigger value="scraper" className="rounded-xl px-5 text-xs font-semibold">
            <LinkIcon className="w-3.5 h-3.5 mr-2" />
            Web Novel URL Scraper
          </TabsTrigger>
          <TabsTrigger value="batch" className="rounded-xl px-5 text-xs font-semibold">
            <Download className="w-3.5 h-3.5 mr-2" />
            Batch Topic Ingestion
          </TabsTrigger>
          <TabsTrigger value="recent" className="rounded-xl px-5 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 mr-2" />
            Recent Catalog Imports ({recentImports.length})
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: LIVE SEARCH & IMPORT */}
        <TabsContent value="search" className="space-y-6">
          <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 space-y-5">
            {/* Source Selector Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-zinc-400 mr-2">Target Source:</span>
              {[
                { id: "gutenberg", label: "Project Gutenberg (70K+ Full Text)", color: "border-cyan-500 text-cyan-300" },
                { id: "openlibrary", label: "Open Library (Works Catalog)", color: "border-amber-500 text-amber-300" },
                { id: "googlebooks", label: "Google Books API", color: "border-blue-500 text-blue-300" },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSearchSource(s.id as typeof searchSource);
                    setSearchResults([]);
                  }}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all",
                    searchSource === s.id
                      ? "bg-violet-600 text-white border-violet-400 shadow-md font-bold"
                      : "bg-zinc-900/60 text-zinc-400 hover:text-white border-white/5"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Search Input Bar */}
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-6 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search book title, author, or keyword (e.g. Dracula, Dune, Frank Herbert)..."
                  className="w-full bg-zinc-900 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
              </div>

              <div className="md:col-span-4">
                <input
                  type="text"
                  value={topicQuery}
                  onChange={(e) => setTopicQuery(e.target.value)}
                  placeholder="Optional Topic/Genre (e.g. fantasy, sci-fi, horror)..."
                  className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
              </div>

              <div className="md:col-span-2">
                <Button
                  type="submit"
                  disabled={isSearching}
                  className="w-full h-full min-h-[44px] bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-violet-600/30 gap-2"
                >
                  <Search className={cn("w-4 h-4", isSearching && "animate-spin")} />
                  <span>{isSearching ? "Searching..." : "Search"}</span>
                </Button>
              </div>
            </form>
          </div>

          {/* Search Results Grid */}
          {searchResults.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">
                  Found {searchResults.length} books on {searchSource.toUpperCase()}
                </h3>
                <span className="text-xs text-zinc-400">Click &ldquo;Import to Catalog&rdquo; to add a novel to your site</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {searchResults.map((book) => (
                  <div
                    key={`${book.source}-${book.id}`}
                    className="p-4 rounded-3xl bg-zinc-950 border border-white/10 hover:border-violet-500/40 transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-24 rounded-xl overflow-hidden relative shrink-0 bg-zinc-900 border border-white/10">
                          {book.coverUrl ? (
                            <Image
                              src={book.coverUrl}
                              alt={book.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-600">
                              <BookOpen className="w-6 h-6" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-zinc-900 border border-white/10 text-violet-300 inline-block">
                            {book.source}
                          </span>
                          <h4 className="text-xs font-bold text-white line-clamp-2 group-hover:text-violet-300 transition-colors">
                            {book.title}
                          </h4>
                          <p className="text-[11px] text-zinc-400 truncate">by {book.author}</p>
                          {book.publishYear && (
                            <p className="text-[10px] text-zinc-500">{book.publishYear}</p>
                          )}
                        </div>
                      </div>

                      {book.subjects && book.subjects.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {book.subjects.map((sub, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] px-2 py-0.5 rounded-md bg-zinc-900 border border-white/5 text-zinc-400"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        {book.isReadable ? "Full Text Free" : "Catalog Record"}
                      </span>

                      <Button
                        size="sm"
                        disabled={importingId === book.id}
                        onClick={() => handleImportBook(book)}
                        className="h-8 px-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-[11px] font-bold text-white shadow-md gap-1.5"
                      >
                        <Download className={cn("w-3 h-3", importingId === book.id && "animate-spin")} />
                        <span>{importingId === book.id ? "Importing..." : "Import"}</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* TAB 2: WEB NOVEL URL SCRAPER */}
        <TabsContent value="scraper" className="space-y-6">
          <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 space-y-6 max-w-2xl">
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-violet-400" />
                Universal Web Novel Prose Scraper
              </h3>
              <p className="text-xs text-zinc-400">
                Paste any external web novel webpage URL. The scraper extracts the title, author, synopsis, cover image, and automatically segments the text into numbered chapters.
              </p>
            </div>

            <form onSubmit={handleScrapeUrl} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Web Novel URL:</label>
                <input
                  type="url"
                  value={scrapeUrl}
                  onChange={(e) => setScrapeUrl(e.target.value)}
                  placeholder="https://example.com/novel/my-epic-story"
                  className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
              </div>

              <Button
                type="submit"
                disabled={isScraping || !scrapeUrl.trim()}
                className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-2xl px-6 py-3 shadow-lg shadow-violet-600/30 gap-2"
              >
                <Download className={cn("w-4 h-4", isScraping && "animate-spin")} />
                <span>{isScraping ? "Scraping & Ingesting..." : "Scrape & Ingest Novel"}</span>
              </Button>
            </form>
          </div>
        </TabsContent>

        {/* TAB 3: BATCH TOPIC INGESTION */}
        <TabsContent value="batch" className="space-y-6">
          <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 space-y-6 max-w-2xl">
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                Mass Gutenberg Topic Batch Ingestion
              </h3>
              <p className="text-xs text-zinc-400">
                Automatically ingest top popular full-text novels for any genre directly into MongoDB with all chapters segmented.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Genre / Topic:</label>
                <select
                  value={batchTopic}
                  onChange={(e) => setBatchTopic(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="fantasy">Fantasy & Magic</option>
                  <option value="adventure">Adventure & Voyages</option>
                  <option value="horror">Dark Fantasy & Horror</option>
                  <option value="science fiction">Sci-Fi & Space</option>
                  <option value="mystery">Mystery & Detective</option>
                  <option value="romance">Romance & Courtship</option>
                  <option value="classics">World Classics</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Novel Count to Ingest:</label>
                <select
                  value={batchCount}
                  onChange={(e) => setBatchCount(parseInt(e.target.value, 10))}
                  className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-violet-500"
                >
                  <option value={3}>3 Novels</option>
                  <option value={5}>5 Novels</option>
                  <option value={10}>10 Novels</option>
                </select>
              </div>
            </div>

            <Button
              onClick={handleBatchIngestTopic}
              disabled={isBatchIngesting}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs rounded-2xl px-6 py-3 shadow-lg shadow-violet-600/30 gap-2"
            >
              <Download className={cn("w-4 h-4", isBatchIngesting && "animate-spin")} />
              <span>{isBatchIngesting ? `Ingesting ${batchCount} Novels...` : `Start Batch Ingest (${batchCount} Novels)`}</span>
            </Button>
          </div>
        </TabsContent>

        {/* TAB 4: RECENT CATALOG IMPORTS */}
        <TabsContent value="recent" className="space-y-4">
          <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white">Recent Catalog Additions</h3>
            {recentImports.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center">No recent imports found.</p>
            ) : (
              <div className="divide-y divide-white/5">
                {recentImports.map((novel) => (
                  <div
                    key={novel._id}
                    className="py-3.5 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-14 rounded-lg overflow-hidden relative shrink-0 bg-zinc-900 border border-white/10">
                        {novel.coverUrl && (
                          <img
                            src={novel.coverUrl}
                            alt={novel.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-zinc-900 border border-white/10 text-violet-300">
                            {novel.source || "manual"}
                          </span>
                          <span className="text-xs font-bold text-white truncate">
                            {novel.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400">by {novel.author?.name || "Author"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-zinc-400 font-mono">
                        {novel.chapterCount || 0} chs
                      </span>
                      <Link href={`/novels/${novel.slug}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-3 rounded-xl border-white/10 text-xs text-zinc-300 hover:text-white"
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-1" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

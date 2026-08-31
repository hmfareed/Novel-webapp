"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/novelverse/navbar";
import { Footer } from "@/components/novelverse/footer";
import { Button } from "@/components/ui/button";
import { UnifiedBookSearchResult } from "@/types/book";
import { CURATED_ICONIC_NOVELS } from "@/types/ingestion";
import {
  Sparkles,
  Search,
  CheckCircle2,
  Loader2,
  FileText,
  ArrowRight,
  Database,
  Layers,
  ChevronRight,
  BookOpen,
  Library,
  ExternalLink,
  ShieldCheck,
  Zap,
} from "lucide-react";
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

export default function NovelImportStudioPage() {
  const [activeTab, setActiveTab] = React.useState<
    "curated" | "gutenberg" | "openlibrary" | "googlebooks" | "custom_text"
  >("curated");

  // Database stats
  const [dbStats, setDbStats] = React.useState<CatalogStats>({
    totalNovels: 0,
    totalChapters: 0,
    totalGenres: 0,
    publicDomainNovels: 0,
    readableNovels: 0,
    sources: { gutenberg: 0, openlibrary: 0, googlebooks: 0, manual: 0 },
  });

  // Curated single import state
  const [importingId, setImportingId] = React.useState<number | string | null>(null);
  const [importedIds, setImportedIds] = React.useState<string[]>([]);

  // Search state for Gutenberg / OpenLibrary / GoogleBooks
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchGenre, setSearchGenre] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<UnifiedBookSearchResult[]>([]);

  // Curated batch sync
  const [isBatchSyncing, setIsBatchSyncing] = React.useState(false);

  // Custom text state
  const [customTitle, setCustomTitle] = React.useState("");
  const [customAuthor, setCustomAuthor] = React.useState("");
  const [customGenre, setCustomGenre] = React.useState("Fantasy");
  const [customCoverUrl, setCustomCoverUrl] = React.useState("");
  const [customSynopsis, setCustomSynopsis] = React.useState("");
  const [customRawText, setCustomRawText] = React.useState("");
  const [isCustomImporting, setIsCustomImporting] = React.useState(false);

  // Fetch live stats
  const loadDbStats = React.useCallback(async () => {
    try {
      const res = await fetch("/api/books/stats");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.stats) {
          setDbStats(data.stats);
        }
      }
    } catch (e) {
      console.warn("Failed to load db stats", e);
    }
  }, []);

  React.useEffect(() => {
    loadDbStats();
  }, [loadDbStats]);

  // Execute catalog search across active source
  const handleSearch = async (source: "gutenberg" | "openlibrary" | "googlebooks") => {
    if (!searchQuery.trim() && !searchGenre.trim()) {
      toast.error("Please enter a search query or select a topic.");
      return;
    }

    setIsSearching(true);
    setSearchResults([]);

    try {
      const params = new URLSearchParams({
        source,
        query: searchQuery.trim(),
        topic: searchGenre.trim(),
      });

      const res = await fetch(`/api/books/search?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setSearchResults(data.results || []);
        toast.success(`Found ${data.count || data.results?.length || 0} books from ${source.toUpperCase()}`);
      } else {
        toast.error(data.error || `Search failed on ${source}`);
      }
    } catch {
      toast.error("Network error while searching catalog.");
    } finally {
      setIsSearching(false);
    }
  };

  // Import single book from search result
  const handleImportBook = async (book: UnifiedBookSearchResult) => {
    setImportingId(book.id);
    try {
      const res = await fetch("/api/books/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: book.source,
          sourceId: book.id,
          title: book.title,
          author: book.authors[0],
          synopsis: book.description,
          coverUrl: book.coverUrl,
          isPublicDomain: book.isPublicDomain,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setImportedIds((prev) => [...prev, String(book.id)]);
        toast.success(
          data.isReadable
            ? `"${book.title}" ingested with ${data.chapterCount || "full"} chapters!`
            : `"${book.title}" metadata saved to catalog!`
        );
        await loadDbStats();
      } else {
        toast.error(data.error || "Failed to import book.");
      }
    } catch {
      toast.error("Network error during import.");
    } finally {
      setImportingId(null);
    }
  };

  // Handle single curated import
  const handleImportCurated = async (novelItem: (typeof CURATED_ICONIC_NOVELS)[0]) => {
    setImportingId(novelItem.id);
    try {
      const res = await fetch("/api/books/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "gutenberg",
          sourceId: String(novelItem.id),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setImportedIds((prev) => [...prev, String(novelItem.id)]);
        toast.success(`"${novelItem.title}" imported with ${data.chapterCount} chapters!`);
        await loadDbStats();
      } else {
        toast.error(data.error || "Failed to import curated novel.");
      }
    } catch {
      toast.error("Network error while importing novel.");
    } finally {
      setImportingId(null);
    }
  };

  // Handle Curated Batch Sync All
  const handleSyncAllCurated = async () => {
    setIsBatchSyncing(true);
    let successCount = 0;

    for (const item of CURATED_ICONIC_NOVELS) {
      try {
        const res = await fetch("/api/books/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: "gutenberg",
            sourceId: String(item.id),
          }),
        });
        if (res.ok) {
          successCount++;
          setImportedIds((prev) => [...prev, String(item.id)]);
        }
      } catch (err) {
        console.warn("Failed to import curated item", item.title, err);
      }
    }

    setIsBatchSyncing(false);
    toast.success(`Batch complete: ${successCount} iconic novels synced with full chapters!`);
    await loadDbStats();
  };

  // Handle custom text manuscript import
  const handleCustomImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle || !customRawText) {
      toast.error("Title and manuscript prose are required.");
      return;
    }

    setIsCustomImporting(true);
    try {
      const res = await fetch("/api/books/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "manual",
          title: customTitle,
          author: customAuthor || "NovelVerse Author",
          genre: customGenre,
          synopsis: customSynopsis,
          coverUrl: customCoverUrl,
          rawText: customRawText,
          isPublicDomain: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Custom novel "${customTitle}" parsed into ${data.chapterCount} chapters!`);
        setCustomTitle("");
        setCustomAuthor("");
        setCustomSynopsis("");
        setCustomCoverUrl("");
        setCustomRawText("");
        await loadDbStats();
      } else {
        toast.error(data.error || "Failed to import custom manuscript.");
      }
    } catch {
      toast.error("Network error during manuscript import.");
    } finally {
      setIsCustomImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-purple-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-800/80 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-2">
              <ShieldCheck className="h-4 w-4" />
              <span>Production Book Library & Catalog Ingestion Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
              Real Novel Library Studio
            </h1>
            <p className="text-sm sm:text-base text-neutral-400 mt-2 max-w-2xl">
              Populate NovelVerse with authentic public domain masterworks, Project Gutenberg full-text novels,
              Open Library records, and Google Books metadata without scraping copyrighted texts.
            </p>
          </div>

          {/* Catalog Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800 backdrop-blur-md">
            <div className="flex flex-col">
              <span className="text-xs text-neutral-400 flex items-center gap-1.5">
                <Library className="h-3.5 w-3.5 text-purple-400" />
                Novels
              </span>
              <span className="text-xl font-bold text-white mt-1">{dbStats.totalNovels}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-neutral-400 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-blue-400" />
                Chapters
              </span>
              <span className="text-xl font-bold text-white mt-1">{dbStats.totalChapters}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-neutral-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                Readable
              </span>
              <span className="text-xl font-bold text-white mt-1">{dbStats.readableNovels}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-neutral-400 flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-amber-400" />
                Gutenberg
              </span>
              <span className="text-xl font-bold text-white mt-1">{dbStats.sources.gutenberg}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 py-6 border-b border-neutral-800/60">
          {[
            { id: "curated", label: "Curated Classics", icon: Sparkles, badge: "Full-Text" },
            { id: "gutenberg", label: "Project Gutenberg (70k+)", icon: BookOpen, badge: "Full-Text" },
            { id: "openlibrary", label: "Open Library (30M+)", icon: Library, badge: "Metadata" },
            { id: "googlebooks", label: "Google Books", icon: Search, badge: "Previews" },
            { id: "custom_text", label: "Custom Manuscript", icon: FileText, badge: "Auto-Split" },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as typeof activeTab);
                  setSearchResults([]);
                }}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                  isActive
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-900/30"
                    : "bg-neutral-900/70 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/80 border border-neutral-800"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md tracking-wider",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-neutral-800 text-neutral-400"
                  )}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: CURATED CLASSICS */}
        {activeTab === "curated" && (
          <div className="py-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-purple-950/20 border border-purple-800/30 rounded-2xl p-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  Iconic Public-Domain Masterworks
                </h2>
                <p className="text-sm text-neutral-300 mt-1">
                  Hand-curated complete novels ready for one-click ingestion into NovelVerse with unabridged chapters.
                </p>
              </div>
              <Button
                onClick={handleSyncAllCurated}
                disabled={isBatchSyncing}
                className="bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-purple-900/40"
              >
                {isBatchSyncing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Syncing All Masterworks...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Sync All Iconic Novels ({CURATED_ICONIC_NOVELS.length})
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {CURATED_ICONIC_NOVELS.map((novel) => {
                const isImported = importedIds.includes(String(novel.id));
                const isCurrent = importingId === novel.id;

                return (
                  <div
                    key={novel.id}
                    className="group relative bg-neutral-900/60 border border-neutral-800 hover:border-purple-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-purple-950/20"
                  >
                    <div>
                      <div className="flex gap-4">
                        <div className="relative w-20 h-28 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0 border border-neutral-700/50 shadow-md">
                          <Image
                            src={novel.coverUrl}
                            alt={novel.title}
                            fill
                            sizes="80px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
                            {novel.genre}
                          </span>
                          <h3 className="font-bold text-white text-base leading-tight mt-1 truncate">
                            {novel.title}
                          </h3>
                          <p className="text-xs text-neutral-400 mt-1 truncate">{novel.author}</p>
                          <div className="flex items-center gap-2 mt-3 text-xs text-neutral-400">
                            <span className="bg-neutral-800 px-2 py-0.5 rounded text-[11px]">
                              ~{novel.estimatedChapters} Chapters
                            </span>
                            <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                              <ShieldCheck className="h-3 w-3" /> Public Domain
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-400 mt-4 line-clamp-2 leading-relaxed">
                        {novel.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-neutral-400">ID: #{novel.id}</span>
                      <Button
                        size="sm"
                        disabled={isCurrent}
                        onClick={() => handleImportCurated(novel)}
                        className={cn(
                          "text-xs font-semibold transition-all",
                          isImported
                            ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30"
                            : "bg-purple-600 hover:bg-purple-500 text-white"
                        )}
                      >
                        {isCurrent ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                            Ingesting...
                          </>
                        ) : isImported ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                            Re-sync
                          </>
                        ) : (
                          <>
                            <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                            Import Full Novel
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2, 3, 4: LIVE CATALOG SEARCH (GUTENBERG, OPEN LIBRARY, GOOGLE BOOKS) */}
        {(activeTab === "gutenberg" || activeTab === "openlibrary" || activeTab === "googlebooks") && (
          <div className="py-8 space-y-6">
            {/* Search Header Banner */}
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
              <div className="max-w-3xl">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  {activeTab === "gutenberg" && <BookOpen className="h-5 w-5 text-purple-400" />}
                  {activeTab === "openlibrary" && <Library className="h-5 w-5 text-blue-400" />}
                  {activeTab === "googlebooks" && <Search className="h-5 w-5 text-emerald-400" />}
                  Search & Ingest from {activeTab === "gutenberg" ? "Project Gutenberg (Full-Text)" : activeTab === "openlibrary" ? "Open Library (Editions & Metadata)" : "Google Books (Metadata & Previews)"}
                </h2>
                <p className="text-sm text-neutral-400 mt-1">
                  {activeTab === "gutenberg" && "Search over 70,000 public domain titles. Ingestion downloads the prose, strips legal boilerplate, and segments it into readable chapters."}
                  {activeTab === "openlibrary" && "Search millions of global works, including African literature, folklore, and classic editions, importing verified catalog records and ISBNs."}
                  {activeTab === "googlebooks" && "Search Google's volume catalog for high-resolution cover artwork, summaries, published metadata, and preview links."}
                </p>
              </div>

              {/* Search Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-6">
                <div className="sm:col-span-7 relative">
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch(activeTab)}
                    placeholder={
                      activeTab === "gutenberg"
                        ? "e.g. Frankenstein, Sherlock Holmes, Jane Austen..."
                        : activeTab === "openlibrary"
                        ? "e.g. African Literature, Chinua Achebe, Fantasy..."
                        : "e.g. Fantasy, ISBN, Neil Gaiman..."
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={searchGenre}
                    onChange={(e) => setSearchGenre(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-200 text-sm focus:outline-none focus:border-purple-500"
                  >
                    <option value="">All Topics / Genres</option>
                    <option value="fantasy">Fantasy & Magic</option>
                    <option value="adventure">Adventure & Voyages</option>
                    <option value="horror">Horror & Gothic</option>
                    <option value="mystery">Mystery & Detective</option>
                    <option value="romance">Romance & Courtship</option>
                    <option value="science_fiction">Science Fiction</option>
                    <option value="african">African Literature</option>
                    <option value="classics">Classics</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <Button
                    onClick={() => handleSearch(activeTab)}
                    disabled={isSearching}
                    className="w-full h-full min-h-[42px] bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm flex items-center justify-center gap-2"
                  >
                    {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    Search
                  </Button>
                </div>
              </div>

              {/* Preset Quick Topic Chips */}
              <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-neutral-400">
                <span>Quick Filters:</span>
                {[
                  "African Literature",
                  "Dark Fantasy",
                  "Sherlock Holmes",
                  "Gothic Romance",
                  "Space Travel",
                  "Philosophy",
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => {
                      setSearchQuery(chip);
                      // Automatic trigger
                    }}
                    className="px-2.5 py-1 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Grid */}
            {searchResults.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-neutral-400">
                  <span>Found {searchResults.length} results</span>
                  <span className="text-xs">Click import to persist book into MongoDB</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((book) => {
                    const isImported = importedIds.includes(String(book.id));
                    const isCurrent = importingId === book.id;

                    return (
                      <div
                        key={book.id}
                        className="bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-xl"
                      >
                        <div>
                          <div className="flex gap-4">
                            <div className="relative w-20 h-28 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0 border border-neutral-700/50">
                              <Image
                                src={book.coverUrl}
                                alt={book.title}
                                fill
                                sizes="80px"
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
                                {book.source}
                              </span>
                              <h3 className="font-bold text-white text-base leading-tight mt-1 line-clamp-2">
                                {book.title}
                              </h3>
                              <p className="text-xs text-neutral-400 mt-1 truncate">
                                {book.authors.join(", ")}
                              </p>

                              <div className="flex items-center gap-2 mt-2">
                                {book.isReadable ? (
                                  <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
                                    <CheckCircle2 className="h-3 w-3" /> Full Text Readable
                                  </span>
                                ) : (
                                  <span className="text-blue-400 text-[11px] font-medium flex items-center gap-1">
                                    <Library className="h-3 w-3" /> Metadata Only
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <p className="text-xs text-neutral-400 mt-3 line-clamp-3 leading-relaxed">
                            {book.description || "No description available."}
                          </p>
                        </div>

                        <div className="mt-5 pt-4 border-t border-neutral-800 flex items-center justify-between">
                          {book.previewUrl ? (
                            <a
                              href={book.previewUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
                            >
                              Source <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-xs text-neutral-500">ID: {book.id}</span>
                          )}

                          <Button
                            size="sm"
                            disabled={isCurrent}
                            onClick={() => handleImportBook(book)}
                            className={cn(
                              "text-xs font-semibold transition-all",
                              isImported
                                ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30"
                                : "bg-purple-600 hover:bg-purple-500 text-white"
                            )}
                          >
                            {isCurrent ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                                Ingesting...
                              </>
                            ) : isImported ? (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                                Ingested
                              </>
                            ) : (
                              <>
                                <Layers className="h-3.5 w-3.5 mr-1.5" />
                                {book.isReadable ? "Import Full Novel" : "Import Metadata"}
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: CUSTOM TEXT MANUSCRIPT */}
        {activeTab === "custom_text" && (
          <div className="py-8 max-w-3xl mx-auto">
            <form
              onSubmit={handleCustomImport}
              className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl"
            >
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-400" />
                  Direct Multi-Chapter Manuscript Ingester
                </h2>
                <p className="text-sm text-neutral-400 mt-1">
                  Paste complete novel manuscripts or public domain prose. The engine automatically detects &quot;Chapter 1&quot;, &quot;Chapter 2&quot; headings and segments them into database records.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-300">Book Title *</label>
                  <input
                    type="text"
                    required
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="e.g. Chronicles of Eldoria"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-300">Author Name</label>
                  <input
                    type="text"
                    value={customAuthor}
                    onChange={(e) => setCustomAuthor(e.target.value)}
                    placeholder="e.g. Jonathan R. Vance"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-300">Genre</label>
                  <select
                    value={customGenre}
                    onChange={(e) => setCustomGenre(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-sm focus:outline-none focus:border-purple-500"
                  >
                    <option value="Fantasy">Fantasy</option>
                    <option value="Dark Fantasy">Dark Fantasy</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Romance">Romance</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="African Literature">African Stories</option>
                    <option value="Classics">Classics</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-300">Cover Image URL (Optional)</label>
                  <input
                    type="url"
                    value={customCoverUrl}
                    onChange={(e) => setCustomCoverUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300">Synopsis / Description</label>
                <textarea
                  rows={3}
                  value={customSynopsis}
                  onChange={(e) => setCustomSynopsis(e.target.value)}
                  placeholder="A short synopsis describing the story..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300">
                  Full Manuscript Prose (Multi-Chapter) *
                </label>
                <textarea
                  rows={12}
                  required
                  value={customRawText}
                  onChange={(e) => setCustomRawText(e.target.value)}
                  placeholder="Paste complete manuscript here (e.g. Chapter 1: The Beginning... Chapter 2: The Journey...)"
                  className="w-full font-mono text-xs px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-200 focus:outline-none focus:border-purple-500 leading-relaxed"
                />
              </div>

              <Button
                type="submit"
                disabled={isCustomImporting}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30"
              >
                {isCustomImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Parsing & Saving Chapters...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Auto-Segment & Ingest Manuscript
                  </>
                )}
              </Button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

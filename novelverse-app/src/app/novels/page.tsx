"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Search,
  Star,
  Globe,
  SlidersHorizontal,
  Layers,
  Sparkles,
  Calendar,
  Play,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  Check,
  Flame,
  Crown,
  BookMarked,
  BarChart3,
  FileText,
} from "lucide-react";
import { Navbar } from "@/components/novelverse/navbar";
import { Footer } from "@/components/novelverse/footer";
import { Button } from "@/components/ui/button";
import { SEED_NOVELS } from "@/lib/seed-data";
import { cn } from "@/lib/utils";

interface CatalogNovel {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  synopsis?: string;
  coverUrl?: string;
  author: {
    name: string;
    avatar?: string;
  };
  genres: Array<{ id: string; name: string; slug: string }>;
  tags?: string[];
  status?: string;
  rating?: number;
  readCount?: number;
  chapterCount?: number;
  wordCount?: number;
  source?: "gutenberg" | "openlibrary" | "googlebooks" | "manual";
  sourceUrl?: string;
  previewUrl?: string;
  readingUrl?: string;
  contentType?: "full_text" | "metadata_only" | "preview_only";
  isPublicDomain?: boolean;
  isReadable?: boolean;
  publisher?: string;
  publishedDate?: string;
  isbn13?: string;
  pageCount?: number;
}

const SOURCE_TABS = [
  { id: "all", label: "All Sources", icon: Layers, desc: "Complete library across all platforms" },
  { id: "gutenberg", label: "Project Gutenberg", icon: Globe, desc: "70,000+ full-text public domain classics" },
  { id: "openlibrary", label: "Open Library", icon: BookMarked, desc: "Global open literature catalog records" },
  { id: "googlebooks", label: "Google Books", icon: BarChart3, desc: "Volume entries & official web reader previews" },
  { id: "manual", label: "Originals & Web Novels", icon: FileText, desc: "Multi-chapter African epics and web novels" },
] as const;

export default function NovelsCatalogPage() {
  const [novels, setNovels] = React.useState<CatalogNovel[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeSource, setActiveSource] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedGenre, setSelectedGenre] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<"popular" | "rating" | "alphabetical">("popular");

  // Fetch novels from API
  const fetchNovels = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeSource !== "all") params.set("source", activeSource);
      if (selectedGenre !== "all") params.set("genre", selectedGenre);
      if (searchQuery.trim()) params.set("q", searchQuery.trim());

      const res = await fetch(`/api/novels?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.novels)) {
          setNovels(data.novels);
          return;
        }
      }
    } catch (err) {
      console.error("Failed to fetch novels:", err);
    } finally {
      setLoading(false);
    }

    // Fallback to SEED_NOVELS
    setNovels(
      SEED_NOVELS.map((n) => {
        const isGutenberg =
          n.slug === "dracula" ||
          n.slug === "the-adventures-of-sherlock-holmes" ||
          n.slug === "the-time-machine" ||
          n.slug === "pride-and-prejudice";
        return {
          id: n.slug,
          slug: n.slug,
          title: n.title,
          synopsis: n.synopsis,
          coverUrl: n.coverUrl,
          author: n.author,
          genres: n.genres,
          tags: n.tags,
          status: n.status,
          rating: n.rating,
          readCount: n.readCount,
          chapterCount: n.chapterCount,
          wordCount: n.wordCount,
          source: isGutenberg ? "gutenberg" : "manual",
          isReadable: true,
          isPublicDomain: isGutenberg,
          readingUrl: `/read/${n.slug}/1`,
          contentType: "full_text",
        };
      })
    );
    setLoading(false);
  }, [activeSource, selectedGenre, searchQuery]);

  React.useEffect(() => {
    fetchNovels();
  }, [fetchNovels]);

  // Extract all available unique genres
  const genresList = React.useMemo(() => {
    const set = new Set<string>();
    novels.forEach((n) => n.genres?.forEach((g) => set.add(g.name)));
    return ["all", ...Array.from(set)];
  }, [novels]);

  // Sort novels
  const sortedNovels = React.useMemo(() => {
    const list = [...novels];
    if (sortBy === "popular") {
      list.sort((a, b) => (b.readCount || 0) - (a.readCount || 0));
    } else if (sortBy === "rating") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "alphabetical") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [novels, sortBy]);

  const getSourceBadge = (source?: string) => {
    switch (source) {
      case "gutenberg":
        return { label: "Project Gutenberg", bg: "bg-cyan-950/80 text-cyan-300 border-cyan-700/50" };
      case "openlibrary":
        return { label: "Open Library", bg: "bg-amber-950/80 text-amber-300 border-amber-700/50" };
      case "googlebooks":
        return { label: "Google Books", bg: "bg-blue-950/80 text-blue-300 border-blue-700/50" };
      default:
        return { label: "Original / Web Novel", bg: "bg-violet-950/80 text-violet-300 border-violet-700/50" };
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col font-sans selection:bg-violet-600/30 selection:text-white">
      <Navbar />

      <main className="flex-1 pb-24 pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-8">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/80 border border-violet-500/30 text-violet-300 text-xs font-bold">
                <Globe className="w-3.5 h-3.5 text-violet-400" />
                Universal Multi-Source Catalog
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                All Novels & External Libraries
              </h1>
              <p className="text-xs text-zinc-400 max-w-xl">
                Browse our multi-source collection featuring Project Gutenberg 70K+ unabridged classics, Open Library works, Google Books volume records, and original African folklore epics.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <Link href="/admin/library">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-2xl border-white/10 bg-zinc-900/80 text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 gap-1.5 shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  Admin Ingestion Center
                </Button>
              </Link>
            </div>
          </div>

          {/* Source Filter Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {SOURCE_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSource === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSource(tab.id)}
                  className={cn(
                    "p-4 rounded-3xl border text-left transition-all flex flex-col justify-between space-y-2 group",
                    isActive
                      ? "bg-gradient-to-br from-violet-900/80 to-zinc-900 border-violet-400 shadow-xl shadow-violet-600/20"
                      : "bg-zinc-950/70 border-white/5 hover:border-white/20 hover:bg-zinc-900/60"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        "p-2 rounded-2xl transition-transform group-hover:scale-110",
                        isActive ? "bg-violet-600 text-white" : "bg-white/5 text-zinc-400"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    {isActive && <Check className="w-4 h-4 text-violet-400" />}
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors">
                      {tab.label}
                    </h3>
                    <p className="text-[10px] text-zinc-400 line-clamp-1">{tab.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Search, Genre Pills, and Sorting Filter Bar */}
          <div className="p-4 rounded-3xl bg-zinc-950 border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all sources by title, author, or keyword..."
                className="w-full bg-zinc-900 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="bg-zinc-900 border border-white/10 rounded-2xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-violet-500"
              >
                <option value="all">All Genres</option>
                {genresList
                  .filter((g) => g !== "all")
                  .map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-zinc-900 border border-white/10 rounded-2xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-violet-500"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="alphabetical">A to Z</option>
              </select>
            </div>
          </div>

          {/* Novels Showcase Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 animate-pulse">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-zinc-900 rounded-3xl" />
              ))}
            </div>
          ) : sortedNovels.length === 0 ? (
            <div className="text-center py-20 bg-zinc-950/60 border border-white/5 rounded-3xl space-y-4">
              <BookOpen className="w-12 h-12 text-zinc-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">No novels found</h3>
                <p className="text-xs text-zinc-400">
                  Try adjusting your source filter or search query.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
              {sortedNovels.map((novel) => {
                const badge = getSourceBadge(novel.source);
                const hasChapters = (novel.chapterCount || 0) > 0;

                return (
                  <div
                    key={novel.slug}
                    className="group rounded-3xl bg-zinc-950/80 border border-white/10 hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-600/10 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                  >
                    {/* Cover Container */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900 block">
                      <Link href={`/novels/${novel.slug}`}>
                        {novel.coverUrl ? (
                          <Image
                            src={novel.coverUrl}
                            alt={novel.title}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-600">
                            <BookOpen className="w-8 h-8" />
                          </div>
                        )}
                      </Link>

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 pointer-events-none" />

                      {/* Source Badge Pill */}
                      <span
                        className={cn(
                          "absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg text-[9px] font-bold border backdrop-blur-md shadow-md",
                          badge.bg
                        )}
                      >
                        {badge.label}
                      </span>

                      {/* Top-Right Rating Badge */}
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-black/80 border border-white/10 backdrop-blur-md flex items-center gap-1 text-[10px] font-bold text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{(novel.rating || 4.8).toFixed(1)}</span>
                      </div>

                      {/* Bottom Info Bar */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] text-zinc-300">
                        <span className="font-semibold text-emerald-400 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                          {novel.isReadable !== false && hasChapters
                            ? "Full Text Free"
                            : novel.previewUrl
                            ? "Preview Available"
                            : "Catalog Record"}
                        </span>
                        <span className="bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm text-zinc-300">
                          {hasChapters ? `${novel.chapterCount} chs` : novel.pageCount ? `${novel.pageCount} pgs` : "1 Work"}
                        </span>
                      </div>
                    </div>

                    {/* Novel Details & Action CTA */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap gap-1">
                          {novel.genres?.slice(0, 2).map((g) => (
                            <span
                              key={g.id || g.slug}
                              className="text-[9px] px-2 py-0.5 rounded-full bg-violet-950/60 border border-violet-800/30 text-violet-300 font-medium"
                            >
                              {g.name}
                            </span>
                          ))}
                        </div>

                        <Link href={`/novels/${novel.slug}`}>
                          <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-1">
                            {novel.title}
                          </h3>
                        </Link>

                        <p className="text-[11px] text-zinc-400 truncate">by {novel.author?.name || "Author"}</p>
                      </div>

                      <div className="pt-2.5 border-t border-white/5 flex items-center justify-between">
                        {novel.isReadable !== false && hasChapters ? (
                          <Link href={`/read/${novel.slug}/1`} className="w-full">
                            <Button
                              size="sm"
                              className="w-full h-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-[11px] font-bold rounded-xl gap-1 shadow-md shadow-violet-600/30"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>Read Now</span>
                            </Button>
                          </Link>
                        ) : novel.previewUrl ? (
                          <a
                            href={novel.previewUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full"
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full h-8 border-blue-500/40 bg-blue-950/40 hover:bg-blue-900/60 text-blue-300 text-[11px] font-bold rounded-xl gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Preview</span>
                            </Button>
                          </a>
                        ) : (
                          <Link href={`/novels/${novel.slug}`} className="w-full">
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full h-8 border-white/10 hover:bg-zinc-800 text-zinc-300 text-[11px] font-bold rounded-xl gap-1"
                            >
                              <BookOpen className="w-3 h-3" />
                              <span>Details</span>
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

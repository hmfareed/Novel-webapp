"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Compass,
  Search,
  Star,
  BookOpen,
  Calendar,
  SlidersHorizontal,
  ChevronDown,
  X,
  Play,
  RotateCcw,
  Check,
  Flame,
  Globe,
  BookMarked,
  BarChart3,
  FileText,
  ExternalLink,
  Layers,
} from "lucide-react";
import { Navbar } from "@/components/novelverse/navbar";
import { Footer } from "@/components/novelverse/footer";
import { SEED_NOVELS, type SeedNovel } from "@/lib/seed-data";
import { cn } from "@/lib/utils";

const ALL_GENRES = [
  "Action",
  "Adventure",
  "African Stories",
  "Comedy",
  "Dark Fantasy",
  "Drama",
  "Epic Legend",
  "Fantasy",
  "Folklore",
  "Gothic Mystery",
  "Historical",
  "Horror",
  "Mystery",
  "Mythology",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Supernatural",
  "Thriller",
  "Trickster",
];

const ALL_SOURCES = [
  { id: "all", label: "All Sources" },
  { id: "gutenberg", label: "Project Gutenberg" },
  { id: "openlibrary", label: "Open Library" },
  { id: "googlebooks", label: "Google Books" },
  { id: "manual", label: "Originals & Web Novels" },
];

const ALL_TYPES = ["All Types", "Web Novel", "Light Novel", "Original", "Short Story", "Epic Saga"];

const ALL_YEARS = ["All Years", "2026", "2025", "2024", "2023", "2022", "Classic"];

const ALL_STATUSES = ["All Status", "Ongoing", "Completed", "New Drop"];

type SortOption = "popularity" | "trending" | "newest" | "alphabetical" | "rating";

const SORT_LABELS: Record<SortOption, string> = {
  popularity: "Popularity",
  trending: "Trending",
  newest: "Newest",
  alphabetical: "A to Z",
  rating: "Highest Rated",
};

interface EnhancedNovel extends SeedNovel {
  year: string;
  type: string;
  isNewDrop?: boolean;
  source?: "gutenberg" | "openlibrary" | "googlebooks" | "manual";
  sourceUrl?: string;
  previewUrl?: string;
  readingUrl?: string;
  isReadable?: boolean;
  pageCount?: number;
  publisher?: string;
  publishedDate?: string;
  isbn13?: string;
}

export default function ExplorePage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#07090e] text-white flex flex-col">
          <Navbar />
          <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-16 animate-pulse space-y-6">
            <div className="h-12 w-64 bg-zinc-900 rounded-xl" />
            <div className="h-96 bg-zinc-900/50 rounded-2xl" />
          </div>
          <Footer />
        </div>
      }
    >
      <ExploreContent />
    </React.Suspense>
  );
}

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialGenreParam = searchParams.get("genre") || "";
  const initialSearchParam = searchParams.get("search") || "";
  const initialSourceParam = searchParams.get("source") || "all";

  // Filter States
  const [searchQuery, setSearchQuery] = React.useState(initialSearchParam);
  const [selectedSource, setSelectedSource] = React.useState<string>(initialSourceParam);
  const [selectedGenres, setSelectedGenres] = React.useState<string[]>(
    initialGenreParam ? [initialGenreParam] : []
  );
  const [selectedType, setSelectedType] = React.useState<string>("All Types");
  const [selectedYear, setSelectedYear] = React.useState<string>("All Years");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("All Status");
  const [sortBy, setSortBy] = React.useState<SortOption>("popularity");
  const [isSortOpen, setIsSortOpen] = React.useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);
  const [dbNovels, setDbNovels] = React.useState<EnhancedNovel[]>([]);

  // Fetch from live API
  React.useEffect(() => {
    async function loadNovels() {
      try {
        const res = await fetch("/api/novels?limit=100");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.novels) && data.novels.length > 0) {
            const yearMap = ["2024", "2025", "2023", "2026", "2022", "Classic"];
            const mapped: EnhancedNovel[] = data.novels.map((n: EnhancedNovel, idx: number) => ({
              ...n,
              year: n.publishedDate ? n.publishedDate.slice(0, 4) : yearMap[idx % yearMap.length],
              type: idx % 3 === 0 ? "Web Novel" : idx % 3 === 1 ? "Epic Saga" : "Light Novel",
              isNewDrop: idx === 0 || idx === 3,
              source: n.source || "manual",
              chapters: n.chapters || [],
            }));
            setDbNovels(mapped);
            return;
          }
        }
      } catch {
        // Fallback
      }

      // Default Seed Fallback
      const yearMap = ["2024", "2025", "2023", "2026", "2022", "Classic"];
      const seedMapped: EnhancedNovel[] = SEED_NOVELS.map((n, idx) => {
        const isGutenberg =
          n.slug === "dracula" ||
          n.slug === "the-adventures-of-sherlock-holmes" ||
          n.slug === "the-time-machine" ||
          n.slug === "pride-and-prejudice";
        return {
          ...n,
          year: yearMap[idx % yearMap.length],
          type: idx % 3 === 0 ? "Web Novel" : idx % 3 === 1 ? "Epic Saga" : "Light Novel",
          isNewDrop: idx === 0 || idx === 3,
          source: isGutenberg ? "gutenberg" : "manual",
        };
      });
      setDbNovels(seedMapped);
    }

    loadNovels();
  }, []);

  // Sync with URL query parameter
  React.useEffect(() => {
    if (initialGenreParam) {
      const matched = ALL_GENRES.find(
        (g) => g.toLowerCase() === initialGenreParam.toLowerCase() || g.toLowerCase().includes(initialGenreParam.toLowerCase())
      );
      if (matched) {
        setSelectedGenres([matched]);
      } else {
        setSelectedGenres([initialGenreParam]);
      }
    }
  }, [initialGenreParam]);

  // Filter and Sort Logic
  const filteredNovels = React.useMemo(() => {
    let result = [...dbNovels];

    // Source filter
    if (selectedSource !== "all") {
      result = result.filter((n) => (n.source || "manual").toLowerCase() === selectedSource.toLowerCase());
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.author.name.toLowerCase().includes(q) ||
          (n.synopsis && n.synopsis.toLowerCase().includes(q)) ||
          n.genres.some((g) => g.name.toLowerCase().includes(q))
      );
    }

    // Genre filter
    if (selectedGenres.length > 0) {
      result = result.filter((n) =>
        selectedGenres.every((sg) =>
          n.genres.some((g) => g.name.toLowerCase().includes(sg.toLowerCase()) || sg.toLowerCase().includes(g.name.toLowerCase()))
        )
      );
    }

    // Type filter
    if (selectedType !== "All Types") {
      result = result.filter((n) => n.type.toLowerCase() === selectedType.toLowerCase());
    }

    // Year filter
    if (selectedYear !== "All Years") {
      result = result.filter((n) => n.year === selectedYear);
    }

    // Status filter
    if (selectedStatus !== "All Status") {
      if (selectedStatus === "Completed") {
        result = result.filter((n) => n.isCompleted || n.status.toLowerCase() === "completed");
      } else if (selectedStatus === "Ongoing") {
        result = result.filter((n) => !n.isCompleted || n.status.toLowerCase() === "ongoing");
      } else if (selectedStatus === "New Drop") {
        result = result.filter((n) => n.isNewDrop);
      }
    }

    // Sorting
    if (sortBy === "popularity") {
      result.sort((a, b) => b.readCount - a.readCount);
    } else if (sortBy === "trending") {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating);
    } else if (sortBy === "newest") {
      result.sort((a, b) => b.year.localeCompare(a.year) || b.chapterCount - a.chapterCount);
    } else if (sortBy === "alphabetical") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [dbNovels, selectedSource, searchQuery, selectedGenres, selectedType, selectedYear, selectedStatus, sortBy]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedSource !== "all" ||
    selectedGenres.length > 0 ||
    selectedType !== "All Types" ||
    selectedYear !== "All Years" ||
    selectedStatus !== "All Status";

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedSource("all");
    setSelectedGenres([]);
    setSelectedType("All Types");
    setSelectedYear("All Years");
    setSelectedStatus("All Status");
  };

  const getSourceBadge = (source?: string) => {
    switch (source) {
      case "gutenberg":
        return { label: "Gutenberg", bg: "bg-cyan-950/90 text-cyan-300 border-cyan-600/50" };
      case "openlibrary":
        return { label: "Open Library", bg: "bg-amber-950/90 text-amber-300 border-amber-600/50" };
      case "googlebooks":
        return { label: "Google Books", bg: "bg-blue-950/90 text-blue-300 border-blue-600/50" };
      default:
        return { label: "Original", bg: "bg-violet-950/90 text-violet-300 border-violet-600/50" };
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white selection:bg-violet-600/30 selection:text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pb-24 pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-600/30 text-white">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                    Explore Novels & External Sources
                  </h1>
                  <p className="text-xs text-zinc-400 font-medium">
                    {filteredNovels.length.toLocaleString()} {filteredNovels.length === 1 ? "title" : "titles"} across Gutenberg, Open Library, Google Books & Originals
                  </p>
                </div>
              </div>
            </div>

            {/* Top Right: Sort & Filter Controls */}
            <div className="flex items-center gap-3">
              <Link href="/novels">
                <button className="px-3.5 py-2.5 rounded-2xl bg-zinc-900 border border-white/10 hover:border-violet-500/40 text-xs font-bold text-zinc-300 hover:text-white flex items-center gap-1.5 transition-all">
                  <Layers className="w-4 h-4 text-violet-400" />
                  <span>Master Catalog</span>
                </button>
              </Link>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden px-4 py-2.5 rounded-2xl bg-zinc-900 border border-white/10 text-xs font-bold flex items-center gap-2 text-zinc-300 hover:text-white"
              >
                <SlidersHorizontal className="w-4 h-4 text-violet-400" />
                <span>Filters {hasActiveFilters && `(${selectedGenres.length + (selectedSource !== "all" ? 1 : 0)})`}</span>
              </button>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="px-4 py-2.5 rounded-2xl bg-zinc-900/90 border border-white/10 hover:border-violet-500/40 text-xs font-bold text-zinc-200 hover:text-white flex items-center gap-2.5 shadow-lg transition-all"
                >
                  <span className="text-zinc-400 font-normal">Sort:</span>
                  <span className="text-violet-300 font-bold">{SORT_LABELS[sortBy]}</span>
                  <ChevronDown className={cn("w-3.5 h-3.5 text-zinc-400 transition-transform", isSortOpen && "rotate-180")} />
                </button>

                {isSortOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-zinc-950 border border-white/10 shadow-2xl p-1.5 z-40 space-y-1 animate-in fade-in duration-100">
                    {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => {
                          setSortBy(key);
                          setIsSortOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors",
                          sortBy === key
                            ? "bg-violet-600/30 text-violet-200 font-bold border border-violet-500/30"
                            : "text-zinc-400 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <span>{SORT_LABELS[key]}</span>
                        {sortBy === key && <Check className="w-3.5 h-3.5 text-violet-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Layout: Filter Sidebar + Novel Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar */}
            <aside
              className={cn(
                "lg:col-span-3 space-y-6 bg-zinc-950/80 border border-white/10 p-6 rounded-3xl backdrop-blur-xl shadow-2xl h-full flex flex-col justify-between",
                mobileFilterOpen ? "block" : "hidden lg:block"
              )}
            >
              <div className="space-y-6">
                {/* Reset header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-black uppercase tracking-wider text-zinc-200 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-violet-400" />
                    Filters
                  </span>
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="text-[11px] text-violet-400 hover:text-violet-300 flex items-center gap-1 font-bold"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset All
                    </button>
                  )}
                </div>

                {/* 1. Search */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Title or author keyword..."
                      className="w-full bg-zinc-900/80 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/60 transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Source Filter */}
                <div className="space-y-2.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Source Site
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_SOURCES.map((source) => {
                      const isSelected = selectedSource === source.id;
                      return (
                        <button
                          key={source.id}
                          onClick={() => setSelectedSource(source.id)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all border",
                            isSelected
                              ? "bg-violet-600 text-white border-violet-400 shadow-md shadow-violet-600/30 font-bold"
                              : "bg-zinc-900/70 text-zinc-400 hover:text-white hover:bg-zinc-800 border-white/5"
                          )}
                        >
                          {source.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Genres */}
                <div className="space-y-2.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                    <span>Genres</span>
                    {selectedGenres.length > 0 && (
                      <span className="text-[10px] text-violet-400 font-mono font-bold">
                        {selectedGenres.length} selected
                      </span>
                    )}
                  </label>
                  <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
                    {ALL_GENRES.map((genre) => {
                      const isSelected = selectedGenres.includes(genre);
                      return (
                        <button
                          key={genre}
                          onClick={() => toggleGenre(genre)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all duration-200 text-left border",
                            isSelected
                              ? "bg-violet-600 text-white border-violet-400 shadow-md shadow-violet-600/30 font-bold"
                              : "bg-zinc-900/70 text-zinc-400 hover:text-white hover:bg-zinc-800 border-white/5"
                          )}
                        >
                          {genre}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Type */}
                <div className="space-y-2.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Type
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_TYPES.map((type) => {
                      const isSelected = selectedType === type;
                      return (
                        <button
                          key={type}
                          onClick={() => setSelectedType(type)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all border",
                            isSelected
                              ? "bg-violet-600 text-white border-violet-400 shadow-md font-bold"
                              : "bg-zinc-900/70 text-zinc-400 hover:text-white border-white/5"
                          )}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Year */}
                <div className="space-y-2.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Year
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_YEARS.map((year) => {
                      const isSelected = selectedYear === year;
                      return (
                        <button
                          key={year}
                          onClick={() => setSelectedYear(year)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all border",
                            isSelected
                              ? "bg-violet-600 text-white border-violet-400 shadow-md font-bold"
                              : "bg-zinc-900/70 text-zinc-400 hover:text-white border-white/5"
                          )}
                        >
                          {year}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sidebar Footer Hint */}
              <div className="pt-4 border-t border-white/5 text-[11px] text-zinc-500 flex items-center justify-between">
                <span>Free Web Reader</span>
                <span className="text-emerald-400 font-bold">100% Free</span>
              </div>
            </aside>

            {/* Novel Cards Grid */}
            <div className="lg:col-span-9 space-y-6">
              {filteredNovels.length === 0 ? (
                <div className="text-center py-24 bg-zinc-950/60 border border-white/5 rounded-3xl space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-violet-950/40 border border-violet-800/30 mx-auto flex items-center justify-center text-violet-400">
                    <Search className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">No novels match your filters</h3>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                      Try clearing selected source, genre, or keyword filters.
                    </p>
                  </div>
                  <button
                    onClick={clearAllFilters}
                    className="px-5 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white shadow-lg shadow-violet-600/30"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
                  {filteredNovels.map((novel) => {
                    const badge = getSourceBadge(novel.source);
                    const hasChapters = (novel.chapterCount || 0) > 0;

                    return (
                      <div
                        key={novel.slug}
                        className="group flex flex-col space-y-2.5 transition-all duration-300"
                      >
                        {/* Card Cover */}
                        <Link
                          href={`/novels/${novel.slug}`}
                          className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 group-hover:border-violet-500/60 group-hover:shadow-2xl group-hover:shadow-violet-600/20 transition-all duration-300 block"
                        >
                          <Image
                            src={novel.coverUrl || "/assets/mood-epic-adventure.jpg"}
                            alt={novel.title}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                          {/* Source Badge Pill */}
                          <span
                            className={cn(
                              "absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[9px] font-bold border backdrop-blur-md shadow-md",
                              badge.bg
                            )}
                          >
                            {badge.label}
                          </span>

                          {/* Top-Right Rating Badge */}
                          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-black/80 border border-white/10 backdrop-blur-md flex items-center gap-1 text-[11px] font-extrabold text-amber-400 shadow-md">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{(novel.rating || 4.8).toFixed(1)}</span>
                          </div>

                          {/* Quick Read Overlay Icon on Hover */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                            <div className="w-11 h-11 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-xl shadow-violet-600/50 group-hover:scale-110 transition-transform">
                              <Play className="w-5 h-5 fill-current ml-0.5" />
                            </div>
                          </div>
                        </Link>

                        {/* Title & Info */}
                        <div className="space-y-1 min-w-0">
                          <Link href={`/novels/${novel.slug}`}>
                            <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-1">
                              {novel.title}
                            </h3>
                          </Link>

                          <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-medium">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-zinc-500" />
                              {novel.year}
                            </span>
                            <span className="text-zinc-600">•</span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3 text-zinc-500" />
                              {hasChapters ? `${novel.chapterCount} chs` : novel.pageCount ? `${novel.pageCount} pgs` : "1 Work"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Play,
  Users,
  Calendar,
  Star,
  Flame,
  ChevronRight,
  ChevronLeft,
  Compass,
  Heart,
  Search as SearchIcon,
  Atom,
  Sword,
  Landmark,
  Skull,
  Theater,
  Grid,
  Info,
  Layers,
  Crown,
  TrendingUp,
  RotateCcw,
  Clock,
} from "lucide-react";
import { Navbar } from "@/components/novelverse/navbar";
import { Footer } from "@/components/novelverse/footer";
import { Button } from "@/components/ui/button";
import { FriendsActivityFeed } from "@/components/novelverse/social/friends-activity-feed";
import { SEED_NOVELS } from "@/lib/seed-data";
import { getLocalStatsOverview, type LocalReadingProgressItem } from "@/lib/client-reading-tracker";
import { cn } from "@/lib/utils";

interface HeroNovel {
  slug: string;
  title: string;
  badge: {
    text: string;
    icon: React.ComponentType<{ className?: string }>;
  };
  rating: number;
  readCount: string;
  chapterCount: number;
  genres: string[];
  phrase: string;
  backdropUrl: string;
  coverUrl: string;
  author: {
    name: string;
    avatar: string;
  };
}

const HERO_NOVELS: HeroNovel[] = [
  {
    slug: "sundiata-lion-of-mali",
    title: "Sundiata: Lion of Mali",
    badge: { text: "AFRICAN EPIC", icon: Sparkles },
    rating: 4.96,
    readCount: "68K",
    chapterCount: 5,
    genres: ["African Stories", "Fantasy", "Epic Legend"],
    phrase: "A crippled prince rises to wield the ancient bow of iron and defeat the sorcerer king.",
    backdropUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=1600&auto=format&fit=crop",
    coverUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=800&auto=format&fit=crop",
    author: {
      name: "Djeli Mamadou Kouyaté",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    },
  },
  {
    slug: "dracula",
    title: "Dracula",
    badge: { text: "GOTHIC MASTERPIECE", icon: Flame },
    rating: 4.95,
    readCount: "124K",
    chapterCount: 5,
    genres: ["Dark Fantasy", "Horror", "Gothic Mystery"],
    phrase: "From the mist-cloaked Transylvanian peaks to Victorian London—the eternal king of the undead awakens.",
    backdropUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1600&auto=format&fit=crop",
    coverUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=800&auto=format&fit=crop",
    author: {
      name: "Bram Stoker",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    },
  },
  {
    slug: "the-adventures-of-sherlock-holmes",
    title: "The Adventures of Sherlock Holmes",
    badge: { text: "ICONIC MYSTERY", icon: TrendingUp },
    rating: 4.97,
    readCount: "156K",
    chapterCount: 4,
    genres: ["Mystery", "Thriller", "Detective"],
    phrase: "Eliminate the impossible, and whatever remains, however improbable, must be the truth.",
    backdropUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1600&auto=format&fit=crop",
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
    author: {
      name: "Arthur Conan Doyle",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    },
  },
  {
    slug: "the-time-machine",
    title: "The Time Machine",
    badge: { text: "SCI-FI PIONEER", icon: Sword },
    rating: 4.91,
    readCount: "89K",
    chapterCount: 4,
    genres: ["Sci-Fi", "Adventure", "Dystopia"],
    phrase: "A leap into the year 802,701 A.D. reveals the sunlit paradise of the Eloi and the horrors beneath.",
    backdropUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop",
    coverUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    author: {
      name: "H.G. Wells",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop",
    },
  },
  {
    slug: "anansi-and-the-web-of-nyame",
    title: "Anansi & the Web of Nyame",
    badge: { text: "FOLKLORE LEGEND", icon: Sparkles },
    rating: 4.88,
    readCount: "41K",
    chapterCount: 4,
    genres: ["African Stories", "Mythology", "Trickster"],
    phrase: "Armed with silver thread and unmatched cunning, the spider trickster wins all the stories of the world.",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
    coverUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    author: {
      name: "Kwame Asante",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    },
  },
];

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [exploreFilter, setExploreFilter] = useState<"all" | "trending" | "popular" | "new">("all");
  const [continueReadingItem, setContinueReadingItem] = useState<LocalReadingProgressItem | null>(null);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % HERO_NOVELS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + HERO_NOVELS.length) % HERO_NOVELS.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  useEffect(() => {
    const stats = getLocalStatsOverview();
    if (stats.currentlyReading && stats.currentlyReading.length > 0) {
      setContinueReadingItem(stats.currentlyReading[0]);
    } else {
      setContinueReadingItem({
        novelSlug: "sundiata-lion-of-mali",
        novelTitle: "Sundiata: Lion of Mali",
        novelCoverUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=800&auto=format&fit=crop",
        authorName: "Djeli Mamadou Kouyaté",
        totalChapters: 5,
        chapterNumber: 2,
        position: 68,
        percentage: 68,
        completed: false,
        timeSpentSeconds: 780,
        lastReadAt: new Date().toISOString(),
      });
    }
  }, []);

  const activeNovel = HERO_NOVELS[activeIndex];
  const secondaryHeroNovels = HERO_NOVELS.filter((_, idx) => idx !== activeIndex).slice(0, 3);
  const ActiveBadgeIcon = activeNovel.badge.icon;

  const genreGrid = [
    { name: "African Stories", icon: <Sparkles className="w-4 h-4 text-amber-400" />, href: "/explore?genre=African Stories" },
    { name: "Fantasy", icon: <Sparkles className="w-4 h-4 text-violet-400" />, href: "/explore?genre=Fantasy" },
    { name: "Romance", icon: <Heart className="w-4 h-4 text-rose-400" />, href: "/explore?genre=Romance" },
    { name: "Mystery", icon: <SearchIcon className="w-4 h-4 text-cyan-400" />, href: "/explore?genre=Mystery" },
    { name: "Sci-Fi", icon: <Atom className="w-4 h-4 text-blue-400" />, href: "/explore?genre=Sci-Fi" },
    { name: "Adventure", icon: <Compass className="w-4 h-4 text-emerald-400" />, href: "/explore?genre=Adventure" },
    { name: "Thriller", icon: <Sword className="w-4 h-4 text-amber-400" />, href: "/explore?genre=Thriller" },
    { name: "Historical", icon: <Landmark className="w-4 h-4 text-yellow-500" />, href: "/explore?genre=Historical" },
    { name: "Horror", icon: <Skull className="w-4 h-4 text-red-500" />, href: "/explore?genre=Horror" },
    { name: "Drama", icon: <Theater className="w-4 h-4 text-purple-400" />, href: "/explore?genre=Drama" },
    { name: "Dark Fantasy", icon: <Flame className="w-4 h-4 text-pink-400" />, href: "/explore?genre=Dark Fantasy" },
    { name: "All Genres", icon: <Grid className="w-4 h-4 text-zinc-400" />, href: "/explore" },
  ];

  interface HomeNovelItem {
    id?: string;
    slug: string;
    title: string;
    synopsis?: string;
    coverUrl?: string;
    author?: { name: string };
    genres?: Array<{ id?: string; name: string; slug?: string }>;
    rating?: number;
    readCount?: number;
    chapterCount?: number;
    pageCount?: number;
    source?: string;
    featured?: boolean;
    category?: string;
    isReadable?: boolean;
    previewUrl?: string;
  }

  const [apiNovels, setApiNovels] = useState<HomeNovelItem[]>([]);

  useEffect(() => {
    async function loadNovels() {
      try {
        const res = await fetch("/api/novels?limit=40");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.novels) && data.novels.length > 0) {
            setApiNovels(data.novels);
            return;
          }
        }
      } catch {
        // Fallback
      }
      setApiNovels(
        SEED_NOVELS.map((n) => {
          const isGutenberg =
            n.slug === "dracula" ||
            n.slug === "the-adventures-of-sherlock-holmes" ||
            n.slug === "the-time-machine" ||
            n.slug === "pride-and-prejudice";
          return {
            ...n,
            source: isGutenberg ? "gutenberg" : "manual",
            isReadable: true,
            isPublicDomain: isGutenberg,
          };
        })
      );
    }
    loadNovels();
  }, []);

  const novelsPool: HomeNovelItem[] = apiNovels.length > 0 ? apiNovels : SEED_NOVELS;

  const filteredExploreNovels = novelsPool.filter((novel) => {
    if (exploreFilter === "trending") return novel.featured || novel.category === "trending";
    if (exploreFilter === "popular") return (novel.readCount || 0) > 50000;
    if (exploreFilter === "new") return novel.category === "new_releases" || (novel.chapterCount || 0) < 20;
    return true;
  }).slice(0, 8);

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

      <main className="flex-1">
        {/* ============================================================
            SECTION 1: HOME (Cinematic Dynamic Hero Carousel)
            ============================================================ */}
        <section
          id="home"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="scroll-mt-16 relative overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col justify-center py-8 lg:py-12 border-b border-white/5 transition-all duration-700"
        >
          {HERO_NOVELS.map((novel, idx) => (
            <div
              key={novel.slug}
              className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
                idx === activeIndex ? "opacity-90 scale-100" : "opacity-0 scale-105 pointer-events-none"
              }`}
            >
              <Image
                src={novel.backdropUrl}
                alt={novel.title}
                fill
                priority={idx === 0}
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/70" />
            </div>
          ))}

          <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Hero Text */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-violet-950/80 border border-violet-600/50 text-violet-300 text-xs font-semibold backdrop-blur-md shadow-sm">
                    <ActiveBadgeIcon className="w-3.5 h-3.5 text-violet-400" />
                    {activeNovel.badge.text}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 border border-white/10 text-zinc-300 text-xs font-medium backdrop-blur-md">
                    <Layers className="w-3 h-3 text-violet-400" />
                    {activeNovel.chapterCount} Chapters
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 border border-white/10 text-zinc-300 text-xs font-medium backdrop-blur-md">
                    <Users className="w-3 h-3 text-violet-400" />
                    {activeNovel.readCount} readers
                  </span>
                </div>

                <div className="space-y-2">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.06]">
                    {activeNovel.title}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{activeNovel.rating.toFixed(1)} score</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {activeNovel.genres.map((g) => (
                      <span
                        key={g}
                        className="px-3 py-0.5 rounded-full bg-zinc-900/90 border border-white/10 text-[11px] text-zinc-300 font-medium"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-base sm:text-lg text-zinc-300 max-w-xl leading-relaxed font-normal">
                  &ldquo;{activeNovel.phrase}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-1">
                  <div className="w-7 h-7 rounded-full overflow-hidden relative border border-white/20">
                    <Image
                      src={activeNovel.author.avatar}
                      alt={activeNovel.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs text-zinc-300">
                    Written by <strong className="text-white font-semibold">{activeNovel.author.name}</strong>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link href={`/read/${activeNovel.slug}/1`}>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold px-7 h-12 rounded-2xl shadow-lg shadow-violet-600/30 border border-violet-400/30 transition-all hover:scale-105 flex items-center gap-2 text-sm"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      Read Now (Free)
                    </Button>
                  </Link>

                  <Link href={`/novels/${activeNovel.slug}`}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white/15 bg-zinc-950/70 hover:bg-zinc-900 text-zinc-200 hover:text-white font-medium px-6 h-12 rounded-2xl backdrop-blur-md transition-all hover:border-white/30 flex items-center gap-2 text-sm"
                    >
                      <Info className="w-4 h-4 text-violet-400" />
                      Novel Details
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Column: Hero Cards */}
              <div className="lg:col-span-6">
                <div className="flex items-center justify-between mb-3.5 px-1">
                  <span className="text-xs font-bold text-violet-300 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
                    FEATURED STORIES
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevSlide}
                      className="p-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-zinc-400 hover:text-white transition-colors"
                      aria-label="Previous story"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="p-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-zinc-400 hover:text-white transition-colors"
                      aria-label="Next story"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-7">
                    <Link
                      href={`/novels/${activeNovel.slug}`}
                      className="group relative flex flex-col justify-end h-[420px] rounded-3xl overflow-hidden bg-zinc-950 border border-violet-500/50 shadow-2xl shadow-violet-600/20 transition-all duration-300 block ring-1 ring-violet-500/30"
                    >
                      <Image
                        src={activeNovel.coverUrl}
                        alt={activeNovel.title}
                        fill
                        priority
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                      <div className="relative z-10 p-5 space-y-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors">
                          {activeNovel.title}
                        </h3>
                        <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                          {activeNovel.phrase}
                        </p>
                      </div>
                    </Link>
                  </div>

                  <div className="md:col-span-5 flex flex-col gap-3 h-[420px] justify-between">
                    {secondaryHeroNovels.map((novel) => {
                      const novelIndex = HERO_NOVELS.findIndex((n) => n.slug === novel.slug);
                      return (
                        <div
                          key={novel.slug}
                          onClick={() => setActiveIndex(novelIndex)}
                          className="group flex-1 flex gap-3 p-2.5 rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-violet-500/50 hover:bg-zinc-900/90 transition-all items-center cursor-pointer"
                        >
                          <div className="w-20 h-full rounded-xl overflow-hidden relative shrink-0 border border-white/10 bg-zinc-900">
                            <Image
                              src={novel.coverUrl}
                              alt={novel.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex flex-col justify-center min-w-0 space-y-1 flex-1">
                            <h4 className="text-sm font-bold text-white truncate group-hover:text-violet-300 transition-colors">
                              {novel.title}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                              <span className="text-amber-400 font-medium">★ {novel.rating.toFixed(1)}</span>
                              <span>•</span>
                              <span>{novel.readCount}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            MODULE 1 & 4: SMART CONTINUE READING HERO BAR
            ============================================================ */}
        {continueReadingItem && (
          <section className="py-6 border-b border-white/5 bg-gradient-to-r from-violet-950/40 via-zinc-950 to-zinc-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="p-5 rounded-3xl bg-zinc-900/80 border border-violet-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-16 rounded-2xl overflow-hidden relative shrink-0 border border-white/10 bg-zinc-900">
                    <img
                      src={continueReadingItem.novelCoverUrl}
                      alt={continueReadingItem.novelTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400 bg-violet-950/80 px-2 py-0.5 rounded-full border border-violet-500/20">
                        Continue Reading
                      </span>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        Chapter {continueReadingItem.chapterNumber} • {continueReadingItem.percentage}% complete
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white truncate">
                      {continueReadingItem.novelTitle}
                    </h3>
                    <div className="w-48 bg-zinc-800 rounded-full h-1.5 overflow-hidden mt-1">
                      <div
                        className="bg-gradient-to-r from-violet-500 to-indigo-400 h-full rounded-full"
                        style={{ width: `${continueReadingItem.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link href={`/read/${continueReadingItem.novelSlug}/${continueReadingItem.chapterNumber}`}>
                    <Button className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-xs font-bold px-6 py-5 shadow-lg shadow-violet-600/30 flex items-center gap-2">
                      <RotateCcw className="w-4 h-4" />
                      Resume Reading
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================
            SECTION 2: DISCOVER NOVELS & EXPLORE
            ============================================================ */}
        <section id="explore" className="scroll-mt-16 py-16 border-b border-white/5 bg-zinc-950/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-800/40 text-violet-300 text-xs font-semibold mb-3">
                  <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
                  DISCOVER STORIES
                </div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">
                  Explore Curated Novels
                </h2>
                <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                  Hand-crafted epics, dark mysteries, romantic thrillers, and immersive worldbuilding—100% free with zero paywalls.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: "all", label: "All Stories", icon: Layers },
                  { id: "trending", label: "🔥 Trending", icon: Flame },
                  { id: "popular", label: "⭐ Popular", icon: Crown },
                  { id: "new", label: "✨ New Drops", icon: Sparkles },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setExploreFilter(tab.id as typeof exploreFilter)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5",
                      exploreFilter === tab.id
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30 border border-violet-400/30 font-semibold"
                        : "bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5"
                    )}
                  >
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Novel Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredExploreNovels.map((novel) => {
                const badge = getSourceBadge(novel.source);
                const hasChapters = (novel.chapterCount || 0) > 0;

                return (
                  <div
                    key={novel.slug}
                    className="group rounded-3xl bg-zinc-950/80 border border-white/10 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-600/10 transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden block bg-zinc-900">
                      <Link href={`/novels/${novel.slug}`}>
                        <Image
                          src={novel.coverUrl || "/assets/mood-epic-adventure.jpg"}
                          alt={novel.title}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 pointer-events-none" />

                      {/* Source Badge Pill */}
                      <span
                        className={cn(
                          "absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[9px] font-bold border backdrop-blur-md shadow-md",
                          badge.bg
                        )}
                      >
                        {badge.label}
                      </span>

                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-zinc-200">
                        <span className="flex items-center gap-1 font-bold text-amber-400 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {(novel.rating || 4.8).toFixed(1)}
                        </span>
                        <span className="bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm text-zinc-300">
                          {hasChapters ? `${novel.chapterCount} chs` : novel.pageCount ? `${novel.pageCount} pgs` : "1 Work"}
                        </span>
                      </div>
                    </div>

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
                          <h3 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-1">
                            {novel.title}
                          </h3>
                        </Link>

                        <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                          {novel.synopsis}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[11px] text-zinc-400 truncate">
                          {novel.author?.name || "Author"}
                        </span>

                        {novel.isReadable !== false && hasChapters ? (
                          <Link href={`/read/${novel.slug}/1`}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2.5 text-[10px] text-violet-400 hover:text-white hover:bg-violet-600/30 rounded-lg gap-1 font-semibold"
                            >
                              <Play className="w-2.5 h-2.5 fill-violet-400" />
                              Read
                            </Button>
                          </Link>
                        ) : novel.previewUrl ? (
                          <a href={novel.previewUrl} target="_blank" rel="noreferrer">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2.5 text-[10px] text-blue-400 hover:text-white hover:bg-blue-600/30 rounded-lg gap-1 font-semibold"
                            >
                              Preview
                            </Button>
                          </a>
                        ) : (
                          <Link href={`/novels/${novel.slug}`}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2.5 text-[10px] text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg gap-1 font-semibold"
                            >
                              Details
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 text-center">
              <Link href="/explore">
                <Button
                  size="lg"
                  className="bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-violet-500/40 text-white text-xs font-bold px-8 h-12 rounded-2xl transition-all gap-2"
                >
                  <span>Browse All Novels with Filters & Sort</span>
                  <ChevronRight className="w-4 h-4 text-violet-400" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 3: 12 GENRES EXPLORATION GRID (Filtered Links)
            ============================================================ */}
        <section id="genres" className="py-16 border-b border-white/5 bg-zinc-950/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-400">
                Explore Genres under Browse
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Find Your Next Obsession
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {genreGrid.map((g) => (
                <Link
                  key={g.name}
                  href={g.href}
                  className="p-4 rounded-3xl bg-zinc-900/60 border border-white/5 hover:border-violet-500/40 hover:bg-zinc-900 transition-all flex flex-col items-center justify-center gap-2 group text-center"
                >
                  <div className="p-2.5 rounded-2xl bg-white/5 group-hover:bg-violet-600/20 group-hover:scale-110 transition-all">
                    {g.icon}
                  </div>
                  <span className="text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">
                    {g.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 4: READING SCHEDULE & HABIT ROUTINES
            ============================================================ */}
        <section className="py-16 border-b border-white/5 bg-black">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Live Friends Stream */}
              <div className="lg:col-span-6">
                <FriendsActivityFeed maxItems={4} />
              </div>

              {/* Right Column: Schedule & Routine Teaser */}
              <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-violet-950/40 via-zinc-950 to-zinc-950 border border-violet-500/20 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/80 border border-violet-500/30 text-xs font-bold text-violet-300">
                    <Calendar className="w-3.5 h-3.5 text-violet-400" />
                    Reading Schedule & Routines
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Schedule Times to Read Your Favorite Novels
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Set weekly reading time slots, pick target chapter goals, and receive gentle reminder alerts to build an unbreakable reading habit.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link href="/schedule">
                    <Button className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-xs font-bold px-6 py-5 shadow-lg shadow-violet-600/30 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Open Reading Schedule
                    </Button>
                  </Link>

                  <Link href="/bookmarks">
                    <Button variant="outline" className="rounded-2xl border-white/10 text-xs font-bold py-5 px-5">
                      View Bookmarks
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

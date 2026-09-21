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
  Radio,
  Feather,
  BookOpen,
  ShieldCheck,
  Bookmark,
  Share2,
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
  contentClass: "COMMUNITY" | "STUDIO_ORIGINAL" | "PUBLIC_DOMAIN";
  author: {
    name: string;
    avatar: string;
    verified?: boolean;
    roleLabel?: string;
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
    contentClass: "STUDIO_ORIGINAL",
    author: {
      name: "Djeli Mamadou Kouyaté",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      verified: true,
      roleLabel: "Platform Original",
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
    contentClass: "PUBLIC_DOMAIN",
    author: {
      name: "Bram Stoker",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
      verified: true,
      roleLabel: "Classic Archive",
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
    contentClass: "PUBLIC_DOMAIN",
    author: {
      name: "Arthur Conan Doyle",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
      verified: true,
      roleLabel: "Classic Archive",
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
    contentClass: "PUBLIC_DOMAIN",
    author: {
      name: "H.G. Wells",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop",
      verified: true,
      roleLabel: "Classic Archive",
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
    contentClass: "COMMUNITY",
    author: {
      name: "Kwame Asante",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      verified: true,
      roleLabel: "Community Creator",
    },
  },
];

interface HomeNovelItem {
  id?: string;
  slug: string;
  title: string;
  synopsis?: string;
  coverUrl?: string;
  author?: { name: string; username?: string; avatar?: string };
  genres?: Array<{ id?: string; name: string; slug?: string }>;
  subgenres?: string[];
  tropes?: string[];
  moods?: string[];
  contentClass?: "COMMUNITY" | "STUDIO_ORIGINAL" | "PUBLIC_DOMAIN" | "LICENSED";
  novelFormat?: "STANDARD" | "ENHANCED" | "CINEMATIC" | "AUDIO";
  aiAssisted?: boolean;
  aiAssistedLabel?: string;
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

const TROPES_LIST = [
  { label: "All Tropes", id: "all" },
  { label: "Found Family", id: "found_family" },
  { label: "Enemies to Lovers", id: "enemies_to_lovers" },
  { label: "Revenge Arc", id: "revenge" },
  { label: "Chosen One", id: "chosen_one" },
  { label: "Political Intrigue", id: "political_intrigue" },
  { label: "Slow Burn", id: "slow_burn" },
];

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [contentFilter, setContentFilter] = useState<"all" | "COMMUNITY" | "STUDIO_ORIGINAL" | "PUBLIC_DOMAIN">("all");
  const [selectedTrope, setSelectedTrope] = useState<string>("all");
  const [exploreFilter, setExploreFilter] = useState<"all" | "trending" | "popular" | "new">("all");
  const [continueReadingItem, setContinueReadingItem] = useState<LocalReadingProgressItem | null>(null);
  const [apiNovels, setApiNovels] = useState<HomeNovelItem[]>([]);

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
    }, 5000);
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
        // Use seed data on fallback
      }
      setApiNovels(
        SEED_NOVELS.map((n) => {
          const isGutenberg =
            n.slug === "dracula" ||
            n.slug === "the-adventures-of-sherlock-holmes" ||
            n.slug === "the-time-machine" ||
            n.slug === "pride-and-prejudice";
          const isOriginal = n.slug === "sundiata-lion-of-mali";
          return {
            ...n,
            source: isGutenberg ? "gutenberg" : "manual",
            contentClass: isGutenberg ? "PUBLIC_DOMAIN" : isOriginal ? "STUDIO_ORIGINAL" : "COMMUNITY",
            novelFormat: isOriginal ? "ENHANCED" : "STANDARD",
            aiAssisted: isOriginal,
            aiAssistedLabel: isOriginal ? "Platform Studio · Enhanced" : undefined,
            isReadable: true,
            isPublicDomain: isGutenberg,
          };
        })
      );
    }
    loadNovels();
  }, []);

  const novelsPool: HomeNovelItem[] = apiNovels.length > 0 ? apiNovels : SEED_NOVELS;
  const activeNovel = HERO_NOVELS[activeIndex];
  const secondaryHeroNovels = HERO_NOVELS.filter((_, idx) => idx !== activeIndex).slice(0, 3);
  const ActiveBadgeIcon = activeNovel.badge.icon;

  // Tri-arch + explore filtering
  const filteredNovels = novelsPool.filter((novel) => {
    if (contentFilter !== "all" && novel.contentClass !== contentFilter) {
      return false;
    }
    if (exploreFilter === "trending") return novel.featured || novel.category === "trending";
    if (exploreFilter === "popular") return (novel.readCount || 0) > 40000;
    if (exploreFilter === "new") return novel.category === "new_releases" || (novel.chapterCount || 0) <= 5;
    return true;
  });

  const getSourceBadge = (source?: string, contentClass?: string) => {
    if (contentClass === "STUDIO_ORIGINAL") {
      return { label: "Studio Original", bg: "bg-amber-950/90 text-amber-300 border-amber-500/50" };
    }
    if (contentClass === "COMMUNITY") {
      return { label: "Community Author", bg: "bg-emerald-950/90 text-emerald-300 border-emerald-500/50" };
    }
    if (source === "gutenberg" || contentClass === "PUBLIC_DOMAIN") {
      return { label: "Public Domain", bg: "bg-cyan-950/90 text-cyan-300 border-cyan-600/50" };
    }
    return { label: "NovelVerse", bg: "bg-violet-950/90 text-violet-300 border-violet-600/50" };
  };

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

  return (
    <div className="min-h-screen bg-[#07090e] text-white selection:bg-violet-600/30 selection:text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* ============================================================
            HERO CAROUSEL: CINEMATIC ECOSYSTEM SHOWCASE
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
              {/* Left Column: Story Details & Actions */}
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
                  <div className="w-8 h-8 rounded-full overflow-hidden relative border border-violet-400/40">
                    <Image
                      src={activeNovel.author.avatar}
                      alt={activeNovel.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-300">
                      By <strong className="text-white font-semibold">{activeNovel.author.name}</strong>
                    </span>
                    <span className="text-[10px] text-violet-400 font-mono">
                      {activeNovel.author.roleLabel || "Creator"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link href={`/read/${activeNovel.slug}/1`}>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold px-7 h-12 rounded-2xl shadow-lg shadow-violet-600/30 border border-violet-400/30 transition-all hover:scale-105 flex items-center gap-2 text-sm"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      Read Chapter 1 Free
                    </Button>
                  </Link>

                  <Link href={`/novels/${activeNovel.slug}`}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white/15 bg-zinc-950/70 hover:bg-zinc-900 text-zinc-200 hover:text-white font-medium px-6 h-12 rounded-2xl backdrop-blur-md transition-all hover:border-white/30 flex items-center gap-2 text-sm"
                    >
                      <Info className="w-4 h-4 text-violet-400" />
                      Story Overview
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
                        <span className="text-[10px] uppercase font-bold tracking-widest text-violet-300 bg-violet-950/80 px-2.5 py-0.5 rounded-full border border-violet-600/40">
                          {activeNovel.contentClass.replace("_", " ")}
                        </span>
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
            MODULE: SMART "CONTINUE YOUR STORY" RESUME BAR
            ============================================================ */}
        {continueReadingItem && (
          <section className="py-6 border-b border-white/5 bg-gradient-to-r from-violet-950/40 via-zinc-950 to-zinc-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="p-5 rounded-3xl bg-zinc-900/80 border border-violet-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-18 rounded-2xl overflow-hidden relative shrink-0 border border-white/10 bg-zinc-900">
                    <img
                      src={continueReadingItem.novelCoverUrl}
                      alt={continueReadingItem.novelTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400 bg-violet-950/80 px-2 py-0.5 rounded-full border border-violet-500/20">
                        Continue Your Story
                      </span>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        Chapter {continueReadingItem.chapterNumber} • {continueReadingItem.percentage}% complete
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white truncate">
                      {continueReadingItem.novelTitle}
                    </h3>
                    <div className="w-56 bg-zinc-800 rounded-full h-1.5 overflow-hidden mt-1">
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
            TRI-ARCH CATALOG & MULTI-DIMENSIONAL DISCOVERY
            ============================================================ */}
        <section id="explore" className="scroll-mt-16 py-16 border-b border-white/5 bg-zinc-950/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Header + Tri-Arch Content Switcher */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-800/40 text-violet-300 text-xs font-semibold mb-3">
                  <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
                  LIVING ECOSYSTEM
                </div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">
                  Discover Novels Across 3 Worlds
                </h2>
                <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                  Explore original studio productions, stories by verified community authors, and public domain classics.
                </p>
              </div>

              {/* Three-Pillar Content Filter Buttons (second-plan §1) */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-zinc-900/90 border border-white/10">
                {[
                  { id: "all", label: "All Catalog", icon: Layers },
                  { id: "COMMUNITY", label: "Community Stories", icon: Feather },
                  { id: "STUDIO_ORIGINAL", label: "Studio Originals", icon: Sparkles },
                  { id: "PUBLIC_DOMAIN", label: "Classics", icon: Landmark },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setContentFilter(item.id as typeof contentFilter)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5",
                      contentFilter === item.id
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30 font-semibold"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                    )}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trope & Story Mood Pills (second-plan §12) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs text-zinc-500 font-semibold whitespace-nowrap pl-1">
                Story Tropes:
              </span>
              {TROPES_LIST.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTrope(t.id)}
                  className={cn(
                    "px-3 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap border",
                    selectedTrope === t.id
                      ? "bg-violet-500/20 text-violet-300 border-violet-500/50"
                      : "bg-zinc-900/60 text-zinc-400 border-white/5 hover:border-white/20 hover:text-white"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Curated Grid of Novels */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredNovels.slice(0, 8).map((novel) => {
                const badge = getSourceBadge(novel.source, novel.contentClass);
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

                      {/* Content Classification Pill */}
                      <span
                        className={cn(
                          "absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[9px] font-bold border backdrop-blur-md shadow-md",
                          badge.bg
                        )}
                      >
                        {badge.label}
                      </span>

                      {novel.novelFormat === "ENHANCED" && (
                        <span className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-purple-950/80 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                          <Radio className="w-2.5 h-2.5 text-purple-400" />
                          Audio+Scene
                        </span>
                      )}

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
                        <span className="text-[11px] text-zinc-400 truncate max-w-[110px]">
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
                        ) : (
                          <Link href={`/novels/${novel.slug}`}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2.5 text-[10px] text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg gap-1 font-semibold"
                            >
                              Overview
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <Link href="/explore">
                <Button
                  size="lg"
                  className="bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-violet-500/40 text-white text-xs font-bold px-8 h-12 rounded-2xl transition-all gap-2"
                >
                  <span>Explore Full Catalog with Search & Filters</span>
                  <ChevronRight className="w-4 h-4 text-violet-400" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================
            SOCIAL ECOSYSTEM: LIVE ACTIVITY & BOOK CLUBS (second-plan §4, 5, 6)
            ============================================================ */}
        <section className="py-16 border-b border-white/5 bg-black">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Live Reading Feed */}
              <div className="lg:col-span-6">
                <FriendsActivityFeed maxItems={4} />
              </div>

              {/* Right Column: Book Clubs & Reading Together */}
              <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-violet-950/40 via-zinc-950 to-zinc-950 border border-violet-500/20 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/80 border border-violet-500/30 text-xs font-bold text-violet-300">
                    <Users className="w-3.5 h-3.5 text-violet-400" />
                    Community Reading Clubs
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Read Together in Real-Time Book Clubs
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Join live reading circles, discuss pivotal plot turns without spoilers, share paragraph reactions, and track reading milestones with fellow book lovers.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link href="/community">
                    <Button className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-xs font-bold px-6 py-5 shadow-lg shadow-violet-600/30 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Explore Book Clubs
                    </Button>
                  </Link>

                  <Link href="/schedule">
                    <Button variant="outline" className="rounded-2xl border-white/10 text-xs font-bold py-5 px-5">
                      Reading Routine
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION: 12 GENRES EXPLORATION GRID
            ============================================================ */}
        <section id="genres" className="py-16 border-b border-white/5 bg-zinc-950/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-400">
                Explore Genres
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
      </main>

      <Footer />
    </div>
  );
}

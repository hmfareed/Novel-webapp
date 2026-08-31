"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Eye,
  Users,
  BookOpen,
  Plus,
  Check,
  Share2,
  Clock,
  Globe,
  ShieldAlert,
  FileText,
  Sparkles,
  ChevronRight,
  MessageSquare,
  Radio,
  Star,
  ThumbsUp,
  Flame,
} from "lucide-react";
import { Navbar } from "@/components/novelverse/navbar";
import { Footer } from "@/components/novelverse/footer";
import { StarRating } from "@/components/novelverse/star-rating";
import { NovelCard } from "@/components/novelverse/novel-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ReadingRoomModal } from "@/components/novelverse/social/reading-room-modal";
import { QuoteCardModal } from "@/components/novelverse/reader/quote-card-modal";
import { SEED_NOVELS, type SeedNovel } from "@/lib/seed-data";
import { toggleLocalLibraryFavorite, getLocalStatsOverview } from "@/lib/client-reading-tracker";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface NovelDetailPageProps {
  params: Promise<{ slug: string }>;
}

interface UserReview {
  id: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  date: string;
  text: string;
  likes: number;
  hasLiked?: boolean;
}

export interface NovelDetailData extends SeedNovel {
  isReadable?: boolean;
  previewUrl?: string;
  sourceUrl?: string;
  isPublicDomain?: boolean;
  publishedDate?: string;
  publisher?: string;
}

export default function NovelDetailPage({ params }: NovelDetailPageProps) {
  const resolvedParams = React.use(params);
  const seedFallback = SEED_NOVELS.find((n) => n.slug === resolvedParams.slug);

  const [novel, setNovel] = React.useState<NovelDetailData | null>(seedFallback || null);
  const [isLoading, setIsLoading] = React.useState(!seedFallback);
  const [coverSrc, setCoverSrc] = React.useState(seedFallback?.coverUrl || "/assets/mood-epic-adventure.jpg");
  const [inLibrary, setInLibrary] = React.useState(false);
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = React.useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = React.useState(false);

  // Reviews state
  const [reviews, setReviews] = React.useState<UserReview[]>([
    {
      id: "rev_1",
      authorName: "Ama Mensah",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      rating: 5,
      date: "2 days ago",
      text: "The pacing and emotional weight in this novel is extraordinary. Sundiata's journey from a burdened youth to a legendary ruler is pure cinematic poetry!",
      likes: 48,
      hasLiked: false,
    },
    {
      id: "rev_2",
      authorName: "Kojo Asante",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      rating: 5,
      date: "5 days ago",
      text: "Masterful worldbuilding and rich historical grounding. Loved reading this together with my reading room guild!",
      likes: 31,
      hasLiked: true,
    },
  ]);

  const [newRating, setNewRating] = React.useState(5);
  const [newReviewText, setNewReviewText] = React.useState("");
  const [showReviewInput, setShowReviewInput] = React.useState(false);

  React.useEffect(() => {
    async function loadNovel() {
      try {
        const res = await fetch(`/api/novels/${resolvedParams.slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.novel) {
            setNovel(data.novel);
            setCoverSrc(data.novel.coverUrl || "/assets/mood-epic-adventure.jpg");
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Fallback
      }
      if (seedFallback) {
        setNovel(seedFallback);
        setCoverSrc(seedFallback.coverUrl || "/assets/mood-epic-adventure.jpg");
      }
      setIsLoading(false);
    }

    loadNovel();
  }, [resolvedParams.slug, seedFallback]);

  if (!isLoading && !novel) {
    return notFound();
  }

  if (isLoading || !novel) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-16 animate-pulse space-y-6">
          <div className="h-64 rounded-3xl bg-zinc-900/60" />
          <div className="h-8 w-64 bg-zinc-800 rounded-lg" />
          <div className="h-4 w-96 bg-zinc-800/60 rounded-lg" />
        </div>
        <Footer />
      </div>
    );
  }

  const similarNovels = SEED_NOVELS.filter((n) => n.slug !== novel.slug).slice(0, 4);

  const handleLibraryToggle = async () => {
    const nextState = !inLibrary;
    setInLibrary(nextState);
    if (nextState) {
      toast.success(`"${novel.title}" added to your Library!`);
    } else {
      toast.info(`"${novel.title}" removed from your Library.`);
    }

    await toggleLocalLibraryFavorite({
      slug: novel.slug,
      title: novel.title,
      coverUrl: novel.coverUrl,
      authorName: novel.author.name,
      rating: novel.rating,
      chapterCount: novel.chapterCount,
    });
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    if (!isFollowing) {
      toast.success(`You are now following ${novel.author.name}! (Module 38)`);
    } else {
      toast.info(`Unfollowed ${novel.author.name}.`);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Novel link copied to clipboard! (Module 25)");
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const newRev: UserReview = {
      id: `rev_${Date.now()}`,
      authorName: "You (Verified Reader)",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      rating: newRating,
      date: "Just now",
      text: newReviewText.trim(),
      likes: 0,
      hasLiked: false,
    };

    setReviews([newRev, ...reviews]);
    setNewReviewText("");
    setShowReviewInput(false);
    toast.success("Your review was posted! +30 XP gained 🎉");
  };

  const handleToggleReviewLike = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const next = !r.hasLiked;
          return {
            ...r,
            hasLiked: next,
            likes: r.likes + (next ? 1 : -1),
          };
        }
        return r;
      })
    );
  };

  const storyDnaItems = [
    { label: "Romance", value: novel.storyDna.romance, color: "from-pink-500 to-rose-400" },
    { label: "Politics", value: novel.storyDna.politics, color: "from-amber-500 to-yellow-400" },
    { label: "Action", value: novel.storyDna.action, color: "from-red-500 to-orange-400" },
    { label: "Drama", value: novel.storyDna.drama, color: "from-purple-500 to-violet-400" },
    { label: "Magic", value: novel.storyDna.magic, color: "from-violet-600 to-indigo-400" },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-violet-600/30 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-1 pb-20">
        {/* ============================================================
            HERO HEADER
            ============================================================ */}
        <section className="relative overflow-hidden pt-8 pb-12 border-b border-white/5 bg-gradient-to-b from-zinc-950 via-zinc-950/60 to-black">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3 h-3 text-zinc-600" />
              <Link href="/explore" className="hover:text-white transition-colors">
                Explore
              </Link>
              <ChevronRight className="w-3 h-3 text-zinc-600" />
              <span className="text-zinc-300 truncate max-w-xs">{novel.title}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left: Novel Cover Showcase */}
              <div className="md:col-span-4 lg:col-span-3 flex justify-center md:justify-start">
                <div className="relative w-60 md:w-full aspect-[2/3] rounded-3xl overflow-hidden bg-zinc-900 border border-white/15 shadow-2xl shadow-violet-950/40 group">
                  <Image
                    src={coverSrc}
                    alt={novel.title}
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={() => setCoverSrc("/assets/mood-epic-adventure.jpg")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Status Overlay Badge */}
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-950/80 border border-white/10 text-white backdrop-blur-md">
                    {novel.source === "gutenberg"
                      ? "Gutenberg Classic"
                      : novel.source === "openlibrary"
                      ? "Open Library"
                      : novel.source === "googlebooks"
                      ? "Google Books"
                      : novel.status}
                  </span>

                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600/90 text-white backdrop-blur-md flex items-center gap-1 shadow-lg">
                    {novel.isPublicDomain ? "Public Domain" : "100% Free"}
                  </span>
                </div>
              </div>

              {/* Right: Novel Title, Metadata, CTAs */}
              <div className="md:col-span-8 lg:col-span-9 space-y-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {novel.source && (
                      <span className="text-xs font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-700/50 px-3 py-0.5 rounded-full uppercase tracking-wider">
                        Source: {novel.source}
                      </span>
                    )}
                    {novel.genres.map((g) => (
                      <span
                        key={g.id}
                        className="text-xs font-medium text-violet-300 bg-violet-950/60 border border-violet-800/40 px-3 py-0.5 rounded-full"
                      >
                        {g.name}
                      </span>
                    ))}
                    {novel.tags.slice(0, 2).map((t, idx) => (
                      <span
                        key={idx}
                        className="text-xs text-zinc-400 bg-zinc-900 border border-white/10 px-3 py-0.5 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    {novel.title}
                  </h1>

                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800 relative border border-white/10">
                      <Image
                        src={novel.author.avatar}
                        alt={novel.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-sm text-zinc-300">
                      Written by{" "}
                      <span className="font-semibold text-white">
                        {novel.author.name}
                      </span>
                    </p>
                    {novel.author.verified && (
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-violet-600 text-white shadow-sm">
                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      </span>
                    )}
                  </div>
                </div>

                {/* Key Metrics Bar */}
                <div className="flex flex-wrap items-center gap-6 py-3.5 border-y border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <StarRating rating={novel.rating} size="sm" showValue />
                    <span className="text-zinc-400 font-mono">
                      ({reviews.length + novel.reviewCount} reviews)
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Eye className="w-4 h-4 text-violet-400" />
                    <span className="font-semibold text-white">
                      {(novel.readCount / 1000).toFixed(1)}K
                    </span>
                    <span className="text-zinc-400">Reads</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Users className="w-4 h-4 text-violet-400" />
                    <span className="font-semibold text-white">24.3K</span>
                    <span className="text-zinc-400">Followers</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {novel.status}
                  </div>
                </div>

                {/* Action Buttons (Module 2) */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {novel.isReadable !== false && (novel.chapterCount || 0) > 0 ? (
                    <Link href={`/read/${novel.slug}/1`}>
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-8 rounded-2xl shadow-xl shadow-violet-600/30 border border-violet-400/30 transition-all hover:scale-105"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Read Now
                      </Button>
                    </Link>
                  ) : novel.previewUrl ? (
                    <a
                      href={novel.previewUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-8 rounded-2xl shadow-xl shadow-blue-600/30 border border-blue-400/30 transition-all hover:scale-105"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Read Official Preview
                      </Button>
                    </a>
                  ) : (
                    <Link href={`/read/${novel.slug}/1`}>
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-8 rounded-2xl shadow-xl shadow-violet-600/30 border border-violet-400/30 transition-all hover:scale-105"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Read First Chapter
                      </Button>
                    </Link>
                  )}

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleLibraryToggle}
                    className={cn(
                      "rounded-2xl px-6 text-xs font-bold transition-all",
                      inLibrary
                        ? "bg-violet-950 border-violet-500 text-violet-300"
                        : "border-white/15 bg-zinc-900/80 hover:bg-zinc-800 text-white"
                    )}
                  >
                    {inLibrary ? (
                      <>
                        <Check className="w-4 h-4 mr-2 text-violet-400" />
                        In Library
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2 text-violet-400" />
                        Add to Library
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsRoomModalOpen(true)}
                    className="rounded-2xl border-white/15 bg-zinc-900/80 hover:bg-zinc-800 text-white text-xs font-bold"
                  >
                    <Radio className="w-4 h-4 mr-2 text-rose-400 animate-pulse" />
                    Reading Room
                  </Button>

                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={handleFollowToggle}
                    className={cn(
                      "rounded-2xl px-5 text-xs font-semibold transition-all",
                      isFollowing
                        ? "bg-zinc-800 text-zinc-300"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {isFollowing ? "Following" : "+ Follow Author"}
                  </Button>

                  <button
                    onClick={() => setIsQuoteModalOpen(true)}
                    className="p-3 rounded-2xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:border-violet-500/50 transition-colors"
                    title="Generate Quote Card"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </button>

                  <button
                    onClick={handleShare}
                    className="p-3 rounded-2xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:border-violet-500/50 transition-colors"
                    title="Share Novel Link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            TABS SECTION (About, Chapters, Reviews, Similar)
            ============================================================ */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
          <Tabs defaultValue="about">
            <TabsList className="bg-zinc-950 border border-white/10 p-1 rounded-2xl mb-8">
              <TabsTrigger value="about" className="rounded-xl px-5 text-xs font-semibold">
                About & Story DNA
              </TabsTrigger>
              <TabsTrigger value="chapters" className="rounded-xl px-5 text-xs font-semibold">
                Chapters ({novel.chapters.length})
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-xl px-5 text-xs font-semibold">
                Reviews ({reviews.length})
              </TabsTrigger>
              <TabsTrigger value="similar" className="rounded-xl px-5 text-xs font-semibold">
                Similar Novels
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: ABOUT */}
            <TabsContent value="about" className="space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-white mb-3">Synopsis</h3>
                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line font-normal">
                      {novel.synopsis}
                    </p>
                  </div>

                  {/* Publishing & Source Metadata */}
                  {(novel.publisher || novel.publishedDate || novel.sourceUrl) && (
                    <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-2 text-xs">
                      <h4 className="font-bold text-white flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-violet-400" />
                        Publication & Source Record
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-400">
                        {novel.publisher && (
                          <p>
                            <span className="text-zinc-500 font-semibold">Publisher:</span> {novel.publisher}
                          </p>
                        )}
                        {novel.publishedDate && (
                          <p>
                            <span className="text-zinc-500 font-semibold">Published Date:</span> {novel.publishedDate}
                          </p>
                        )}
                        {novel.sourceUrl && (
                          <p className="sm:col-span-2">
                            <span className="text-zinc-500 font-semibold">Original Catalog:</span>{" "}
                            <a
                              href={novel.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-violet-400 hover:underline inline-flex items-center gap-1"
                            >
                              <span>View Original Record</span>
                              <ChevronRight className="w-3 h-3" />
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
                    <div className="p-3 rounded-2xl bg-zinc-950 border border-white/5 space-y-1">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                        <Globe className="w-3 h-3 text-violet-400" /> Language
                      </span>
                      <p className="text-xs font-bold text-white">{novel.language}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-zinc-950 border border-white/5 space-y-1">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                        <FileText className="w-3 h-3 text-violet-400" /> Total Words
                      </span>
                      <p className="text-xs font-bold text-white">
                        {(novel.wordCount / 1000).toFixed(0)}K
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-zinc-950 border border-white/5 space-y-1">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3 h-3 text-violet-400" /> Updated
                      </span>
                      <p className="text-xs font-bold text-white">Today</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-zinc-950 border border-white/5 space-y-1">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-violet-400" /> Age Rating
                      </span>
                      <p className="text-xs font-bold text-white">{novel.ageRating}</p>
                    </div>
                  </div>
                </div>

                {/* Right: Story DNA */}
                <div className="lg:col-span-5">
                  <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 space-y-5 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-violet-400" />
                        Story DNA Archetypes
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {storyDnaItems.map((dna) => (
                        <div key={dna.label} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-zinc-300">{dna.label}</span>
                            <span className="text-zinc-400 tabular-nums">{dna.value}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-zinc-900 overflow-hidden border border-white/5">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${dna.color} transition-all duration-1000`}
                              style={{ width: `${dna.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: CHAPTERS LIST */}
            <TabsContent value="chapters" className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/5 text-xs text-zinc-400">
                <span>{novel.chapters.length} available chapters • 100% Free</span>
                <span className="text-violet-400 font-semibold">Sequential Order (1-{novel.chapters.length})</span>
              </div>

              <div className="space-y-2">
                {novel.chapters.map((chapter) => (
                  <Link
                    key={chapter.chapterNumber}
                    href={`/read/${novel.slug}/${chapter.chapterNumber}`}
                    className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950 border border-white/5 hover:border-violet-500/40 hover:bg-zinc-900 transition-all group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-zinc-900 border border-white/10 text-xs font-bold text-zinc-400 group-hover:text-violet-300 group-hover:border-violet-500/30">
                        {chapter.chapterNumber}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors truncate">
                          {chapter.title}
                        </h4>
                        <p className="text-[11px] text-zinc-400">
                          {chapter.wordCount.toLocaleString()} words • Complete
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-0.5 rounded-full">
                        Free
                      </span>
                      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </TabsContent>

            {/* TAB 3: REVIEWS (Module 43) */}
            <TabsContent value="reviews" className="space-y-6">
              <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="text-center space-y-1">
                    <p className="text-4xl font-black text-white tabular-nums">
                      {novel.rating.toFixed(1)}
                    </p>
                    <StarRating rating={novel.rating} size="sm" />
                    <p className="text-[11px] text-zinc-400 font-mono">
                      {reviews.length} community reviews
                    </p>
                  </div>

                  <div className="hidden sm:block h-16 w-px bg-white/10" />

                  <div className="space-y-1 text-xs text-zinc-300">
                    <p className="font-semibold text-white">Reader Consensus</p>
                    <p className="text-zinc-400 max-w-sm">
                      Praised for intense worldbuilding, magnetic tension, and high replay value.
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => setShowReviewInput(!showReviewInput)}
                  className="bg-violet-600 hover:bg-violet-500 text-white rounded-2xl text-xs font-bold px-6 py-5 shrink-0 shadow-lg shadow-violet-600/30"
                >
                  <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                  {showReviewInput ? "Close Form" : "Write a Review"}
                </Button>
              </div>

              {/* Review Submission Form */}
              {showReviewInput && (
                <form
                  onSubmit={handleAddReview}
                  className="p-5 rounded-3xl bg-zinc-900/80 border border-violet-500/30 space-y-4 animate-in fade-in duration-150"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Your Rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 text-amber-400 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={cn(
                              "w-5 h-5",
                              star <= newRating ? "fill-amber-400" : "text-zinc-600"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    placeholder="Share your thoughts on the novel, character arcs, and themes..."
                    rows={3}
                    className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 resize-none"
                  />

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowReviewInput(false)}
                      className="rounded-xl text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!newReviewText.trim()}
                      className="rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold"
                    >
                      Publish Review (+30 XP)
                    </Button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-2xl bg-zinc-950 border border-white/5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={r.authorAvatar}
                          alt={r.authorName}
                          className="w-8 h-8 rounded-full object-cover border border-white/10"
                        />
                        <div>
                          <span className="text-xs font-bold text-white block">
                            {r.authorName}
                          </span>
                          <span className="text-[10px] text-zinc-500">{r.date}</span>
                        </div>
                      </div>
                      <StarRating rating={r.rating} size="xs" />
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                      &ldquo;{r.text}&rdquo;
                    </p>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                      <button
                        onClick={() => handleToggleReviewLike(r.id)}
                        className={cn(
                          "flex items-center gap-1.5 transition-colors",
                          r.hasLiked ? "text-violet-400 font-bold" : "hover:text-white"
                        )}
                      >
                        <ThumbsUp className={cn("w-3.5 h-3.5", r.hasLiked && "fill-current")} />
                        <span>Helpful ({r.likes})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* TAB 4: SIMILAR NOVELS */}
            <TabsContent value="similar">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {similarNovels.map((n) => (
                  <NovelCard
                    key={n.slug}
                    novel={{
                      id: n.slug,
                      slug: n.slug,
                      title: n.title,
                      coverUrl: n.coverUrl,
                      author: {
                        id: n.author.username,
                        name: n.author.name,
                        username: n.author.username,
                        avatar: n.author.avatar,
                        verified: n.author.verified,
                      },
                      genres: n.genres,
                      status: n.status,
                      rating: n.rating,
                      reviewCount: n.reviewCount,
                      readCount: n.readCount,
                      chapterCount: n.chapterCount,
                      wordCount: n.wordCount,
                      isPremium: false,
                      isCompleted: n.isCompleted,
                      updatedAt: new Date().toISOString(),
                    }}
                    variant="vertical"
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <Footer />

      {/* Reading Room Modal */}
      <ReadingRoomModal
        open={isRoomModalOpen}
        onOpenChange={setIsRoomModalOpen}
        defaultNovelSlug={novel.slug}
        defaultNovelTitle={novel.title}
      />

      {/* Quote Card Modal */}
      <QuoteCardModal
        open={isQuoteModalOpen}
        onOpenChange={setIsQuoteModalOpen}
        quoteText="Armed with silver thread and unmatched cunning, wisdom wins the stories of the world."
        novelTitle={novel.title}
        authorName={novel.author.name}
      />
    </div>
  );
}

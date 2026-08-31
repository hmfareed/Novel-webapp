"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bookmark,
  BookOpen,
  Sparkles,
  Play,
  Trash2,
  Calendar,
  Star,
  CheckCircle,
  FileText,
  Clock,
  RotateCcw,
  Plus,
} from "lucide-react";
import { Navbar } from "@/components/novelverse/navbar";
import { Footer } from "@/components/novelverse/footer";
import { Button } from "@/components/ui/button";
import { SEED_NOVELS } from "@/lib/seed-data";
import {
  getLocalStatsOverview,
  type LocalReadingProgressItem,
  type LocalLibraryItem,
  toggleLocalLibraryFavorite,
} from "@/lib/client-reading-tracker";
import {
  getHighlights,
  getNotes,
  deleteHighlight,
  type ReaderHighlight,
  type ReaderNote,
} from "@/lib/reader-storage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DisplayCardItem {
  slug: string;
  title: string;
  coverUrl: string;
  authorName: string;
  chapterCount?: number;
  rating?: number;
  progressPercent?: number;
  currentChapter?: number;
}

export default function BookmarksPage() {
  const [activeTab, setActiveTab] = React.useState<
    "saved" | "in_progress" | "highlights" | "completed"
  >("saved");

  const [readingList, setReadingList] = React.useState<LocalReadingProgressItem[]>([]);
  const [libraryList, setLibraryList] = React.useState<LocalLibraryItem[]>([]);
  const [highlights, setHighlights] = React.useState<ReaderHighlight[]>([]);
  const [notes, setNotes] = React.useState<ReaderNote[]>([]);

  const loadData = React.useCallback(() => {
    const local = getLocalStatsOverview();
    setReadingList(local.currentlyReading);
    setLibraryList(local.libraryItems);
    setHighlights(getHighlights());
    setNotes(getNotes());
  }, []);

  React.useEffect(() => {
    loadData();
    const handleHighlight = () => loadData();
    window.addEventListener("novelverse:highlight-added", handleHighlight);
    return () => window.removeEventListener("novelverse:highlight-added", handleHighlight);
  }, [loadData]);

  // Saved / Want to Read items
  const savedNovels: DisplayCardItem[] =
    libraryList.length > 0
      ? libraryList.map((item) => ({
          slug: item.novelSlug,
          title: item.novelTitle,
          coverUrl: item.novelCoverUrl,
          authorName: item.authorName,
          chapterCount: item.chapterCount || 5,
          rating: item.rating || 4.9,
        }))
      : SEED_NOVELS.slice(0, 4).map((n) => ({
          slug: n.slug,
          title: n.title,
          coverUrl: n.coverUrl,
          authorName: n.author.name,
          chapterCount: n.chapterCount,
          rating: n.rating,
        }));

  // In Progress items
  const inProgressNovels: DisplayCardItem[] =
    readingList.length > 0
      ? readingList.map((r) => ({
          slug: r.novelSlug,
          title: r.novelTitle,
          coverUrl: r.novelCoverUrl,
          authorName: r.authorName,
          progressPercent: r.percentage,
          currentChapter: r.chapterNumber,
          chapterCount: r.totalChapters,
        }))
      : SEED_NOVELS.slice(0, 2).map((n, idx) => ({
          slug: n.slug,
          title: n.title,
          coverUrl: n.coverUrl,
          authorName: n.author.name,
          progressPercent: idx === 0 ? 68 : 45,
          currentChapter: idx === 0 ? 2 : 1,
          chapterCount: n.chapterCount,
        }));

  // Completed items
  const completedNovels: DisplayCardItem[] = [SEED_NOVELS[1]].map((n) => ({
    slug: n.slug,
    title: n.title,
    coverUrl: n.coverUrl,
    authorName: n.author.name,
    chapterCount: n.chapterCount,
    rating: n.rating,
  }));

  const handleRemoveSaved = async (slug: string, title: string) => {
    await toggleLocalLibraryFavorite({
      slug,
      title,
      coverUrl: "",
      authorName: "",
    });
    loadData();
    toast.info(`"${title}" removed from bookmarks.`);
  };

  const handleDeleteHighlight = (id: string) => {
    deleteHighlight(id);
    setHighlights(getHighlights());
    toast.info("Highlight removed.");
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
                  <Bookmark className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
                    My Bookmarks
                  </h1>
                  <p className="text-xs text-zinc-400 font-medium">
                    Your saved stories, in-progress reading sessions, and personal chapter highlights.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/schedule">
                <Button
                  variant="outline"
                  className="rounded-2xl border-white/10 bg-zinc-900/60 hover:bg-zinc-800 text-xs font-bold py-5 flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-violet-400" />
                  Reading Schedule
                </Button>
              </Link>

              <Link href="/explore">
                <Button className="rounded-2xl bg-violet-600 hover:bg-violet-500 text-xs font-bold py-5 px-5 shadow-lg shadow-violet-600/30 flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Explore More
                </Button>
              </Link>
            </div>
          </div>

          {/* Navigation Filter Tabs */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
            {[
              { id: "saved", label: "Saved Novels", icon: Bookmark, count: savedNovels.length },
              { id: "in_progress", label: "In Progress", icon: Play, count: inProgressNovels.length },
              { id: "highlights", label: "Highlights & Quotes", icon: Sparkles, count: highlights.length + notes.length },
              { id: "completed", label: "Completed", icon: CheckCircle, count: completedNovels.length },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={cn(
                    "px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap",
                    isSelected
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                      : "bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  <span className="text-[10px] bg-black/40 px-2 py-0.2 rounded-full font-mono">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: SAVED NOVELS */}
          {activeTab === "saved" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {savedNovels.map((novel) => (
                <div
                  key={novel.slug}
                  className="group rounded-3xl bg-zinc-950/80 border border-white/10 hover:border-violet-500/50 p-3 space-y-3 flex flex-col justify-between transition-all shadow-xl"
                >
                  <Link
                    href={`/novels/${novel.slug}`}
                    className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-900 block"
                  >
                    <Image
                      src={novel.coverUrl}
                      alt={novel.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-black/80 border border-white/10 backdrop-blur-md text-[10px] font-bold text-amber-400 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{novel.rating?.toFixed(1) || "4.9"}</span>
                    </div>
                  </Link>

                  <div className="space-y-1">
                    <Link href={`/novels/${novel.slug}`}>
                      <h3 className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-1">
                        {novel.title}
                      </h3>
                    </Link>
                    <p className="text-[10px] text-zinc-400 truncate">by {novel.authorName}</p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-1">
                    <Link href={`/read/${novel.slug}/1`} className="flex-1">
                      <Button
                        size="sm"
                        className="w-full h-8 rounded-xl bg-violet-600 hover:bg-violet-500 text-[11px] font-bold gap-1"
                      >
                        <Play className="w-3 h-3 fill-current" /> Read
                      </Button>
                    </Link>

                    <button
                      onClick={() => handleRemoveSaved(novel.slug, novel.title)}
                      className="p-2 text-zinc-500 hover:text-rose-400 rounded-xl hover:bg-white/5"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: IN PROGRESS NOVELS */}
          {activeTab === "in_progress" && (
            <div className="space-y-4">
              {inProgressNovels.map((novel) => (
                <div
                  key={novel.slug}
                  className="p-4 sm:p-5 rounded-3xl bg-zinc-950/80 border border-white/10 hover:border-violet-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-xl"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={novel.coverUrl}
                      alt={novel.title}
                      className="w-14 h-20 rounded-2xl object-cover border border-white/10 shrink-0"
                    />

                    <div className="min-w-0 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-violet-400 bg-violet-950/80 px-2 py-0.5 rounded-full border border-violet-500/30">
                        Chapter {novel.currentChapter || 1} of {novel.chapterCount || 5}
                      </span>
                      <h3 className="text-base font-bold text-white truncate">
                        {novel.title}
                      </h3>
                      <p className="text-xs text-zinc-400 truncate">by {novel.authorName}</p>

                      <div className="w-48 bg-zinc-900 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-violet-500 to-indigo-400 h-full rounded-full"
                          style={{ width: `${novel.progressPercent || 50}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Link href={`/read/${novel.slug}/${novel.currentChapter || 1}`}>
                      <Button className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-xs font-bold px-6 py-5 shadow-lg shadow-violet-600/30 flex items-center gap-2">
                        <RotateCcw className="w-4 h-4" /> Resume ({novel.progressPercent}%)
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: HIGHLIGHTS & QUOTES */}
          {activeTab === "highlights" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Highlights Column */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Saved Paragraph Highlights ({highlights.length})
                </h3>

                {highlights.length === 0 ? (
                  <div className="p-8 rounded-3xl bg-zinc-950/60 border border-white/5 text-center space-y-2">
                    <Sparkles className="w-6 h-6 mx-auto text-zinc-600" />
                    <p className="text-xs text-zinc-400">
                      No highlights yet. Select text while reading to bookmark favorite quotes!
                    </p>
                  </div>
                ) : (
                  highlights.map((hl) => (
                    <div
                      key={hl.id}
                      className="p-4 rounded-3xl bg-zinc-950/80 border border-white/10 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-violet-400">
                          Chapter {hl.chapterNumber} Snippet
                        </span>
                        <button
                          onClick={() => handleDeleteHighlight(hl.id)}
                          className="text-zinc-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="italic text-zinc-200 border-l-2 border-amber-400 pl-3 leading-relaxed">
                        &ldquo;{hl.selectedText}&rdquo;
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Notes Column */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-violet-400" />
                  Personal Margin Notes ({notes.length})
                </h3>

                {notes.length === 0 ? (
                  <div className="p-8 rounded-3xl bg-zinc-950/60 border border-white/5 text-center space-y-2">
                    <FileText className="w-6 h-6 mx-auto text-zinc-600" />
                    <p className="text-xs text-zinc-400">
                      No margin notes yet. Tap &quot;Add Note&quot; on highlighted text to log chapter theories!
                    </p>
                  </div>
                ) : (
                  notes.map((nt) => (
                    <div
                      key={nt.id}
                      className="p-4 rounded-3xl bg-zinc-950/80 border border-white/10 space-y-2 text-xs"
                    >
                      <span className="text-[10px] font-bold uppercase text-violet-400">
                        Chapter {nt.chapterNumber} Theory Note
                      </span>
                      <p className="text-white bg-white/5 p-3 rounded-2xl">
                        {nt.noteText}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: COMPLETED NOVELS */}
          {activeTab === "completed" && (
            <div className="space-y-4">
              {completedNovels.map((novel) => (
                <div
                  key={novel.slug}
                  className="p-4 sm:p-5 rounded-3xl bg-zinc-950/80 border border-white/10 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={novel.coverUrl}
                      alt={novel.title}
                      className="w-14 h-20 rounded-2xl object-cover border border-white/10"
                    />
                    <div className="min-w-0 space-y-1">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> 100% Completed
                      </span>
                      <h3 className="text-sm font-bold text-white truncate">{novel.title}</h3>
                      <p className="text-xs text-zinc-400">by {novel.authorName}</p>
                    </div>
                  </div>

                  <Link href={`/novels/${novel.slug}`}>
                    <Button variant="outline" size="sm" className="rounded-xl text-xs">
                      Review & Rate
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  Bookmark,
  CheckCircle,
  Download,
  History,
  Users,
  Play,
  HardDrive,
  Trash2,
} from "lucide-react";
import { Navbar } from "@/components/novelverse/navbar";
import { Footer } from "@/components/novelverse/footer";
import { Button } from "@/components/ui/button";
import { SEED_NOVELS } from "@/lib/seed-data";
import {
  getLocalStatsOverview,
  type LocalReadingProgressItem,
  type LocalLibraryItem,
} from "@/lib/client-reading-tracker";
import {
  getOfflineNovels,
  removeOfflineNovel,
  type OfflineNovel,
} from "@/lib/reader-storage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DisplayNovelItem {
  slug: string;
  title: string;
  coverUrl: string;
  authorName: string;
  rating?: number;
}

export default function LibraryPage() {
  const [activeTab, setActiveTab] = React.useState<
    "continue" | "want_to_read" | "completed" | "downloaded" | "following" | "history"
  >("continue");

  const [readingList, setReadingList] = React.useState<LocalReadingProgressItem[]>([]);
  const [libraryList, setLibraryList] = React.useState<LocalLibraryItem[]>([]);
  const [offlineNovels, setOfflineNovels] = React.useState<OfflineNovel[]>([]);

  React.useEffect(() => {
    const local = getLocalStatsOverview();
    setReadingList(local.currentlyReading);
    setLibraryList(local.libraryItems);
    setOfflineNovels(getOfflineNovels());
  }, []);

  const libraryTabs = [
    { id: "continue", label: "Continue Reading", icon: Play },
    { id: "want_to_read", label: "Want to Read / Saved", icon: Bookmark },
    { id: "downloaded", label: "Downloaded (Offline)", icon: Download },
    { id: "completed", label: "Completed Novels", icon: CheckCircle },
    { id: "following", label: "Following Authors", icon: Users },
    { id: "history", label: "Reading History", icon: History },
  ] as const;

  const displayContinueList =
    readingList.length > 0
      ? readingList
      : SEED_NOVELS.slice(0, 3).map((n, idx) => ({
          novelSlug: n.slug,
          novelTitle: n.title,
          novelCoverUrl: n.coverUrl,
          authorName: n.author.name,
          totalChapters: n.chapterCount,
          chapterNumber: idx === 0 ? 3 : idx === 1 ? 2 : 1,
          position: idx === 0 ? 72 : idx === 1 ? 45 : 25,
          percentage: idx === 0 ? 72 : idx === 1 ? 45 : 25,
          completed: false,
          timeSpentSeconds: 900,
          lastReadAt: new Date().toISOString(),
        }));

  const wantToReadList: DisplayNovelItem[] = libraryList
    .filter((item) => item.status === "WANT_TO_READ" || item.isFavorite)
    .map((item) => ({
      slug: item.novelSlug,
      title: item.novelTitle,
      coverUrl: item.novelCoverUrl,
      authorName: item.authorName,
      rating: 4.9,
    }));

  const fallbackWantToReadList: DisplayNovelItem[] = SEED_NOVELS.slice(1, 4).map((n) => ({
    slug: n.slug,
    title: n.title,
    coverUrl: n.coverUrl,
    authorName: n.author.name,
    rating: n.rating,
  }));

  const completedList: DisplayNovelItem[] = libraryList
    .filter((item) => item.status === "COMPLETED" || readingList.find((r) => r.novelSlug === item.novelSlug)?.completed)
    .map((item) => ({
      slug: item.novelSlug,
      title: item.novelTitle,
      coverUrl: item.novelCoverUrl,
      authorName: item.authorName,
      rating: 5.0,
    }));

  const fallbackCompletedList: DisplayNovelItem[] = [SEED_NOVELS[1]].map((n) => ({
    slug: n.slug,
    title: n.title,
    coverUrl: n.coverUrl,
    authorName: n.author.name,
    rating: n.rating,
  }));

  const handleDeleteOffline = (slug: string, title: string) => {
    removeOfflineNovel(slug);
    setOfflineNovels(getOfflineNovels());
    toast.info(`"${title}" removed from offline storage`);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-violet-600/30 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-1 pb-20">
        {/* Header */}
        <section className="pt-8 pb-6 border-b border-white/5 bg-zinc-950/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-violet-400" />
              My Library (Module 41 & 42)
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              All your progress, saved stories, offline downloads, and author followings—synchronized across devices.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Nav Menu */}
            <aside className="md:col-span-4 lg:col-span-3 space-y-1.5 bg-zinc-950 border border-white/10 p-3 rounded-2xl">
              {libraryTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all text-left",
                      isActive
                        ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-zinc-400")} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </aside>

            {/* Right Content Area */}
            <div className="md:col-span-8 lg:col-span-9 space-y-8">
              {/* TAB 1: Continue Reading */}
              {activeTab === "continue" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <h2 className="text-base font-bold text-white">
                      Currently Reading ({displayContinueList.length})
                    </h2>
                    <span className="text-xs text-zinc-400">Live progress tracking</span>
                  </div>

                  <div className="space-y-3">
                    {displayContinueList.map((item) => (
                      <div
                        key={item.novelSlug}
                        className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 hover:border-violet-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <img
                            src={item.novelCoverUrl}
                            alt={item.novelTitle}
                            className="w-14 h-20 object-cover rounded-xl border border-white/10 shrink-0"
                          />
                          <div className="min-w-0 space-y-1">
                            <span className="text-[10px] font-bold uppercase text-violet-400">
                              Chapter {item.chapterNumber} of {item.totalChapters}
                            </span>
                            <h3 className="text-sm font-bold text-white truncate">
                              {item.novelTitle}
                            </h3>
                            <p className="text-xs text-zinc-400 truncate">
                              by {item.authorName}
                            </p>
                            <div className="w-40 bg-zinc-800 rounded-full h-1.5 overflow-hidden mt-1">
                              <div
                                className="bg-gradient-to-r from-violet-500 to-indigo-400 h-full rounded-full"
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <Link href={`/read/${item.novelSlug}/${item.chapterNumber}`}>
                          <Button className="rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold px-5 shadow-md shadow-violet-600/30 w-full sm:w-auto">
                            <Play className="w-3.5 h-3.5 mr-1 fill-current" /> Continue ({item.percentage}%)
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: Want to Read / Saved */}
              {activeTab === "want_to_read" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <h2 className="text-base font-bold text-white">
                      Saved Novels ({wantToReadList.length > 0 ? wantToReadList.length : fallbackWantToReadList.length})
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(wantToReadList.length > 0 ? wantToReadList : fallbackWantToReadList).map((item) => (
                      <Link
                        key={item.slug}
                        href={`/novels/${item.slug}`}
                        className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 hover:border-violet-500/30 transition-all flex items-center gap-3 group"
                      >
                        <img
                          src={item.coverUrl}
                          alt={item.title}
                          className="w-12 h-16 object-cover rounded-lg border border-white/10"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                            {item.title}
                          </h4>
                          <p className="text-[10px] text-zinc-400 truncate">
                            by {item.authorName}
                          </p>
                          <span className="text-[10px] text-amber-400 font-mono">
                            ★ {item.rating || 4.9}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: Downloaded (Offline Reading - Module 40) */}
              {activeTab === "downloaded" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <div>
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-emerald-400" />
                        Offline Storage ({offlineNovels.length})
                      </h2>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        These chapters are stored locally on your device for zero-data reading.
                      </p>
                    </div>
                  </div>

                  {offlineNovels.length === 0 ? (
                    <div className="text-center py-12 bg-zinc-950 border border-white/5 rounded-3xl space-y-3">
                      <Download className="w-8 h-8 mx-auto text-zinc-600" />
                      <p className="text-xs text-zinc-400">
                        No novels downloaded for offline reading yet. Open any chapter and tap &quot;Save Offline&quot;!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {offlineNovels.map((novel) => (
                        <div
                          key={novel.slug}
                          className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 flex items-center justify-between gap-4 text-xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={novel.coverUrl}
                              alt={novel.title}
                              className="w-10 h-14 object-cover rounded-lg border border-white/10"
                            />
                            <div className="min-w-0">
                              <h4 className="font-bold text-white truncate">{novel.title}</h4>
                              <p className="text-[11px] text-zinc-400">by {novel.authorName}</p>
                              <span className="text-[10px] text-emerald-400 font-bold">
                                {novel.downloadedChapters.length} chapters downloaded
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link href={`/read/${novel.slug}/${novel.downloadedChapters[0] || 1}`}>
                              <Button size="sm" className="rounded-xl bg-violet-600 text-xs font-bold">
                                Read Offline
                              </Button>
                            </Link>

                            <button
                              onClick={() => handleDeleteOffline(novel.slug, novel.title)}
                              className="p-2 text-zinc-500 hover:text-rose-400 rounded-xl hover:bg-white/5"
                              title="Delete Offline Cache"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: Completed Novels */}
              {activeTab === "completed" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <h2 className="text-base font-bold text-white">
                      Completed Novels ({completedList.length > 0 ? completedList.length : fallbackCompletedList.length})
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {(completedList.length > 0 ? completedList : fallbackCompletedList).map((item) => (
                      <div
                        key={item.slug}
                        className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.coverUrl}
                            alt={item.title}
                            className="w-12 h-16 object-cover rounded-lg border border-white/10"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> 100% Completed
                            </span>
                            <h4 className="font-bold text-white text-sm truncate">{item.title}</h4>
                            <p className="text-[11px] text-zinc-400">by {item.authorName}</p>
                          </div>
                        </div>

                        <Link href={`/novels/${item.slug}`}>
                          <Button variant="outline" size="sm" className="rounded-xl text-xs">
                            Review & Rate
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: Following Authors (Module 38) */}
              {activeTab === "following" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <h2 className="text-base font-bold text-white">
                      Followed Authors & Creators
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        name: "Djeli Mamadou Kouyaté",
                        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                        bio: "Epic African oral chronicler & folklorist",
                        works: 4,
                      },
                      {
                        name: "Sarah Mensah",
                        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
                        bio: "Historical sagas & dark atmospheric fantasy",
                        works: 6,
                      },
                    ].map((author) => (
                      <div
                        key={author.name}
                        className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={author.avatar}
                            alt={author.name}
                            className="w-10 h-10 rounded-full object-cover border border-white/10"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-white truncate">{author.name}</h4>
                            <p className="text-[10px] text-zinc-400 truncate">{author.bio}</p>
                            <span className="text-[10px] text-violet-400 font-semibold">{author.works} published novels</span>
                          </div>
                        </div>

                        <Button size="sm" variant="outline" className="rounded-xl text-[11px]">
                          Following
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: Reading History (Module 42) */}
              {activeTab === "history" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <h2 className="text-base font-bold text-white">
                      Reading History Log
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">
                        Today
                      </span>
                      <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-white">Sundiata: Lion of Mali — Chapter 3</p>
                          <p className="text-[10px] text-zinc-400">Read for 14 minutes • 68% position</p>
                        </div>
                        <Link href="/read/sundiata-lion-of-mali/3" className="text-violet-400 font-bold hover:underline">
                          Resume
                        </Link>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                        Yesterday
                      </span>
                      <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-white">The Time Machine — Chapter 2</p>
                          <p className="text-[10px] text-zinc-400">Read for 9 minutes • 40% position</p>
                        </div>
                        <Link href="/read/the-time-machine/2" className="text-violet-400 font-bold hover:underline">
                          Resume
                        </Link>
                      </div>
                    </div>
                  </div>
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

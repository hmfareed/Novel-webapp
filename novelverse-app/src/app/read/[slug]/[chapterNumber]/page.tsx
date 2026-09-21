"use client";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Type,
  Bookmark,
  Check,
  Headphones,
  Sliders,
  MoreVertical,
  MessageSquare,
  Share2,
  Sparkles,
  Search,
  BookOpen,
  Bot,
  Radio,
  Volume2,
} from "lucide-react";
import { ChapterReaderProgress } from "@/components/novelverse/reading-progress-bar";
import { Button } from "@/components/ui/button";
import { SEED_NOVELS } from "@/lib/seed-data";
import { trackReadingProgress, toggleLocalLibraryFavorite } from "@/lib/client-reading-tracker";
import {
  type ReaderSettings,
  getReaderSettings,
  saveReaderSettings,
  DEFAULT_READER_SETTINGS,
  isChapterBookmarked,
  toggleBookmark,
} from "@/lib/reader-storage";
import { getChapterOfflineIDB } from "@/lib/offline-sync-engine";
import { ReaderSettingsModal } from "@/components/novelverse/reader/reader-settings-modal";
import { ReaderTextToolbar } from "@/components/novelverse/reader/reader-text-toolbar";
import { ReaderAudioPlayer } from "@/components/novelverse/reader/reader-audio-player";
import { ReaderDrawerMenu } from "@/components/novelverse/reader/reader-drawer-menu";
import { ChapterReactions } from "@/components/novelverse/reader/chapter-reactions";
import { ChapterDiscussionDrawer } from "@/components/novelverse/reader/chapter-discussion-drawer";
import { ChapterCompletionModal } from "@/components/novelverse/reader/chapter-completion-modal";
import { QuoteCardModal } from "@/components/novelverse/reader/quote-card-modal";
import { OfflineDownloadButton } from "@/components/novelverse/reader/offline-download-manager";
import { ParagraphCommentsDrawer } from "@/components/novelverse/reader/paragraph-comments-drawer";
import { ReaderAICompanion } from "@/components/novelverse/reader/reader-ai-companion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ChapterReaderPageProps {
  params: Promise<{ slug: string; chapterNumber: string }>;
}

interface ReaderNovelInfo {
  id?: string;
  slug: string;
  title: string;
  coverUrl: string;
  chapterCount?: number;
  author: {
    name: string;
    username?: string;
    avatar?: string;
  };
  rating?: number;
}

interface ReaderChapterInfo {
  id?: string;
  chapterNumber: number;
  title: string;
  content: string;
  wordCount: number;
  isPremium?: boolean;
  scenes?: Array<{
    order: number;
    text: string;
    illustrationUrl?: string;
    ambientAudioUrl?: string;
    narrationAudioUrl?: string;
    musicTrackUrl?: string;
  }>;
  openingIllustrationUrl?: string;
  authorNote?: string;
}

export default function ChapterReaderPage({ params }: ChapterReaderPageProps) {
  const resolvedParams = React.use(params);
  const chapterNum = parseInt(resolvedParams.chapterNumber, 10) || 1;
  const seedFallback = SEED_NOVELS.find((n) => n.slug === resolvedParams.slug);
  const seedChapterFallback = seedFallback?.chapters.find((c) => c.chapterNumber === chapterNum);

  const [novel, setNovel] = React.useState<ReaderNovelInfo | null>(seedFallback || null);
  const [chapter, setChapter] = React.useState<ReaderChapterInfo | null>(seedChapterFallback || null);
  const [chaptersList, setChaptersList] = React.useState<Array<{ chapterNumber: number; title: string }>>(
    seedFallback?.chapters.map((c) => ({ chapterNumber: c.chapterNumber, title: c.title })) || []
  );
  const [allChaptersContent, setAllChaptersContent] = React.useState<
    Array<{ chapterNumber: number; title: string; content: string }>
  >(
    seedFallback?.chapters.map((c) => ({
      chapterNumber: c.chapterNumber,
      title: c.title,
      content: c.content,
    })) || []
  );

  const [isLoading, setIsLoading] = React.useState(!seedChapterFallback);
  const [settings, setSettings] = React.useState<ReaderSettings>(DEFAULT_READER_SETTINGS);

  // Modals & Drawers
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [discussionsOpen, setDiscussionsOpen] = React.useState(false);
  const [audioOpen, setAudioOpen] = React.useState(false);
  const [completionOpen, setCompletionOpen] = React.useState(false);
  const [quoteCardOpen, setQuoteCardOpen] = React.useState(false);
  const [selectedQuote, setSelectedQuote] = React.useState("");

  // Enterprise Features: AI Companion & Paragraph Comments
  const [aiCompanionOpen, setAiCompanionOpen] = React.useState(false);
  const [paragraphCommentsOpen, setParagraphCommentsOpen] = React.useState(false);
  const [activeParagraphIndex, setActiveParagraphIndex] = React.useState(0);
  const [activeParagraphText, setActiveParagraphText] = React.useState("");

  // Text selection state
  const [selectedText, setSelectedText] = React.useState("");
  const [selectionCoords, setSelectionCoords] = React.useState<{ x: number; y: number } | null>(null);

  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const hasTriggeredCompletion = React.useRef(false);
  const prefetchedChapterRef = React.useRef<number | null>(null);

  // Load Settings & Bookmark Status
  React.useEffect(() => {
    setSettings(getReaderSettings());
    setIsBookmarked(isChapterBookmarked(resolvedParams.slug, chapterNum));
  }, [resolvedParams.slug, chapterNum]);

  // Load Chapter dynamically from API
  React.useEffect(() => {
    async function loadChapter() {
      try {
        // 1. Try IndexedDB high-speed offline store first
        const offlineData = await getChapterOfflineIDB(resolvedParams.slug, chapterNum);
        if (offlineData) {
          setChapter({
            chapterNumber: offlineData.chapterNumber,
            title: offlineData.title,
            content: offlineData.content,
            wordCount: offlineData.wordCount,
            scenes: offlineData.scenes,
          });
          setIsLoading(false);
          // Still fetch in background to sync any updates
        }

        // 2. Fetch fresh from API
        const res = await fetch(`/api/novels/${resolvedParams.slug}/chapters/${chapterNum}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.chapter) {
            setNovel(data.novel);
            setChapter(data.chapter);
            if (data.chaptersList) {
              setChaptersList(data.chaptersList);
            }
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Fallback to seed
      }

      if (seedFallback && seedChapterFallback) {
        setNovel(seedFallback);
        setChapter(seedChapterFallback);
        setChaptersList(seedFallback.chapters.map((c) => ({ chapterNumber: c.chapterNumber, title: c.title })));
        setAllChaptersContent(
          seedFallback.chapters.map((c) => ({
            chapterNumber: c.chapterNumber,
            title: c.title,
            content: c.content,
          }))
        );
      }
      setIsLoading(false);
    }

    loadChapter();
  }, [resolvedParams.slug, chapterNum, seedFallback, seedChapterFallback]);

  // Zero-latency background prefetching for the next chapter (second-plan §7)
  React.useEffect(() => {
    if (scrollProgress >= 50 && prefetchedChapterRef.current !== chapterNum + 1) {
      prefetchedChapterRef.current = chapterNum + 1;
      fetch(`/api/novels/${resolvedParams.slug}/chapters/${chapterNum + 1}`).catch(() => {});
    }
  }, [scrollProgress, chapterNum, resolvedParams.slug]);

  // Active reading duration tracker with idle detection
  const lastSyncTimeRef = React.useRef<number>(0);
  const accumulatedSecondsRef = React.useRef<number>(0);
  const isTabActiveRef = React.useRef<boolean>(true);

  React.useEffect(() => {
    const onFocus = () => {
      isTabActiveRef.current = true;
    };
    const onBlur = () => {
      isTabActiveRef.current = false;
    };
    const onVisibilityChange = () => {
      isTabActiveRef.current = !document.hidden;
    };

    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibilityChange);

    const interval = setInterval(() => {
      if (isTabActiveRef.current) {
        accumulatedSecondsRef.current += 1;

        if (accumulatedSecondsRef.current - lastSyncTimeRef.current >= 15 && novel) {
          const increment = accumulatedSecondsRef.current - lastSyncTimeRef.current;
          lastSyncTimeRef.current = accumulatedSecondsRef.current;

          trackReadingProgress({
            novelSlug: novel.slug,
            novelTitle: novel.title,
            novelCoverUrl: novel.coverUrl,
            authorName: novel.author.name,
            totalChapters: novel.chapterCount || chaptersList.length || 1,
            chapterNumber: chapterNum,
            position: scrollProgress,
            timeIncrementSeconds: increment,
            completed: scrollProgress >= 90,
          });
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibilityChange);

      if (novel && accumulatedSecondsRef.current > lastSyncTimeRef.current) {
        const remaining = accumulatedSecondsRef.current - lastSyncTimeRef.current;
        trackReadingProgress({
          novelSlug: novel.slug,
          novelTitle: novel.title,
          novelCoverUrl: novel.coverUrl,
          authorName: novel.author.name,
          totalChapters: novel.chapterCount || chaptersList.length || 1,
          chapterNumber: chapterNum,
          position: scrollProgress,
          timeIncrementSeconds: remaining,
          completed: scrollProgress >= 90,
        });
      }
    };
  }, [novel, chapterNum, scrollProgress, chaptersList]);

  // Calculate scroll reading progress & Trigger Completion Modal
  React.useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        const bounded = Math.min(100, Math.max(0, Math.round(currentProgress)));
        setScrollProgress(bounded);

        if (bounded >= 98 && !hasTriggeredCompletion.current) {
          hasTriggeredCompletion.current = true;
          setCompletionOpen(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Text selection handler (Module 6)
  React.useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) {
        const text = selection.toString().trim();
        if (text.length > 2) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setSelectedText(text);
          setSelectionCoords({
            x: rect.left + rect.width / 2,
            y: rect.top + window.scrollY,
          });
          return;
        }
      }
    };

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("touchend", handleSelection);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("touchend", handleSelection);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <header className="sticky top-0 z-40 border-b border-white/5 bg-black/90 px-4 py-3">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse" />
            <div className="h-6 w-24 bg-zinc-800 rounded animate-pulse" />
          </div>
        </header>
        <main className="flex-1 mx-auto max-w-4xl w-full px-4 sm:px-8 py-12 space-y-6 animate-pulse">
          <div className="h-10 w-3/4 mx-auto bg-zinc-800 rounded-lg" />
          <div className="h-4 w-48 mx-auto bg-zinc-800/60 rounded" />
          <div className="space-y-4 pt-8">
            <div className="h-4 w-full bg-zinc-900 rounded" />
            <div className="h-4 w-full bg-zinc-900 rounded" />
            <div className="h-4 w-5/6 bg-zinc-900 rounded" />
          </div>
        </main>
      </div>
    );
  }

  if (!novel || !chapter) {
    return notFound();
  }

  const totalChCount = chaptersList.length > 0 ? chaptersList.length : (novel.chapterCount || 1);
  const hasPrev = chapterNum > 1;
  const hasNext = chapterNum < totalChCount;

  const handleNextChapter = () => {
    if (novel) {
      const remaining = accumulatedSecondsRef.current - lastSyncTimeRef.current;
      lastSyncTimeRef.current = accumulatedSecondsRef.current;
      trackReadingProgress({
        novelSlug: novel.slug,
        novelTitle: novel.title,
        novelCoverUrl: novel.coverUrl,
        authorName: novel.author?.name || "Author",
        totalChapters: totalChCount,
        chapterNumber: chapterNum,
        position: 100,
        timeIncrementSeconds: remaining,
        completed: true,
      });
    }
  };

  const handleToggleBookmark = () => {
    const res = toggleBookmark({
      novelSlug: novel.slug,
      novelTitle: novel.title,
      chapterNumber: chapterNum,
      chapterTitle: chapter.title,
      snippet: chapter.content.slice(0, 120),
      scrollPercentage: scrollProgress,
    });
    setIsBookmarked(res.isBookmarked);
    toast.success(res.isBookmarked ? "Bookmark saved to Library!" : "Bookmark removed");
  };

  // Theme Styling Classes
  const themeClasses = {
    amoled: "bg-black text-zinc-100 border-zinc-900",
    dark: "bg-[#121214] text-zinc-200 border-zinc-800",
    sepia: "bg-[#fbf0d9] text-[#433422] border-[#e0ceb1]",
    paper: "bg-[#f8f9fa] text-zinc-900 border-zinc-200",
  };

  const headerThemeClasses = {
    amoled: "bg-black/90 border-white/5 text-white",
    dark: "bg-[#121214]/90 border-zinc-800 text-white",
    sepia: "bg-[#fbf0d9]/95 border-[#e0ceb1] text-[#433422]",
    paper: "bg-[#f8f9fa]/95 border-zinc-300 text-zinc-900",
  };

  const fontClasses = {
    serif: "font-serif tracking-normal",
    sans: "font-sans tracking-tight",
    dyslexic: "font-mono tracking-wide leading-loose",
    mono: "font-mono",
  };

  const fontSizeClasses = {
    xs: "text-sm sm:text-base",
    sm: "text-base sm:text-lg",
    base: "text-lg sm:text-xl",
    lg: "text-xl sm:text-2xl",
    xl: "text-2xl sm:text-3xl",
    "2xl": "text-3xl sm:text-4xl",
  };

  const lineHeightClasses = {
    tight: "leading-snug",
    normal: "leading-normal sm:leading-relaxed",
    relaxed: "leading-relaxed sm:leading-loose",
    loose: "leading-loose sm:leading-[2.4]",
  };

  const widthClasses = {
    narrow: "max-w-2xl",
    normal: "max-w-4xl",
    wide: "max-w-5xl",
    full: "max-w-6xl",
  };

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col transition-colors duration-200 selection:bg-violet-600/30 selection:text-white",
        themeClasses[settings.theme]
      )}
    >
      {/* Top Fixed Reading Progress Bar */}
      <ChapterReaderProgress value={scrollProgress} />

      {/* Top Reader Navigation Bar (Module 5 & 8) */}
      <header
        className={cn(
          "sticky top-0 z-40 border-b backdrop-blur-xl px-4 py-3 transition-colors",
          headerThemeClasses[settings.theme]
        )}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={`/novels/${novel.slug}`}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              aria-label="Back to novel details"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="min-w-0">
              <h2 className="text-xs font-medium opacity-70 truncate">
                {novel.title}
              </h2>
              <div className="flex items-center gap-2">
                <select
                  value={chapterNum}
                  onChange={(e) => {
                    const nextNum = e.target.value;
                    window.location.href = `/read/${novel.slug}/${nextNum}`;
                  }}
                  className="bg-transparent text-sm font-bold border-0 focus:ring-0 cursor-pointer p-0 pr-4 truncate outline-none hover:text-violet-400"
                >
                  {(chaptersList.length > 0 ? chaptersList : [chapter]).map((ch) => (
                    <option
                      key={ch.chapterNumber}
                      value={ch.chapterNumber}
                      className="bg-zinc-950 text-white"
                    >
                      Chapter {ch.chapterNumber}: {(ch.title || `Chapter ${ch.chapterNumber}`).replace(/^Chapter\s+\d+[:\s-]*/i, "")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Reader Controls Toolbar */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Audio TTS Toggle */}
            <button
              onClick={() => setAudioOpen(!audioOpen)}
              className={cn(
                "p-2 rounded-xl border transition-colors flex items-center gap-1 text-xs font-semibold",
                audioOpen
                  ? "bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-600/30"
                  : "bg-zinc-900/60 border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800"
              )}
              title="Listen with TTS Audio"
            >
              <Headphones className="w-4 h-4 text-violet-400" />
              <span className="hidden sm:inline">Listen</span>
            </button>

            {/* Offline Save Button */}
            <OfflineDownloadButton
              novel={{
                slug: novel.slug,
                title: novel.title,
                coverUrl: novel.coverUrl,
                authorName: novel.author.name,
                totalChapters: totalChCount,
              }}
              chapter={{
                chapterNumber: chapterNum,
                title: chapter.title,
                content: chapter.content,
                wordCount: chapter.wordCount,
              }}
            />

            {/* AI Reading Companion Trigger (second-plan §24) */}
            <button
              onClick={() => setAiCompanionOpen(true)}
              className="p-2 rounded-xl border bg-violet-950/80 border-violet-500/40 text-violet-300 hover:text-white hover:bg-violet-900/80 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Ask AI Companion (Spoiler-safe)"
            >
              <Bot className="w-4 h-4 text-violet-400" />
              <span className="hidden md:inline">AI Companion</span>
            </button>

            {/* Settings Dialog Trigger */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-xl border bg-zinc-900/60 border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Reading Settings (Theme, Font, Size)"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Bookmark toggle */}
            <button
              onClick={handleToggleBookmark}
              className={cn(
                "p-2 rounded-xl border transition-colors",
                isBookmarked
                  ? "bg-violet-950/90 border-violet-500 text-violet-300"
                  : "bg-zinc-900/60 border-white/10 text-zinc-400 hover:text-white"
              )}
              title="Bookmark Chapter"
            >
              <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
            </button>

            {/* In-Reader Drawer Menu (⋮) */}
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 rounded-xl border bg-zinc-900/60 border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Reader Menu (Search, Chapters, Notes, Highlights)"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Chapter Body */}
      <main
        className={cn(
          "flex-1 mx-auto w-full px-4 sm:px-8 py-12 relative transition-all",
          widthClasses[settings.readerWidth]
        )}
      >
        {/* Chapter Header */}
        <div className="text-center space-y-3 mb-12 pb-8 border-b border-white/10">
          <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest">
            {novel.title}
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            {chapter.title.toLowerCase().startsWith("chapter")
              ? chapter.title
              : `Chapter ${chapter.chapterNumber}: ${chapter.title}`}
          </h1>
          <p className="text-xs opacity-60">
            by {novel.author.name} • {chapter.wordCount.toLocaleString()} words
          </p>
        </div>

        {/* Chapter Prose or Cinematic Scene Breakdown (second-plan §8 & §23) */}
        <article
          className={cn(
            "prose max-w-none transition-all",
            fontClasses[settings.fontFamily],
            fontSizeClasses[settings.fontSize],
            lineHeightClasses[settings.lineHeight],
            settings.textAlign === "justify" ? "text-justify" : "text-left",
            settings.paragraphSpacing === "spacious" ? "space-y-8" : "space-y-6"
          )}
        >
          {chapter.scenes && chapter.scenes.length > 0 ? (
            <div className="space-y-12">
              {chapter.scenes.map((scene, sIdx) => (
                <div key={sIdx} className="space-y-6 p-6 rounded-3xl bg-zinc-950/40 border border-white/5">
                  <div className="flex items-center justify-between text-xs text-zinc-500 border-b border-white/5 pb-2">
                    <span className="uppercase font-bold tracking-widest text-violet-400">
                      Scene {scene.order}
                    </span>
                    {scene.ambientAudioUrl && (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Volume2 className="w-3 h-3" /> Ambient Sound Active
                      </span>
                    )}
                  </div>

                  {scene.illustrationUrl && (
                    <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden my-4 border border-white/10">
                      <img
                        src={scene.illustrationUrl}
                        alt={`Scene ${scene.order}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {scene.text.split("\n\n").map((paragraph, pIdx) => (
                    <div key={pIdx} className="group relative transition-all">
                      <p className="transition-all">{paragraph}</p>
                      <button
                        onClick={() => {
                          setActiveParagraphIndex(pIdx);
                          setActiveParagraphText(paragraph);
                          setParagraphCommentsOpen(true);
                        }}
                        className="absolute -right-8 top-1 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-violet-400 hover:border-violet-500/40 transition-all text-xs"
                        title="Discuss this paragraph"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            chapter.content.split("\n\n").map((paragraph, idx) => (
              <div key={idx} className="group relative transition-all">
                <p className="transition-all">{paragraph}</p>
                <button
                  onClick={() => {
                    setActiveParagraphIndex(idx);
                    setActiveParagraphText(paragraph);
                    setParagraphCommentsOpen(true);
                  }}
                  className="absolute -right-8 top-1 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-violet-400 hover:border-violet-500/40 transition-all text-xs"
                  title="Discuss this paragraph"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </article>

        {/* Chapter Reactions Widget (Module 16) */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <ChapterReactions
            novelSlug={novel.slug}
            chapterNumber={chapterNum}
          />
        </div>

        {/* Chapter Bottom Navigation & Progress */}
        <div className="mt-12 pt-8 border-t border-white/10 space-y-6">
          <div className="flex items-center justify-between gap-4">
            {hasPrev ? (
              <Link href={`/read/${novel.slug}/${chapterNum - 1}`}>
                <Button
                  variant="outline"
                  className="rounded-full border-white/10 bg-zinc-950 text-xs font-semibold text-white hover:bg-zinc-900"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous Chapter
                </Button>
              </Link>
            ) : (
              <div />
            )}

            <div className="text-center">
              <p className="text-xs font-medium opacity-80 tabular-nums">
                Reading Progress: <span className="text-violet-400 font-bold">{scrollProgress}%</span>
              </p>
            </div>

            {hasNext ? (
              <Link href={`/read/${novel.slug}/${chapterNum + 1}`} onClick={handleNextChapter}>
                <Button className="rounded-full bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white shadow-lg shadow-violet-600/30">
                  Next Chapter
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            ) : (
              <Button
                onClick={() => setCompletionOpen(true)}
                variant="outline"
                className="rounded-full border-violet-500/40 bg-violet-950/40 text-violet-300 text-xs font-semibold hover:bg-violet-900"
              >
                Novel Finished <Check className="w-4 h-4 ml-1.5" />
              </Button>
            )}
          </div>
        </div>
      </main>

      {/* Floating Text Selection Toolbar (Module 6) */}
      <ReaderTextToolbar
        novelSlug={novel.slug}
        chapterNumber={chapterNum}
        selectedText={selectedText}
        selectionCoords={selectionCoords}
        onClearSelection={() => {
          setSelectedText("");
          setSelectionCoords(null);
        }}
        onOpenQuoteCard={(quote) => {
          setSelectedQuote(quote);
          setQuoteCardOpen(true);
        }}
        onSpeakSelection={(text) => {
          if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            const utt = new SpeechSynthesisUtterance(text);
            utt.rate = settings.speechRate || 1.0;
            window.speechSynthesis.speak(utt);
          }
        }}
      />

      {/* In-Reader Audio / TTS Player (Module 39) */}
      <ReaderAudioPlayer
        title={novel.title}
        chapterTitle={chapter.title}
        content={chapter.content}
        settings={settings}
        isOpen={audioOpen}
        onClose={() => setAudioOpen(false)}
        onRateChange={(rate) => {
          setSettings(saveReaderSettings({ speechRate: rate }));
        }}
      />

      {/* In-Reader Side Menu Drawer (Module 8, 12, 13) */}
      <ReaderDrawerMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        novelSlug={novel.slug}
        novelTitle={novel.title}
        currentChapterNumber={chapterNum}
        chaptersList={chaptersList}
        allChaptersContent={allChaptersContent}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenAudio={() => setAudioOpen(true)}
        onShare={() => {
          setSelectedQuote(chapter.content.slice(0, 140));
          setQuoteCardOpen(true);
        }}
        onOpenDiscussions={() => setDiscussionsOpen(true)}
      />

      {/* Chapter Discussion Drawer (Module 17 & 18) */}
      <ChapterDiscussionDrawer
        isOpen={discussionsOpen}
        onClose={() => setDiscussionsOpen(false)}
        novelSlug={novel.slug}
        novelTitle={novel.title}
        chapterNumber={chapterNum}
        chapterTitle={chapter.title}
      />

      {/* Chapter Completion Modal (Module 15) */}
      <ChapterCompletionModal
        open={completionOpen}
        onOpenChange={setCompletionOpen}
        novelSlug={novel.slug}
        novelTitle={novel.title}
        chapterNumber={chapterNum}
        chapterTitle={chapter.title}
        nextChapterNumber={hasNext ? chapterNum + 1 : undefined}
        onOpenDiscussions={() => setDiscussionsOpen(true)}
      />

      {/* Quote Card Generator Modal (Module 26) */}
      <QuoteCardModal
        open={quoteCardOpen}
        onOpenChange={setQuoteCardOpen}
        quoteText={selectedQuote}
        novelTitle={novel.title}
        authorName={novel.author.name}
      />

      {/* Reader Settings Modal (Module 7) */}
      <ReaderSettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        onSettingsChange={setSettings}
      />

      {/* Inline Paragraph Comments Drawer (second-plan §19) */}
      <ParagraphCommentsDrawer
        isOpen={paragraphCommentsOpen}
        onClose={() => setParagraphCommentsOpen(false)}
        novelSlug={novel.slug}
        chapterNumber={chapterNum}
        paragraphIndex={activeParagraphIndex}
        paragraphText={activeParagraphText}
      />

      {/* AI Reading Companion Drawer (second-plan §24) */}
      <ReaderAICompanion
        isOpen={aiCompanionOpen}
        onClose={() => setAiCompanionOpen(false)}
        novelTitle={novel.title}
        novelSlug={novel.slug}
        currentChapterNumber={chapterNum}
      />
    </div>
  );
}

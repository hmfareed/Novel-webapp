"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bookmark,
  Search,
  BookOpen,
  FileText,
  Sparkles,
  Headphones,
  Share2,
  Settings,
  CheckCircle2,
  Circle,
  X,
  Trash2,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import {
  type ReaderBookmark,
  type ReaderHighlight,
  type ReaderNote,
  getBookmarks,
  getHighlights,
  getNotes,
  deleteBookmark,
  deleteHighlight,
  deleteNote,
} from "@/lib/reader-storage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ChapterItem {
  chapterNumber: number;
  title: string;
  wordCount?: number;
}

interface ReaderDrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  novelSlug: string;
  novelTitle: string;
  currentChapterNumber: number;
  chaptersList: ChapterItem[];
  allChaptersContent?: Array<{ chapterNumber: number; title: string; content: string }>;
  onOpenSettings: () => void;
  onOpenAudio: () => void;
  onShare: () => void;
  onOpenDiscussions: () => void;
}

export function ReaderDrawerMenu({
  isOpen,
  onClose,
  novelSlug,
  novelTitle,
  currentChapterNumber,
  chaptersList,
  allChaptersContent = [],
  onOpenSettings,
  onOpenAudio,
  onShare,
  onOpenDiscussions,
}: ReaderDrawerMenuProps) {
  const [activeTab, setActiveTab] = React.useState<
    "chapters" | "search" | "bookmarks" | "highlights" | "notes"
  >("chapters");

  const [searchQuery, setSearchQuery] = React.useState("");
  const [bookmarks, setBookmarks] = React.useState<ReaderBookmark[]>([]);
  const [highlights, setHighlights] = React.useState<ReaderHighlight[]>([]);
  const [notes, setNotes] = React.useState<ReaderNote[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      setBookmarks(getBookmarks(novelSlug));
      setHighlights(getHighlights(novelSlug));
      setNotes(getNotes(novelSlug));
    }
  }, [isOpen, novelSlug]);

  // Search inside novel across chapters
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];

    const q = searchQuery.toLowerCase();
    const results: Array<{
      chapterNumber: number;
      chapterTitle: string;
      snippet: string;
    }> = [];

    for (const ch of allChaptersContent) {
      const idx = ch.content.toLowerCase().indexOf(q);
      if (idx !== -1) {
        const start = Math.max(0, idx - 40);
        const end = Math.min(ch.content.length, idx + q.length + 60);
        const snippet = (start > 0 ? "..." : "") + ch.content.slice(start, end).replace(/\n/g, " ") + (end < ch.content.length ? "..." : "");
        results.push({
          chapterNumber: ch.chapterNumber,
          chapterTitle: ch.title,
          snippet,
        });
      }
    }
    return results;
  }, [searchQuery, allChaptersContent]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-zinc-950/95 border-l border-white/10 h-full flex flex-col z-10 shadow-2xl backdrop-blur-2xl text-white">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">
              Reader Menu (Module 8)
            </span>
            <h3 className="text-sm font-bold text-white truncate mt-0.5">
              {novelTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Shortcut Bar */}
        <div className="grid grid-cols-4 gap-1 p-2 bg-zinc-900/50 border-b border-white/5 text-center">
          <button
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
            className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/10 transition-colors flex flex-col items-center gap-1 text-[11px]"
          >
            <Settings className="w-4 h-4 text-violet-400" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenAudio();
            }}
            className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/10 transition-colors flex flex-col items-center gap-1 text-[11px]"
          >
            <Headphones className="w-4 h-4 text-blue-400" />
            <span>Audio TTS</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenDiscussions();
            }}
            className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/10 transition-colors flex flex-col items-center gap-1 text-[11px]"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Discuss</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onShare();
            }}
            className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/10 transition-colors flex flex-col items-center gap-1 text-[11px]"
          >
            <Share2 className="w-4 h-4 text-amber-400" />
            <span>Share</span>
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1 px-3 pt-3 border-b border-white/10 overflow-x-auto">
          {[
            { id: "chapters", label: "Chapters", icon: BookOpen, count: chaptersList.length },
            { id: "search", label: "Search", icon: Search },
            { id: "bookmarks", label: "Bookmarks", icon: Bookmark, count: bookmarks.length },
            { id: "highlights", label: "Highlights", icon: Sparkles, count: highlights.length },
            { id: "notes", label: "Notes", icon: FileText, count: notes.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  "px-3 py-2 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2",
                  isSelected
                    ? "border-violet-500 text-white bg-white/5"
                    : "border-transparent text-zinc-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="text-[10px] bg-violet-950 text-violet-300 px-1.5 py-0.2 rounded-full border border-violet-500/20 font-mono">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* TAB 1: Chapters */}
          {activeTab === "chapters" && (
            <div className="space-y-1.5">
              <p className="text-xs text-zinc-400 mb-2">
                Select chapter to jump directly (Module 13):
              </p>
              {chaptersList.map((ch) => {
                const isCurrent = ch.chapterNumber === currentChapterNumber;
                const isCompleted = ch.chapterNumber < currentChapterNumber;

                return (
                  <Link
                    key={ch.chapterNumber}
                    href={`/read/${novelSlug}/${ch.chapterNumber}`}
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-2xl border transition-all text-xs",
                      isCurrent
                        ? "bg-violet-950/70 border-violet-500 text-violet-200 font-bold"
                        : "bg-zinc-900/60 border-white/5 text-zinc-300 hover:bg-zinc-900 hover:border-white/15"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <div className="w-4 h-4 rounded-full bg-violet-500 text-white flex items-center justify-center shrink-0 text-[10px]">
                          ●
                        </div>
                      ) : (
                        <Circle className="w-4 h-4 text-zinc-600 shrink-0" />
                      )}
                      <span className="truncate">
                        Chapter {ch.chapterNumber}: {ch.title.replace(/^Chapter\s+\d+[:\s-]*/i, "")}
                      </span>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] text-violet-400 bg-violet-900/50 px-2 py-0.5 rounded-full border border-violet-500/30 shrink-0">
                        Reading Now
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {/* TAB 2: Search in Novel (Module 12) */}
          {activeTab === "search" && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search keywords across novel..."
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              {searchQuery.trim().length < 2 ? (
                <p className="text-xs text-zinc-500 text-center py-8">
                  Type at least 2 characters to search across all chapters.
                </p>
              ) : searchResults.length === 0 ? (
                <p className="text-xs text-zinc-400 text-center py-8">
                  No matching passages found for &quot;{searchQuery}&quot;.
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-[11px] text-zinc-400">
                    Found {searchResults.length} occurrence{searchResults.length > 1 ? "s" : ""}:
                  </p>
                  {searchResults.map((res, idx) => (
                    <Link
                      key={idx}
                      href={`/read/${novelSlug}/${res.chapterNumber}`}
                      onClick={onClose}
                      className="block p-3 rounded-2xl bg-zinc-900/70 border border-white/5 hover:border-violet-500/50 transition-all text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-violet-400 font-bold text-[11px]">
                        <span>Chapter {res.chapterNumber}: {res.chapterTitle}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-zinc-300 italic text-[11px] leading-relaxed">
                        {res.snippet}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Bookmarks (Module 9) */}
          {activeTab === "bookmarks" && (
            <div className="space-y-2">
              {bookmarks.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-8">
                  No bookmarks saved for this novel yet. Tap the bookmark icon in the top header to save your point.
                </p>
              ) : (
                bookmarks.map((bm) => (
                  <div
                    key={bm.id}
                    className="p-3 rounded-2xl bg-zinc-900/70 border border-white/5 hover:border-white/20 transition-all text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-violet-300">
                        Chapter {bm.chapterNumber}: {bm.chapterTitle}
                      </span>
                      <button
                        onClick={() => {
                          setBookmarks(bookmarks.filter((b) => b.id !== bm.id));
                          toast.info("Bookmark removed");
                        }}
                        className="text-zinc-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {bm.snippet && (
                      <p className="text-zinc-400 italic text-[11px] line-clamp-2">
                        &quot;{bm.snippet}&quot;
                      </p>
                    )}
                    <Link
                      href={`/read/${novelSlug}/${bm.chapterNumber}`}
                      onClick={onClose}
                      className="inline-flex items-center gap-1 text-[11px] text-violet-400 font-semibold hover:underline"
                    >
                      Jump to Chapter <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: Highlights (Module 10) */}
          {activeTab === "highlights" && (
            <div className="space-y-2">
              {highlights.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-8">
                  Select text in the reader to highlight passages with color tags.
                </p>
              ) : (
                highlights.map((hl) => (
                  <div
                    key={hl.id}
                    className="p-3 rounded-2xl bg-zinc-900/70 border border-white/5 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-zinc-400">
                        Chapter {hl.chapterNumber}
                      </span>
                      <button
                        onClick={() => {
                          deleteHighlight(hl.id);
                          setHighlights(highlights.filter((h) => h.id !== hl.id));
                          toast.info("Highlight deleted");
                        }}
                        className="text-zinc-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p
                      className={cn(
                        "p-2 rounded-xl text-xs leading-relaxed border",
                        hl.color === "yellow" && "bg-amber-500/10 text-amber-200 border-amber-500/30",
                        hl.color === "emerald" && "bg-emerald-500/10 text-emerald-200 border-emerald-500/30",
                        hl.color === "violet" && "bg-violet-500/10 text-violet-200 border-violet-500/30",
                        hl.color === "coral" && "bg-rose-500/10 text-rose-200 border-rose-500/30"
                      )}
                    >
                      &quot;{hl.selectedText}&quot;
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 5: Notes (Module 11) */}
          {activeTab === "notes" && (
            <div className="space-y-2">
              {notes.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-8">
                  Select any text to write margin notes or connect theories across chapters.
                </p>
              ) : (
                notes.map((nt) => (
                  <div
                    key={nt.id}
                    className="p-3 rounded-2xl bg-zinc-900/70 border border-white/5 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-violet-400">
                        Chapter {nt.chapterNumber} Note
                      </span>
                      <button
                        onClick={() => {
                          deleteNote(nt.id);
                          setNotes(notes.filter((n) => n.id !== nt.id));
                          toast.info("Note removed");
                        }}
                        className="text-zinc-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-zinc-400 italic text-[11px] border-l-2 border-zinc-700 pl-2">
                      &quot;{nt.selectedText}&quot;
                    </p>
                    <p className="text-white font-medium bg-white/5 p-2 rounded-xl">
                      {nt.noteText}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ArrowRight,
  MessageSquare,
  BookOpen,
  Users,
  Flame,
  CheckCircle,
  Trophy,
} from "lucide-react";
import { ChapterReactions } from "./chapter-reactions";

interface ChapterCompletionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  novelSlug: string;
  novelTitle: string;
  chapterNumber: number;
  chapterTitle: string;
  nextChapterNumber?: number;
  onOpenDiscussions: () => void;
}

export function ChapterCompletionModal({
  open,
  onOpenChange,
  novelSlug,
  novelTitle,
  chapterNumber,
  chapterTitle,
  nextChapterNumber,
  onOpenDiscussions,
}: ChapterCompletionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-zinc-950/95 border-violet-500/30 text-white backdrop-blur-2xl p-6 sm:p-8 text-center space-y-6">
        {/* Celebration Header */}
        <div className="space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 mx-auto flex items-center justify-center shadow-xl shadow-violet-600/40 animate-bounce">
            <Trophy className="w-8 h-8 text-white" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-violet-400 uppercase tracking-widest bg-violet-950/80 px-3 py-0.5 rounded-full border border-violet-500/20">
              Module 15 — Chapter Complete
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Chapter {chapterNumber} Finished! 🎉
            </h2>
            <p className="text-xs text-zinc-400 truncate">
              {novelTitle} • &quot;{chapterTitle}&quot;
            </p>
          </div>
        </div>

        {/* Live Social Co-Reader Pulse */}
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/20 rounded-2xl p-3 flex items-center justify-center gap-2 text-xs font-semibold text-amber-300">
          <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>73 people are reading this novel right now</span>
        </div>

        {/* Reactions widget */}
        <div className="border-t border-b border-white/5 py-4">
          <ChapterReactions
            novelSlug={novelSlug}
            chapterNumber={chapterNumber}
          />
        </div>

        {/* Navigation & Action Buttons */}
        <div className="space-y-2.5">
          {nextChapterNumber ? (
            <Link
              href={`/read/${novelSlug}/${nextChapterNumber}`}
              onClick={() => onOpenChange(false)}
              className="block w-full"
            >
              <Button className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 py-6 text-sm font-bold shadow-xl shadow-violet-600/30 flex items-center justify-center gap-2">
                Continue to Chapter {nextChapterNumber}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <Link
              href={`/novels/${novelSlug}`}
              onClick={() => onOpenChange(false)}
              className="block w-full"
            >
              <Button className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-6 text-sm font-bold shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2">
                Novel Completed! Review & Rate <CheckCircle className="w-4 h-4" />
              </Button>
            </Link>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                onOpenDiscussions();
              }}
              className="rounded-2xl border-white/10 bg-zinc-900/60 hover:bg-zinc-900 text-xs font-semibold text-zinc-300 hover:text-white"
            >
              <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-violet-400" />
              Discuss Chapter
            </Button>

            <Link href={`/novels/${novelSlug}`} onClick={() => onOpenChange(false)}>
              <Button
                variant="outline"
                className="w-full rounded-2xl border-white/10 bg-zinc-900/60 hover:bg-zinc-900 text-xs font-semibold text-zinc-300 hover:text-white"
              >
                <BookOpen className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                Novel Details
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

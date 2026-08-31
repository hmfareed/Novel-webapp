"use client";

import * as React from "react";
import Image from "next/image";
import {
  MessageSquare,
  AlertTriangle,
  Heart,
  Send,
  X,
  Eye,
  EyeOff,
  CornerDownRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CommentItem {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  isSpoiler: boolean;
  timeAgo: string;
  likesCount: number;
  hasLiked?: boolean;
}

interface ChapterDiscussionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  novelSlug: string;
  novelTitle: string;
  chapterNumber: number;
  chapterTitle: string;
}

const SEED_COMMENTS: Record<string, CommentItem[]> = {
  default: [
    {
      id: "c1",
      authorName: "Ama Mensah",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      text: "That ending scene gave me chills! The way the prophecy comes full circle is pure mastery 😭✨",
      isSpoiler: false,
      timeAgo: "2h ago",
      likesCount: 34,
      hasLiked: true,
    },
    {
      id: "c2",
      authorName: "Kojo Asante",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      text: "Notice the blacksmith's whispered words before handing over the iron staff. That is definitely linked to the ancient royal lineage!",
      isSpoiler: true,
      timeAgo: "4h ago",
      likesCount: 19,
      hasLiked: false,
    },
    {
      id: "c3",
      authorName: "Mohammed",
      authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      text: "Nobody saw that twist coming 😂 I'm immediately moving to the next chapter!",
      isSpoiler: false,
      timeAgo: "6h ago",
      likesCount: 42,
      hasLiked: false,
    },
  ],
};

export function ChapterDiscussionDrawer({
  isOpen,
  onClose,
  novelSlug,
  novelTitle,
  chapterNumber,
  chapterTitle,
}: ChapterDiscussionDrawerProps) {
  const [comments, setComments] = React.useState<CommentItem[]>(SEED_COMMENTS.default);
  const [newCommentText, setNewCommentText] = React.useState("");
  const [isSpoilerTag, setIsSpoilerTag] = React.useState(false);
  const [revealedSpoilers, setRevealedSpoilers] = React.useState<Set<string>>(new Set());

  const handleToggleSpoiler = (id: string) => {
    setRevealedSpoilers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleLike = (id: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextLiked = !c.hasLiked;
          return {
            ...c,
            hasLiked: nextLiked,
            likesCount: c.likesCount + (nextLiked ? 1 : -1),
          };
        }
        return c;
      })
    );
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: CommentItem = {
      id: `c_${Date.now()}`,
      authorName: "You (Reader)",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      text: newCommentText.trim(),
      isSpoiler: isSpoilerTag,
      timeAgo: "Just now",
      likesCount: 0,
      hasLiked: false,
    };

    setComments([newComment, ...comments]);
    setNewCommentText("");
    setIsSpoilerTag(false);
    toast.success("Comment posted to Chapter Discussion!");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Discussion Drawer */}
      <div className="relative w-full max-w-lg bg-zinc-950/95 border-l border-white/10 h-full flex flex-col z-10 shadow-2xl backdrop-blur-2xl text-white">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">
                Chapter {chapterNumber} Discussion (Modules 17 & 18)
              </span>
            </div>
            <h3 className="text-sm font-bold text-white truncate mt-0.5">
              {chapterTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comment list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="bg-violet-950/40 border border-violet-500/20 rounded-2xl p-3 text-xs text-zinc-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
            <p>
              This thread is strictly isolated to Chapter {chapterNumber} to protect readers from future story spoilers.
            </p>
          </div>

          {comments.map((c) => {
            const isRevealed = revealedSpoilers.has(c.id);

            return (
              <div
                key={c.id}
                className="p-3.5 rounded-2xl bg-zinc-900/70 border border-white/5 space-y-2 text-xs"
              >
                {/* Author row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={c.authorAvatar}
                      alt={c.authorName}
                      className="w-6 h-6 rounded-full object-cover border border-white/10"
                    />
                    <span className="font-semibold text-white">{c.authorName}</span>
                    <span className="text-[10px] text-zinc-500">{c.timeAgo}</span>
                  </div>

                  {c.isSpoiler && (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Spoiler
                    </span>
                  )}
                </div>

                {/* Comment Body with Spoiler Mask */}
                {c.isSpoiler && !isRevealed ? (
                  <button
                    onClick={() => handleToggleSpoiler(c.id)}
                    className="w-full p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-left flex items-center justify-between hover:bg-amber-500/15 transition-colors group"
                  >
                    <span className="flex items-center gap-1.5 font-medium">
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      ⚠️ Contains Spoiler — Tap to reveal
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono">REVEAL</span>
                  </button>
                ) : (
                  <div className="relative">
                    <p className="text-zinc-200 leading-relaxed">{c.text}</p>
                    {c.isSpoiler && isRevealed && (
                      <button
                        onClick={() => handleToggleSpoiler(c.id)}
                        className="mt-1 text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1"
                      >
                        <EyeOff className="w-3 h-3" /> Hide spoiler
                      </button>
                    )}
                  </div>
                )}

                {/* Like / Reply row */}
                <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-400">
                  <button
                    onClick={() => handleToggleLike(c.id)}
                    className={cn(
                      "flex items-center gap-1 transition-colors",
                      c.hasLiked ? "text-rose-400 font-semibold" : "hover:text-white"
                    )}
                  >
                    <Heart className={cn("w-3.5 h-3.5", c.hasLiked && "fill-current")} />
                    <span>{c.likesCount}</span>
                  </button>
                  <button className="hover:text-white transition-colors flex items-center gap-1">
                    <CornerDownRight className="w-3 h-3" /> Reply
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comment input footer */}
        <form onSubmit={handlePostComment} className="p-4 border-t border-white/10 space-y-2 bg-zinc-950">
          <div className="flex items-center justify-between text-[11px]">
            <label className="flex items-center gap-1.5 text-zinc-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isSpoilerTag}
                onChange={(e) => setIsSpoilerTag(e.target.checked)}
                className="rounded bg-zinc-900 border-white/20 text-amber-500 focus:ring-amber-500 w-3.5 h-3.5"
              />
              <span className={cn(isSpoilerTag && "text-amber-400 font-bold")}>
                ⚠️ Mark as spoiler
              </span>
            </label>
            <span className="text-zinc-500">Free speech & civil discussion</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder={`Discuss Chapter ${chapterNumber}...`}
              className="flex-1 bg-zinc-900 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500"
            />
            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className="p-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white rounded-2xl transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

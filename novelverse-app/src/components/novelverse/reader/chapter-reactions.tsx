"use client";

import * as React from "react";
import {
  type ChapterReactionCounts,
  getChapterReactions,
  getUserReaction,
  toggleChapterReaction,
} from "@/lib/reader-storage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ChapterReactionsProps {
  novelSlug: string;
  chapterNumber: number;
  className?: string;
}

const REACTIONS: Array<{
  id: keyof ChapterReactionCounts;
  emoji: string;
  label: string;
  activeColor: string;
}> = [
  { id: "love", emoji: "❤️", label: "Love", activeColor: "border-rose-500 bg-rose-500/10 text-rose-300" },
  { id: "fire", emoji: "🔥", label: "Epic", activeColor: "border-amber-500 bg-amber-500/10 text-amber-300" },
  { id: "tears", emoji: "😭", label: "Tears", activeColor: "border-blue-500 bg-blue-500/10 text-blue-300" },
  { id: "shock", emoji: "😱", label: "Shock", activeColor: "border-purple-500 bg-purple-500/10 text-purple-300" },
  { id: "laugh", emoji: "😂", label: "Funny", activeColor: "border-yellow-500 bg-yellow-500/10 text-yellow-300" },
  { id: "mindblown", emoji: "🤯", label: "Mindblown", activeColor: "border-emerald-500 bg-emerald-500/10 text-emerald-300" },
];

export function ChapterReactions({
  novelSlug,
  chapterNumber,
  className,
}: ChapterReactionsProps) {
  const [counts, setCounts] = React.useState<ChapterReactionCounts>({
    love: 0,
    fire: 0,
    tears: 0,
    shock: 0,
    laugh: 0,
    mindblown: 0,
  });
  const [userReaction, setUserReaction] = React.useState<keyof ChapterReactionCounts | null>(null);
  const [animatingId, setAnimatingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setCounts(getChapterReactions(novelSlug, chapterNumber));
    setUserReaction(getUserReaction(novelSlug, chapterNumber));
  }, [novelSlug, chapterNumber]);

  const handleReact = (reactionId: keyof ChapterReactionCounts) => {
    setAnimatingId(reactionId);
    setTimeout(() => setAnimatingId(null), 400);

    const { updatedCounts, userReaction: newUserReaction } = toggleChapterReaction(
      novelSlug,
      chapterNumber,
      reactionId
    );
    setCounts({ ...updatedCounts });
    setUserReaction(newUserReaction);

    if (newUserReaction === reactionId) {
      toast.success(`You reacted ${REACTIONS.find((r) => r.id === reactionId)?.emoji} to this chapter!`);
    }
  };

  const formatCount = (n: number) => {
    if (n >= 1000) return (n / 1000).toFixed(1) + "k";
    return n.toString();
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          How did this chapter make you feel? (Module 16)
        </span>
        <span className="text-[11px] text-zinc-500">Tap to react</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {REACTIONS.map((r) => {
          const isSelected = userReaction === r.id;
          const count = counts[r.id] || 0;
          const isBouncing = animatingId === r.id;

          return (
            <button
              key={r.id}
              onClick={() => handleReact(r.id)}
              className={cn(
                "p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 hover:scale-105 active:scale-95 group",
                isSelected
                  ? r.activeColor
                  : "bg-zinc-900/60 border-white/5 text-zinc-300 hover:border-white/20 hover:bg-zinc-900"
              )}
            >
              <span
                className={cn(
                  "text-2xl transition-transform",
                  isBouncing && "scale-125 animate-bounce"
                )}
              >
                {r.emoji}
              </span>
              <span className="text-[11px] font-bold font-mono">
                {formatCount(count)}
              </span>
              <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300">
                {r.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

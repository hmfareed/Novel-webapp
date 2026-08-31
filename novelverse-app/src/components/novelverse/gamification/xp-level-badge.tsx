"use client";

import * as React from "react";
import {
  Sparkles,
  Trophy,
  Zap,
  Award,
  ChevronRight,
} from "lucide-react";
import {
  type LevelInfo,
  calculateLevelInfo,
} from "@/lib/user-stats";
import { cn } from "@/lib/utils";

interface XpLevelBadgeProps {
  totalXp?: number;
  className?: string;
  compact?: boolean;
}

export function XpLevelBadge({
  totalXp = 480,
  className,
  compact = false,
}: XpLevelBadgeProps) {
  const levelInfo: LevelInfo = React.useMemo(() => {
    return calculateLevelInfo(totalXp);
  }, [totalXp]);

  if (compact) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-950/80 to-indigo-950/80 border border-violet-500/30 text-xs font-bold text-white shadow-md",
          className
        )}
      >
        <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center text-[10px] text-white font-black">
          {levelInfo.level}
        </div>
        <span className="text-violet-300 font-semibold">{levelInfo.title}</span>
        <span className="text-[10px] text-zinc-400 font-mono">
          {totalXp} XP
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "p-6 rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-900/90 to-zinc-950 border border-violet-500/20 shadow-xl space-y-4 text-white relative overflow-hidden",
        className
      )}
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/30 font-black text-lg">
            {levelInfo.level}
          </div>
          <div>
            <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest bg-violet-950/80 px-2 py-0.5 rounded-full border border-violet-500/30">
              Level {levelInfo.level}
            </span>
            <h3 className="text-xl font-black text-white mt-0.5">
              {levelInfo.title}
            </h3>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-zinc-400">Total Score</span>
          <p className="text-sm font-black font-mono text-violet-400">
            {totalXp.toLocaleString()} XP
          </p>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="space-y-2 relative z-10">
        <div className="flex justify-between text-xs text-zinc-400 font-medium">
          <span>Next Rank: <strong className="text-white">{levelInfo.nextTitle}</strong></span>
          <span className="font-mono text-violet-400">{levelInfo.progressPercent}%</span>
        </div>

        <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-violet-500 to-indigo-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${levelInfo.progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
          <span>{levelInfo.xpForCurrentLevel} XP</span>
          <span>{levelInfo.xpForNextLevel} XP (Level {levelInfo.level + 1})</span>
        </div>
      </div>
    </div>
  );
}

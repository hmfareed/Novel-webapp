"use client";

import * as React from "react";
import {
  Trophy,
  Flame,
  BookOpen,
  Clock,
  Bookmark,
  Users,
  Award,
  Sparkles,
  Lock,
  CheckCircle2,
} from "lucide-react";
import {
  type DynamicBadge,
  evaluateBadges,
} from "@/lib/user-stats";
import { cn } from "@/lib/utils";

interface AchievementsGridProps {
  badges?: DynamicBadge[];
  className?: string;
}

const BADGE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Flame,
  BookOpen,
  Clock,
  Bookmark,
  Users,
  Award,
  Trophy,
  Sparkles,
};

export function AchievementsGrid({ badges, className }: AchievementsGridProps) {
  const [activeCategory, setActiveCategory] = React.useState<
    "all" | "reading" | "exploration" | "social" | "dedication" | "rare"
  >("all");

  const displayBadges = React.useMemo(() => {
    if (badges && badges.length > 0) return badges;
    return evaluateBadges({
      currentStreak: 18,
      longestStreak: 24,
      totalReadingTimeSeconds: 15400,
      chaptersReadCount: 38,
      novelsReadCount: 6,
      libraryCount: 14,
      readingActivity: [],
    });
  }, [badges]);

  const filteredBadges = React.useMemo(() => {
    if (activeCategory === "all") return displayBadges;
    return displayBadges.filter((b) => b.category === activeCategory);
  }, [displayBadges, activeCategory]);

  const unlockedCount = displayBadges.filter((b) => b.unlocked).length;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" /> Module 33 — Gamification
          </span>
          <h3 className="text-lg font-black text-white mt-0.5">
            Badges & Milestones ({unlockedCount}/{displayBadges.length} Unlocked)
          </h3>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1 overflow-x-auto bg-zinc-900/60 p-1 rounded-2xl border border-white/5">
          {[
            { id: "all", label: "All" },
            { id: "reading", label: "Reading" },
            { id: "exploration", label: "Explore" },
            { id: "social", label: "Social" },
            { id: "dedication", label: "Streaks" },
            { id: "rare", label: "Rare" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as typeof activeCategory)}
              className={cn(
                "px-3 py-1 text-xs font-semibold rounded-xl transition-all whitespace-nowrap",
                activeCategory === cat.id
                  ? "bg-violet-600 text-white"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredBadges.map((badge) => {
          const Icon = BADGE_ICONS[badge.iconName] || Trophy;

          return (
            <div
              key={badge.id}
              className={cn(
                "p-4 rounded-3xl border transition-all flex items-start gap-3.5",
                badge.unlocked
                  ? "bg-zinc-900/80 border-white/10 hover:border-violet-500/40"
                  : "bg-zinc-950/40 border-white/5 opacity-60 hover:opacity-80"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md",
                  badge.unlocked
                    ? `bg-gradient-to-br ${badge.color} text-white`
                    : "bg-zinc-800 text-zinc-500"
                )}
              >
                {badge.unlocked ? (
                  <Icon className="w-6 h-6" />
                ) : (
                  <Lock className="w-5 h-5 text-zinc-500" />
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white truncate">
                    {badge.title}
                  </h4>
                  {badge.unlocked && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                </div>

                <p className="text-[11px] text-zinc-400 leading-snug line-clamp-2">
                  {badge.description}
                </p>

                {/* Progress bar */}
                <div className="pt-1.5 space-y-1">
                  <div className="w-full bg-zinc-800 rounded-full h-1 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        badge.unlocked ? "bg-emerald-400" : "bg-violet-600"
                      )}
                      style={{ width: `${badge.progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                    <span>{badge.progress}</span>
                    <span>{badge.progressPercent}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

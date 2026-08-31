"use client";

import * as React from "react";
import {
  Flame,
  Shield,
  Calendar,
  Check,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  type CalculatedStreak,
  type WeekDayStatus,
  calculateStreak,
  getWeekCalendar,
} from "@/lib/user-stats";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface StreakTrackerCardProps {
  streak?: CalculatedStreak;
  weekCalendar?: WeekDayStatus[];
  className?: string;
}

export function StreakTrackerCard({
  streak,
  weekCalendar,
  className,
}: StreakTrackerCardProps) {
  const [activeStreak, setActiveStreak] = React.useState<CalculatedStreak>(
    streak || {
      currentStreak: 18,
      longestStreak: 24,
      readToday: true,
      readYesterday: true,
      lastActiveDate: new Date().toISOString().split("T")[0],
      hasStreakShield: true,
      streakType: "daily",
    }
  );

  const [calendar, setCalendar] = React.useState<WeekDayStatus[]>(
    weekCalendar || getWeekCalendar([])
  );

  const handleUseShield = () => {
    toast.success("Streak Recovery Shield is active! Your streak is protected if you miss a day.");
  };

  return (
    <div
      className={cn(
        "p-6 rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-900/90 to-zinc-950 border border-amber-500/20 shadow-xl space-y-5 text-white relative overflow-hidden",
        className
      )}
    >
      {/* Background Amber Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Row */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/30">
            <Flame className="w-6 h-6 text-white animate-pulse fill-current" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/30">
              Streaks 2.0 (Module 32)
            </span>
            <h3 className="text-xl font-black text-white mt-0.5">
              {activeStreak.currentStreak} Day Reading Streak
            </h3>
          </div>
        </div>

        <button
          onClick={handleUseShield}
          className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-colors flex items-center gap-1 text-xs font-semibold"
          title="Streak Recovery Shield Active"
        >
          <Shield className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">Protected</span>
        </button>
      </div>

      <p className="text-xs text-zinc-300 leading-relaxed relative z-10">
        {activeStreak.readToday
          ? "🎉 You kept your streak alive today! Read 1 chapter tomorrow to reach day " + (activeStreak.currentStreak + 1) + "."
          : "⚠️ Read for at least 3 minutes today to keep your " + activeStreak.currentStreak + "-day streak burning!"}
      </p>

      {/* 7-Day Week Heatmap Calendar */}
      <div className="space-y-2 relative z-10">
        <div className="flex items-center justify-between text-[11px] text-zinc-400">
          <span>Weekly Habit Calendar</span>
          <span className="text-amber-400 font-mono font-bold">
            Best: {activeStreak.longestStreak} days
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 bg-black/40 p-2.5 rounded-2xl border border-white/5">
          {calendar.map((day, idx) => {
            return (
              <div
                key={idx}
                className={cn(
                  "p-2 rounded-xl text-center space-y-1 transition-all flex flex-col items-center justify-between",
                  day.completed
                    ? "bg-amber-500/20 border border-amber-500/40 text-amber-200"
                    : day.isToday
                    ? "bg-violet-950/60 border border-violet-500/40 text-violet-300 ring-1 ring-violet-500/40"
                    : "bg-zinc-900/40 border border-white/5 text-zinc-500"
                )}
              >
                <span className="text-[10px] font-bold uppercase">{day.dayName}</span>
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
                    day.completed
                      ? "bg-amber-500 text-black font-black"
                      : day.isToday
                      ? "bg-violet-600 text-white"
                      : "bg-zinc-800 text-zinc-500"
                  )}
                >
                  {day.completed ? <Check className="w-3 h-3 stroke-[3]" /> : day.dayNumber}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

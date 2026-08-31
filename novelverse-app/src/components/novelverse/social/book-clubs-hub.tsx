"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Trophy,
  BookOpen,
  MessageSquare,
  Sparkles,
  CheckCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type BookClub,
  getBookClubs,
  toggleClubJoin,
} from "@/lib/social-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BookClubsHubProps {
  className?: string;
}

export function BookClubsHub({ className }: BookClubsHubProps) {
  const [clubs, setClubs] = React.useState<BookClub[]>([]);

  React.useEffect(() => {
    setClubs(getBookClubs());
  }, []);

  const handleToggleJoin = (club: BookClub) => {
    const isNowJoined = toggleClubJoin(club.id);
    setClubs([...getBookClubs()]);
    toast.success(
      isNowJoined
        ? `You joined "${club.name}"! Welcome to the circle.`
        : `Left "${club.name}".`
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
            Modules 29 & 30 — Communities
          </span>
          <h3 className="text-lg font-black text-white">
            Book Clubs & Group Reading Challenges
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {clubs.map((club) => {
          const challengePercent = Math.min(
            100,
            Math.round((club.challenge.completed / club.challenge.target) * 100)
          );

          return (
            <div
              key={club.id}
              className="p-5 rounded-3xl bg-zinc-900/60 border border-white/5 hover:border-violet-500/30 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 bg-violet-950/80 px-2.5 py-0.5 rounded-full border border-violet-500/20">
                      {club.tag}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1 group-hover:text-violet-300 transition-colors">
                      {club.name}
                    </h4>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1 shrink-0">
                    <Users className="w-3 h-3 text-zinc-500" />
                    {club.memberCount.toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                  {club.description}
                </p>

                {/* Current Group Read */}
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-3">
                  <img
                    src={club.currentRead.coverUrl}
                    alt={club.currentRead.title}
                    className="w-10 h-14 object-cover rounded-lg border border-white/10 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                      Current Group Read
                    </span>
                    <p className="text-xs font-bold text-white truncate">
                      {club.currentRead.title}
                    </p>
                    <p className="text-[11px] text-violet-400 font-semibold">
                      Chapter {club.currentRead.currentChapter} of {club.currentRead.totalChapters}
                    </p>
                  </div>
                </div>

                {/* Group Reading Challenge Progress Bar (Module 30) */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-amber-300 flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-400" />
                      {club.challenge.title}
                    </span>
                    <span className="text-zinc-400 font-mono text-[10px]">
                      {club.challenge.daysLeft}d left
                    </span>
                  </div>

                  <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full transition-all"
                      style={{ width: `${challengePercent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                    <span>{club.challenge.completed} / {club.challenge.target} novels completed</span>
                    <span className="font-bold text-amber-400">{challengePercent}%</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                  {club.recentDiscussionsCount} discussions
                </span>

                <Button
                  size="sm"
                  variant={club.isJoined ? "outline" : "default"}
                  onClick={() => handleToggleJoin(club)}
                  className={cn(
                    "rounded-xl text-xs font-bold transition-all",
                    club.isJoined
                      ? "border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/40"
                      : "bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-600/30"
                  )}
                >
                  {club.isJoined ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Joined
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 mr-1" /> Join Club
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import {
  UserPlus,
  Check,
  Sparkles,
  Flame,
  BookOpen,
} from "lucide-react";
import {
  type FriendUser,
  getFriends,
  sendFriendRequest,
} from "@/lib/social-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FriendRecommendationsProps {
  className?: string;
}

export function FriendRecommendations({ className }: FriendRecommendationsProps) {
  const [people, setPeople] = React.useState<FriendUser[]>([]);

  React.useEffect(() => {
    const candidates = getFriends().filter((f) => f.friendshipStatus !== "friends");
    setPeople(candidates);
  }, []);

  const handleAddFriend = (id: string, name: string) => {
    sendFriendRequest(id);
    setPeople((prev) =>
      prev.map((p) => (p.id === id ? { ...p, friendshipStatus: "pending_sent" } : p))
    );
    toast.success(`Friend request sent to ${name}! (Module 20)`);
  };

  if (people.length === 0) return null;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Readers You May Know (Module 23)
        </span>
        <span className="text-[11px] text-zinc-500">Based on genres</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {people.map((person) => {
          const isPending = person.friendshipStatus === "pending_sent";

          return (
            <div
              key={person.id}
              className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 hover:border-violet-500/30 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={person.avatar}
                  alt={person.name}
                  className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    {person.name}
                  </p>
                  <p className="text-[10px] text-zinc-400 truncate">
                    @{person.username} • {person.genres.slice(0, 2).join(", ")}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[10px]">
                    <span className="text-amber-400 flex items-center gap-0.5">
                      <Flame className="w-3 h-3" /> {person.streakDays}d streak
                    </span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-violet-400">
                      {person.novelsRead} novels
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleAddFriend(person.id, person.name)}
                disabled={isPending}
                className={cn(
                  "p-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1",
                  isPending
                    ? "bg-zinc-800 text-zinc-400 border border-white/5 cursor-default"
                    : "bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-600/30"
                )}
              >
                {isPending ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">Sent</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Add</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

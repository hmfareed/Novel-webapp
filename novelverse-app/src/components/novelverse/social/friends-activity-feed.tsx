"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  BookOpen,
  Heart,
  Bookmark,
  CheckCircle,
  Flame,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  userName: string;
  userAvatar: string;
  actionType: "finished" | "started" | "added_library" | "liked" | "joined_room";
  novelTitle: string;
  novelSlug: string;
  chapterNumber?: number;
  timeAgo: string;
  badgeEmoji: string;
}

const SEED_ACTIVITIES: ActivityItem[] = [
  {
    id: "act_1",
    userName: "Ama Mensah",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    actionType: "finished",
    novelTitle: "Sundiata: Lion of Mali",
    novelSlug: "sundiata-lion-of-mali",
    timeAgo: "2h ago",
    badgeEmoji: "🎉",
  },
  {
    id: "act_2",
    userName: "Kojo Asante",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    actionType: "added_library",
    novelTitle: "The Time Machine",
    novelSlug: "the-time-machine",
    timeAgo: "4h ago",
    badgeEmoji: "📚",
  },
  {
    id: "act_3",
    userName: "Sarah Mensah",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    actionType: "liked",
    novelTitle: "Dracula",
    novelSlug: "dracula",
    chapterNumber: 4,
    timeAgo: "6h ago",
    badgeEmoji: "🔥",
  },
  {
    id: "act_4",
    userName: "Kwame Osei",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    actionType: "started",
    novelTitle: "The Adventures of Sherlock Holmes",
    novelSlug: "the-adventures-of-sherlock-holmes",
    timeAgo: "8h ago",
    badgeEmoji: "📖",
  },
];

interface FriendsActivityFeedProps {
  className?: string;
  maxItems?: number;
}

export function FriendsActivityFeed({ className, maxItems = 4 }: FriendsActivityFeedProps) {
  const [activities] = React.useState<ActivityItem[]>(SEED_ACTIVITIES.slice(0, maxItems));

  const getActionText = (item: ActivityItem) => {
    switch (item.actionType) {
      case "finished":
        return "completed";
      case "added_library":
        return "added to their library";
      case "liked":
        return `reacted ${item.badgeEmoji} to Chapter ${item.chapterNumber} of`;
      case "started":
        return "started reading";
      case "joined_room":
        return "joined a Reading Room for";
      default:
        return "interacted with";
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-violet-400" />
          Friends Activity (Module 21)
        </span>
        <Link
          href="/community"
          className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-0.5"
        >
          View All <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-2">
        {activities.map((act) => (
          <div
            key={act.id}
            className="p-3 rounded-2xl bg-zinc-900/60 border border-white/5 hover:border-white/15 transition-all flex items-center justify-between text-xs gap-3 group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={act.userAvatar}
                alt={act.userName}
                className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-zinc-300 leading-snug">
                  <strong className="text-white font-semibold">{act.userName}</strong>{" "}
                  {getActionText(act)}{" "}
                  <Link
                    href={`/novels/${act.novelSlug}`}
                    className="text-violet-300 font-bold hover:underline"
                  >
                    &quot;{act.novelTitle}&quot;
                  </Link>
                </p>
                <span className="text-[10px] text-zinc-500 mt-0.5 block">{act.timeAgo}</span>
              </div>
            </div>

            <Link
              href={`/novels/${act.novelSlug}`}
              className="p-1.5 rounded-xl bg-white/5 group-hover:bg-violet-600/20 text-zinc-400 group-hover:text-violet-300 transition-colors shrink-0"
            >
              <BookOpen className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

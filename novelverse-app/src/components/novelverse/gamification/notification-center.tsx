"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  Users,
  BookOpen,
  MessageSquare,
  Sparkles,
  Check,
  CheckCheck,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  type NotificationItem,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/social-store";
import { cn } from "@/lib/utils";

export function NotificationCenter() {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [filter, setFilter] = React.useState<"all" | "social" | "reading" | "discussion" | "group">("all");

  React.useEffect(() => {
    setNotifications(getNotifications());
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filtered = notifications.filter((n) => (filter === "all" ? true : n.type === filter));

  const handleMarkRead = (id: string) => {
    markNotificationAsRead(id);
    setNotifications(getNotifications());
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
    setNotifications(getNotifications());
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "social":
        return <Users className="w-3.5 h-3.5 text-pink-400" />;
      case "reading":
        return <BookOpen className="w-3.5 h-3.5 text-violet-400" />;
      case "discussion":
        return <MessageSquare className="w-3.5 h-3.5 text-blue-400" />;
      case "group":
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative p-2 rounded-xl bg-zinc-900/80 border border-white/10 text-zinc-300 hover:text-white hover:border-white/20 transition-colors"
          aria-label="Open notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-600 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-zinc-950 animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 sm:w-96 bg-zinc-950/95 border-white/10 text-white backdrop-blur-2xl p-0 rounded-3xl shadow-2xl"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold bg-violet-950 text-violet-300 px-2 py-0.5 rounded-full border border-violet-500/30">
                {unreadCount} new
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-[11px] text-violet-400 hover:text-violet-300 flex items-center gap-1 font-semibold"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="p-2 border-b border-white/5 flex items-center gap-1 overflow-x-auto bg-zinc-900/30">
          {(["all", "social", "reading", "discussion", "group"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-2.5 py-1 text-[11px] font-semibold rounded-lg capitalize transition-all",
                filter === cat
                  ? "bg-violet-600 text-white"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
          {filtered.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-8">
              No notifications in this category.
            </p>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleMarkRead(item.id)}
                className={cn(
                  "p-3.5 flex items-start gap-3 transition-colors hover:bg-white/5 cursor-pointer text-xs",
                  !item.isRead && "bg-violet-950/20"
                )}
              >
                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  {item.avatar ? (
                    <img
                      src={item.avatar}
                      alt=""
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getIcon(item.type)
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-white truncate text-xs">{item.title}</p>
                    <span className="text-[10px] text-zinc-500 shrink-0 font-mono">{item.time}</span>
                  </div>
                  <p className="text-zinc-400 leading-snug text-[11px] line-clamp-2">
                    {item.message}
                  </p>
                  {item.link && (
                    <Link
                      href={item.link}
                      className="inline-flex items-center gap-1 text-[10px] text-violet-400 font-bold hover:underline mt-1"
                    >
                      View details <ChevronRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>

                {!item.isRead && (
                  <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0 mt-2" />
                )}
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

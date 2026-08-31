"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/novelverse/navbar";
import { Footer } from "@/components/novelverse/footer";
import { ReadingRoomModal } from "@/components/novelverse/social/reading-room-modal";
import { DirectMessagesDrawer } from "@/components/novelverse/social/direct-messages-drawer";
import { FriendsActivityFeed } from "@/components/novelverse/social/friends-activity-feed";
import { FriendRecommendations } from "@/components/novelverse/social/friend-recommendations";
import { BookClubsHub } from "@/components/novelverse/social/book-clubs-hub";
import { Button } from "@/components/ui/button";
import {
  Users,
  Radio,
  Sparkles,
  MessageSquare,
  Trophy,
  Flame,
  Plus,
  BookOpen,
} from "lucide-react";
import { getReadingRooms, type ReadingRoom } from "@/lib/social-store";

export default function CommunityPage() {
  const [roomModalOpen, setRoomModalOpen] = React.useState(false);
  const [selectedRoomId, setSelectedRoomId] = React.useState<string | undefined>();
  const [dmDrawerOpen, setDmDrawerOpen] = React.useState(false);
  const [liveRooms, setLiveRooms] = React.useState<ReadingRoom[]>([]);

  React.useEffect(() => {
    setLiveRooms(getReadingRooms());
  }, []);

  const handleOpenRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    setRoomModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-violet-600/30 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-1 pb-24">
        {/* Hero Banner */}
        <section className="relative overflow-hidden pt-10 pb-12 border-b border-white/5 bg-gradient-to-b from-zinc-950 via-zinc-950/80 to-black">
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/80 border border-violet-500/20 text-xs font-bold text-violet-300">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  Social Reading Ecosystem
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                  NovelVerse Community
                </h1>
                <p className="text-sm text-zinc-400 max-w-xl">
                  Co-read chapters live in Reading Rooms, join community book clubs, share quote cards, and connect with fellow readers around the world.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setDmDrawerOpen(true)}
                  variant="outline"
                  className="rounded-2xl border-white/10 bg-zinc-900/60 hover:bg-zinc-800 text-xs font-bold py-5"
                >
                  <MessageSquare className="w-4 h-4 mr-2 text-violet-400" />
                  Direct Messages
                </Button>

                <Button
                  onClick={() => {
                    setSelectedRoomId(undefined);
                    setRoomModalOpen(true);
                  }}
                  className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-xs font-bold py-5 shadow-lg shadow-violet-600/30"
                >
                  <Radio className="w-4 h-4 mr-2 text-rose-400 animate-pulse" />
                  Create Reading Room
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
          {/* Section 1: Live Reading Rooms Showcase */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> Live Now
                </span>
                <h2 className="text-xl font-black text-white">Active Reading Rooms</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveRooms.map((room) => (
                <div
                  key={room.id}
                  className="p-5 rounded-3xl bg-zinc-900/60 border border-white/5 hover:border-violet-500/30 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={room.novelCoverUrl}
                      alt={room.novelTitle}
                      className="w-14 h-20 object-cover rounded-xl border border-white/10 shadow-md"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">
                        Room {room.code}
                      </span>
                      <h3 className="text-sm font-bold text-white truncate">
                        {room.novelTitle}
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Chapter {room.chapterNumber}: {room.chapterTitle}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold mt-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>{room.members.length} co-readers active</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex -space-x-2 overflow-hidden">
                      {room.members.map((m) => (
                        <img
                          key={m.id}
                          src={m.avatar}
                          alt={m.name}
                          className="inline-block h-6 w-6 rounded-full ring-2 ring-zinc-950 object-cover"
                        />
                      ))}
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleOpenRoom(room.id)}
                      className="rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold"
                    >
                      Join Room
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Book Clubs & Challenges */}
          <BookClubsHub />

          {/* Section 3: Two-Column Social (Friends Feed + Recommendations) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FriendsActivityFeed />
            <FriendRecommendations />
          </div>
        </div>
      </main>

      <Footer />

      {/* Reading Room Modal */}
      <ReadingRoomModal
        open={roomModalOpen}
        onOpenChange={setRoomModalOpen}
        initialRoomId={selectedRoomId}
      />

      {/* Direct Messages Drawer */}
      <DirectMessagesDrawer
        isOpen={dmDrawerOpen}
        onClose={() => setDmDrawerOpen(false)}
      />
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Users,
  Radio,
  Sparkles,
  Share2,
  Copy,
  Check,
  Send,
  BookOpen,
  MessageSquare,
  Flame,
  Heart,
  Plus,
} from "lucide-react";
import {
  type ReadingRoom,
  getReadingRooms,
  createReadingRoom,
  sendRoomMessage,
} from "@/lib/social-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ReadingRoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialRoomId?: string;
  defaultNovelSlug?: string;
  defaultNovelTitle?: string;
}

export function ReadingRoomModal({
  open,
  onOpenChange,
  initialRoomId,
  defaultNovelSlug,
  defaultNovelTitle,
}: ReadingRoomModalProps) {
  const [rooms, setRooms] = React.useState<ReadingRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = React.useState<string | null>(null);
  const [isCreating, setIsCreating] = React.useState(false);
  const [newRoomTitle, setNewRoomTitle] = React.useState("");
  const [newRoomChapter, setNewRoomChapter] = React.useState(1);
  const [chatInput, setChatInput] = React.useState("");
  const [copiedCode, setCopiedCode] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      const all = getReadingRooms();
      setRooms(all);
      if (initialRoomId) {
        setActiveRoomId(initialRoomId);
      } else if (all.length > 0 && !activeRoomId) {
        setActiveRoomId(all[0].id);
      }
    }
  }, [open, initialRoomId, activeRoomId]);

  const activeRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const created = createReadingRoom({
      novelSlug: defaultNovelSlug || "sundiata-lion-of-mali",
      novelTitle: defaultNovelTitle || "Sundiata: Lion of Mali",
      novelCoverUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=800&auto=format&fit=crop",
      chapterNumber: newRoomChapter,
      chapterTitle: `Chapter ${newRoomChapter}`,
      host: {
        id: "user_you",
        name: "You (Host)",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      members: [
        {
          id: "user_you",
          name: "You (Host)",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          isHost: true,
          scrollProgress: 10,
          currentReaction: "🔥",
          isOnline: true,
        },
      ],
      isLive: true,
    });

    setRooms(getReadingRooms());
    setActiveRoomId(created.id);
    setIsCreating(false);
    toast.success(`Reading Room #${created.code} created! Invite friends to read together.`);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeRoom) return;

    sendRoomMessage(activeRoom.id, {
      userId: "user_you",
      userName: "You",
      userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      text: chatInput.trim(),
      type: "chat",
    });

    setRooms(getReadingRooms());
    setChatInput("");
  };

  const handleCopyCode = () => {
    if (activeRoom && typeof window !== "undefined") {
      navigator.clipboard.writeText(
        `Join my live NovelVerse Reading Room for "${activeRoom.novelTitle}" (Chapter ${activeRoom.chapterNumber})! Room Code: ${activeRoom.code}\n${window.location.origin}/read/${activeRoom.novelSlug}/${activeRoom.chapterNumber}`
      );
      setCopiedCode(true);
      toast.success("Room invite & code copied to clipboard!");
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-zinc-950/95 border-violet-500/30 text-white backdrop-blur-2xl p-6 sm:p-8">
        <DialogHeader className="pb-4 border-b border-white/10 flex flex-row items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> Live Co-Reading (Modules 27 & 28)
            </span>
            <DialogTitle className="text-xl font-black text-white mt-1">
              NovelVerse Reading Rooms
            </DialogTitle>
          </div>

          <Button
            size="sm"
            onClick={() => setIsCreating(!isCreating)}
            className="rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold shadow-md shadow-violet-600/30"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            {isCreating ? "View Rooms" : "Create Room"}
          </Button>
        </DialogHeader>

        {isCreating ? (
          /* Create Room Form */
          <form onSubmit={handleCreateRoom} className="space-y-4 pt-4">
            <div className="bg-violet-950/40 border border-violet-500/20 rounded-2xl p-4 text-xs text-zinc-300 space-y-1">
              <p className="font-bold text-violet-300">Synchronized Reading Experience:</p>
              <p className="text-zinc-400">
                You and your friends will read the same chapter, share live emoji reactions, and discuss the story in real time.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Novel
              </label>
              <input
                type="text"
                disabled
                value={defaultNovelTitle || "Sundiata: Lion of Mali"}
                className="w-full bg-zinc-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white opacity-80"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Starting Chapter
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={newRoomChapter}
                onChange={(e) => setNewRoomChapter(parseInt(e.target.value, 10) || 1)}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreating(false)}
                className="rounded-xl border-white/10 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold"
              >
                Launch Reading Room 🚀
              </Button>
            </div>
          </form>
        ) : activeRoom ? (
          /* Active Room View */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {/* Left: Room Status & Members */}
            <div className="md:col-span-1 space-y-4 border-r border-white/5 pr-0 md:pr-4">
              {/* Novel Card Box */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-2.5">
                <div className="flex items-center gap-3">
                  <img
                    src={activeRoom.novelCoverUrl}
                    alt={activeRoom.novelTitle}
                    className="w-12 h-16 object-cover rounded-xl border border-white/10"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {activeRoom.novelTitle}
                    </p>
                    <p className="text-[11px] text-violet-400 font-semibold">
                      Chapter {activeRoom.chapterNumber}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>Live Session</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-400">
                    Code: <strong className="text-white">{activeRoom.code}</strong>
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="text-[11px] text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Invite</span>
                  </button>
                </div>
              </div>

              {/* Members List */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-violet-400" />
                  Readers in Room ({activeRoom.members.length})
                </span>

                <div className="space-y-1.5">
                  {activeRoom.members.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-xl bg-zinc-900/40 border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={m.avatar}
                          alt={m.name}
                          className="w-6 h-6 rounded-full object-cover border border-white/10"
                        />
                        <span className="font-semibold text-white truncate max-w-[90px]">
                          {m.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{m.currentReaction || "🔥"}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {m.scrollProgress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enter Reader Button */}
              <Link
                href={`/read/${activeRoom.novelSlug}/${activeRoom.chapterNumber}`}
                onClick={() => onOpenChange(false)}
                className="block w-full"
              >
                <Button className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 text-xs font-bold shadow-lg shadow-violet-600/30">
                  <BookOpen className="w-4 h-4 mr-2" /> Open Co-Reader
                </Button>
              </Link>
            </div>

            {/* Right: Live Room Chat */}
            <div className="md:col-span-2 flex flex-col h-[380px] bg-zinc-900/50 border border-white/5 rounded-2xl p-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-violet-400" />
                  Room Live Discussion
                </span>
                <span className="text-[10px] text-zinc-500">Live feed</span>
              </div>

              {/* Messages feed */}
              <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1">
                {activeRoom.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "p-2.5 rounded-xl text-xs space-y-1",
                      msg.type === "system"
                        ? "bg-violet-950/40 text-violet-200 border border-violet-500/20 text-center"
                        : "bg-zinc-900/80 border border-white/5"
                    )}
                  >
                    {msg.type !== "system" && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <img
                            src={msg.userAvatar}
                            alt={msg.userName}
                            className="w-4 h-4 rounded-full object-cover"
                          />
                          <span className="font-bold text-violet-300">{msg.userName}</span>
                        </div>
                        <span className="text-[10px] text-zinc-500">{msg.time}</span>
                      </div>
                    )}
                    <p className="text-zinc-200">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="pt-2 border-t border-white/5 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Share a reaction with your co-readers..."
                  className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="p-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white rounded-xl transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <p className="text-xs text-zinc-400 text-center py-12">
            No active reading rooms. Tap &quot;Create Room&quot; to start one!
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import {
  MessageSquare,
  Send,
  X,
  BookOpen,
  Sparkles,
  Radio,
  Paperclip,
  Check,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import {
  type FriendUser,
  type DirectMessage,
  getFriends,
  getDirectMessages,
  sendDirectMessage,
} from "@/lib/social-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DirectMessagesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFriendId?: string;
}

export function DirectMessagesDrawer({
  isOpen,
  onClose,
  selectedFriendId,
}: DirectMessagesDrawerProps) {
  const [friends, setFriends] = React.useState<FriendUser[]>([]);
  const [activeFriendId, setActiveFriendId] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<DirectMessage[]>([]);
  const [inputText, setInputText] = React.useState("");

  React.useEffect(() => {
    if (isOpen) {
      const allFriends = getFriends().filter((f) => f.friendshipStatus === "friends");
      setFriends(allFriends);

      const targetId = selectedFriendId || (allFriends.length > 0 ? allFriends[0].id : null);
      setActiveFriendId(targetId);
      if (targetId) {
        setMessages(getDirectMessages(targetId));
      }
    }
  }, [isOpen, selectedFriendId]);

  const handleSelectFriend = (id: string) => {
    setActiveFriendId(id);
    setMessages(getDirectMessages(id));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeFriendId) return;

    const newMsg = sendDirectMessage({
      friendId: activeFriendId,
      senderId: "user_you",
      senderName: "You",
      text: inputText.trim(),
    });

    setMessages([...messages, newMsg]);
    setInputText("");
  };

  const activeFriend = friends.find((f) => f.id === activeFriendId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-zinc-950/95 border-l border-white/10 h-full flex flex-col z-10 shadow-2xl backdrop-blur-2xl text-white">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" /> Friend Messages (Module 24)
            </span>
            <h3 className="text-sm font-bold text-white truncate mt-0.5">
              {activeFriend ? `Chat with ${activeFriend.name}` : "Direct Messages"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Friend Selector Pills */}
        <div className="p-3 border-b border-white/5 flex items-center gap-2 overflow-x-auto bg-zinc-900/40">
          {friends.map((f) => {
            const isSelected = f.id === activeFriendId;
            return (
              <button
                key={f.id}
                onClick={() => handleSelectFriend(f.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs whitespace-nowrap transition-all",
                  isSelected
                    ? "bg-violet-950/80 border-violet-500 text-violet-200 font-bold"
                    : "bg-zinc-900/60 border-white/5 text-zinc-400 hover:text-white"
                )}
              >
                <div className="relative">
                  <img
                    src={f.avatar}
                    alt={f.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  {f.isOnline && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 ring-2 ring-zinc-950" />
                  )}
                </div>
                <span>{f.name.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeFriend ? (
            messages.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-xs space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto text-zinc-600" />
                <p>No messages yet. Send a message or share a novel with {activeFriend.name}!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === "user_you";
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex flex-col max-w-[85%] space-y-1.5",
                      isMe ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                      <span>{msg.senderName}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={cn(
                        "p-3 rounded-2xl text-xs space-y-2.5",
                        isMe
                          ? "bg-violet-600 text-white rounded-br-none shadow-md shadow-violet-600/20"
                          : "bg-zinc-900 border border-white/10 text-zinc-200 rounded-bl-none"
                      )}
                    >
                      <p className="leading-relaxed">{msg.text}</p>

                      {/* Attachment Embed (Module 24 & 26) */}
                      {msg.attachment && (
                        <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
                          {msg.attachment.type === "quote" ? (
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> Shared Quote
                              </span>
                              <p className="font-serif italic text-zinc-200 text-xs">
                                &quot;{msg.attachment.quoteText}&quot;
                              </p>
                              <p className="text-[10px] text-zinc-400">
                                — {msg.attachment.title} by {msg.attachment.author}
                              </p>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2.5">
                              {msg.attachment.coverUrl && (
                                <img
                                  src={msg.attachment.coverUrl}
                                  alt={msg.attachment.title}
                                  className="w-10 h-14 object-cover rounded-lg border border-white/10"
                                />
                              )}
                              <div className="min-w-0">
                                <span className="text-[10px] font-bold text-violet-300 uppercase tracking-widest">
                                  {msg.attachment.type === "room" ? "Reading Room" : "Chapter Link"}
                                </span>
                                <p className="text-xs font-bold text-white truncate">
                                  {msg.attachment.title}
                                </p>
                                {msg.attachment.subtitle && (
                                  <p className="text-[10px] text-zinc-400 truncate">
                                    {msg.attachment.subtitle}
                                  </p>
                                )}
                                <Link
                                  href={msg.attachment.link}
                                  onClick={onClose}
                                  className="inline-flex items-center gap-1 text-[10px] text-violet-300 font-bold mt-1 hover:underline"
                                >
                                  Open <ExternalLink className="w-2.5 h-2.5" />
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )
          ) : (
            <p className="text-xs text-zinc-400 text-center py-12">
              Select a friend above to start chatting.
            </p>
          )}
        </div>

        {/* Input bar */}
        {activeFriend && (
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-zinc-950 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${activeFriend.name}...`}
              className="flex-1 bg-zinc-900 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white rounded-2xl transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

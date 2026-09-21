"use client";

import * as React from "react";
import {
  MessageSquare,
  Send,
  X,
  Heart,
  AlertCircle,
  Eye,
  EyeOff,
  CornerDownRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface ParagraphComment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  body: string;
  isSpoiler: boolean;
  likeCount: number;
  createdAt: string;
  replies?: Array<{
    id: string;
    authorName: string;
    body: string;
    createdAt: string;
  }>;
}

interface ParagraphCommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  novelSlug: string;
  chapterNumber: number;
  paragraphIndex: number;
  paragraphText: string;
}

export function ParagraphCommentsDrawer({
  isOpen,
  onClose,
  novelSlug,
  chapterNumber,
  paragraphIndex,
  paragraphText,
}: ParagraphCommentsDrawerProps) {
  const [comments, setComments] = React.useState<ParagraphComment[]>([]);
  const [newComment, setNewComment] = React.useState("");
  const [isSpoiler, setIsSpoiler] = React.useState(false);
  const [revealedSpoilers, setRevealedSpoilers] = React.useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Generate or fetch contextual comments for this paragraph
  React.useEffect(() => {
    if (!isOpen) return;

    // Seed mock/saved comments for realistic interaction
    const sampleComments: ParagraphComment[] = [
      {
        id: "pc-1",
        authorName: "Sarah M.",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
        body: "This line gave me chills! The foreshadowing here is completely unreal.",
        isSpoiler: false,
        likeCount: 24,
        createdAt: "2h ago",
        replies: [
          {
            id: "pcr-1",
            authorName: "Mohammed F.",
            body: "Agreed! You only catch it on a second read-through.",
            createdAt: "1h ago",
          },
        ],
      },
      {
        id: "pc-2",
        authorName: "Aiden King",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
        body: "Watch out for who is standing behind the door in chapter 5...",
        isSpoiler: true,
        likeCount: 12,
        createdAt: "4h ago",
      },
    ];

    setComments(sampleComments);
  }, [isOpen, novelSlug, chapterNumber, paragraphIndex]);

  if (!isOpen) return null;

  const toggleSpoiler = (id: string) => {
    setRevealedSpoilers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    const created: ParagraphComment = {
      id: `pc-${Date.now()}`,
      authorName: "You",
      body: newComment.trim(),
      isSpoiler,
      likeCount: 0,
      createdAt: "Just now",
    };

    setTimeout(() => {
      setComments((prev) => [created, ...prev]);
      setNewComment("");
      setIsSpoiler(false);
      setIsSubmitting(false);
      toast.success("Paragraph comment posted!");
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-[#0d1017] border-l border-white/10 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-violet-600/20 text-violet-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Paragraph Discussion</h3>
              <p className="text-[11px] text-zinc-400">
                Chapter {chapterNumber} • Paragraph #{paragraphIndex + 1}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Paragraph Quote */}
        <div className="p-4 bg-violet-950/20 border-b border-white/5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-violet-400 flex items-center gap-1 mb-1.5">
            <Sparkles className="w-3 h-3" /> Quoted Passage
          </span>
          <blockquote className="text-xs italic text-zinc-300 border-l-2 border-violet-500 pl-3 leading-relaxed line-clamp-3">
            &ldquo;{paragraphText}&rdquo;
          </blockquote>
        </div>

        {/* Comments Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs">
              Be the first to leave a comment on this paragraph!
            </div>
          ) : (
            comments.map((c) => {
              const isHidden = c.isSpoiler && !revealedSpoilers[c.id];
              return (
                <div key={c.id} className="p-3 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-violet-600/30 text-violet-300 font-bold flex items-center justify-center text-[10px] border border-white/10">
                        {c.authorName[0]}
                      </div>
                      <span className="font-semibold text-zinc-200">{c.authorName}</span>
                      <span className="text-[10px] text-zinc-500">{c.createdAt}</span>
                    </div>

                    {c.isSpoiler && (
                      <button
                        onClick={() => toggleSpoiler(c.id)}
                        className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30 font-medium"
                      >
                        {isHidden ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                        {isHidden ? "Reveal Spoiler" : "Hide"}
                      </button>
                    )}
                  </div>

                  {isHidden ? (
                    <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-white/5 text-[11px] text-zinc-500 italic flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
                      Contains spoiler. Click reveal to read.
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-300 leading-relaxed pl-8">{c.body}</p>
                  )}

                  <div className="flex items-center gap-4 pl-8 pt-1 text-[11px] text-zinc-400">
                    <button className="flex items-center gap-1 hover:text-rose-400 transition-colors">
                      <Heart className="w-3 h-3" />
                      <span>{c.likeCount}</span>
                    </button>
                  </div>

                  {/* Nested Replies */}
                  {c.replies && c.replies.length > 0 && (
                    <div className="mt-2 pl-6 space-y-2 border-l border-white/5 pt-1">
                      {c.replies.map((r) => (
                        <div key={r.id} className="text-xs space-y-0.5">
                          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                            <CornerDownRight className="w-3 h-3 text-zinc-500" />
                            <span className="font-semibold text-zinc-300">{r.authorName}</span>
                            <span>•</span>
                            <span>{r.createdAt}</span>
                          </div>
                          <p className="pl-4 text-zinc-300 text-[11px]">{r.body}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 bg-zinc-950/90 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isSpoiler}
                onChange={(e) => setIsSpoiler(e.target.checked)}
                className="rounded border-white/20 bg-zinc-900 text-violet-600 focus:ring-0 w-3 h-3"
              />
              <span>Mark as spoiler</span>
            </label>
            <span>Markdown supported</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your thought on this line..."
              className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!newComment.trim() || isSubmitting}
              className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl px-3 h-8"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

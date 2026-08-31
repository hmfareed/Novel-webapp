"use client";

import * as React from "react";
import {
  Highlighter,
  MessageSquarePlus,
  Copy,
  Share2,
  Volume2,
  X,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { addHighlight, addNote } from "@/lib/reader-storage";

interface ReaderTextToolbarProps {
  novelSlug: string;
  chapterNumber: number;
  selectedText: string;
  selectionCoords: { x: number; y: number } | null;
  onClearSelection: () => void;
  onOpenQuoteCard: (text: string) => void;
  onSpeakSelection?: (text: string) => void;
}

export function ReaderTextToolbar({
  novelSlug,
  chapterNumber,
  selectedText,
  selectionCoords,
  onClearSelection,
  onOpenQuoteCard,
  onSpeakSelection,
}: ReaderTextToolbarProps) {
  const [showNoteInput, setShowNoteInput] = React.useState(false);
  const [noteText, setNoteText] = React.useState("");

  if (!selectedText || !selectionCoords) return null;

  const handleHighlight = (color: "yellow" | "emerald" | "violet" | "coral") => {
    addHighlight({
      novelSlug,
      chapterNumber,
      selectedText,
      color,
    });
    toast.success("Highlight saved to your Profile & Highlights!");
    onClearSelection();
  };

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(selectedText);
      toast.success("Text copied to clipboard");
      onClearSelection();
    }
  };

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    addNote({
      novelSlug,
      chapterNumber,
      selectedText,
      noteText: noteText.trim(),
    });
    toast.success("Personal note saved!");
    setNoteText("");
    setShowNoteInput(false);
    onClearSelection();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: Math.max(16, selectionCoords.y - (showNoteInput ? 180 : 54)),
        left: Math.min(window.innerWidth - 320, Math.max(16, selectionCoords.x - 140)),
        zIndex: 50,
      }}
      className="animate-in fade-in zoom-in-95 duration-150"
    >
      {showNoteInput ? (
        <div className="bg-zinc-950/95 border border-violet-500/40 shadow-2xl shadow-violet-950/50 rounded-2xl p-3 w-80 backdrop-blur-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquarePlus className="w-3.5 h-3.5" /> Add Note (Module 11)
            </span>
            <button
              onClick={() => setShowNoteInput(false)}
              className="text-zinc-400 hover:text-white p-0.5 rounded-lg"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-zinc-400 italic line-clamp-1 border-l-2 border-violet-500 pl-2">
            &quot;{selectedText}&quot;
          </p>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="What connects to this passage? Thoughts or theory..."
            autoFocus
            rows={2}
            className="w-full bg-zinc-900 border border-white/10 rounded-xl p-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 resize-none"
          />
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => setShowNoteInput(false)}
              className="px-2.5 py-1 text-xs text-zinc-400 hover:text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNote}
              disabled={!noteText.trim()}
              className="px-3 py-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-xs font-semibold text-white rounded-lg transition-colors"
            >
              Save Note
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-950/95 border border-white/15 shadow-2xl shadow-black/80 rounded-2xl p-1.5 backdrop-blur-xl flex items-center gap-1 text-white">
          {/* Highlight Color Pickers */}
          <div className="flex items-center gap-1 px-1.5 border-r border-white/10">
            <button
              onClick={() => handleHighlight("yellow")}
              className="w-5 h-5 rounded-full bg-amber-400 hover:scale-110 transition-transform shadow-sm"
              title="Highlight Yellow"
            />
            <button
              onClick={() => handleHighlight("emerald")}
              className="w-5 h-5 rounded-full bg-emerald-400 hover:scale-110 transition-transform shadow-sm"
              title="Highlight Emerald"
            />
            <button
              onClick={() => handleHighlight("violet")}
              className="w-5 h-5 rounded-full bg-violet-400 hover:scale-110 transition-transform shadow-sm"
              title="Highlight Violet"
            />
            <button
              onClick={() => handleHighlight("coral")}
              className="w-5 h-5 rounded-full bg-rose-400 hover:scale-110 transition-transform shadow-sm"
              title="Highlight Coral"
            />
          </div>

          {/* Add Note */}
          <button
            onClick={() => setShowNoteInput(true)}
            className="p-2 text-zinc-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors flex items-center gap-1 text-xs font-medium"
            title="Add Note"
          >
            <MessageSquarePlus className="w-4 h-4 text-violet-400" />
            <span className="hidden sm:inline">Note</span>
          </button>

          {/* Share Quote Card */}
          <button
            onClick={() => {
              onOpenQuoteCard(selectedText);
              onClearSelection();
            }}
            className="p-2 text-zinc-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors flex items-center gap-1 text-xs font-medium"
            title="Generate Quote Card"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Quote</span>
          </button>

          {/* Copy Text */}
          <button
            onClick={handleCopy}
            className="p-2 text-zinc-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            title="Copy Text"
          >
            <Copy className="w-4 h-4" />
          </button>

          {/* Speak Selection */}
          {onSpeakSelection && (
            <button
              onClick={() => {
                onSpeakSelection(selectedText);
                onClearSelection();
              }}
              className="p-2 text-zinc-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              title="Listen to Selection"
            >
              <Volume2 className="w-4 h-4 text-blue-400" />
            </button>
          )}

          {/* Dismiss */}
          <button
            onClick={onClearSelection}
            className="p-1.5 text-zinc-500 hover:text-zinc-300 rounded-lg ml-0.5"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Copy,
  Share2,
  Download,
  BookOpen,
  Palette,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface QuoteCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteText: string;
  novelTitle: string;
  authorName: string;
}

const GRADIENT_THEMES = [
  {
    id: "nebula",
    name: "Midnight Nebula",
    bgClass: "bg-gradient-to-br from-indigo-950 via-purple-950 to-zinc-950 border-violet-500/40 text-violet-100",
    accentClass: "text-violet-400",
  },
  {
    id: "amber",
    name: "Sunset Ember",
    bgClass: "bg-gradient-to-br from-amber-950 via-stone-900 to-zinc-950 border-amber-500/40 text-amber-100",
    accentClass: "text-amber-400",
  },
  {
    id: "emerald",
    name: "Emerald Forest",
    bgClass: "bg-gradient-to-br from-emerald-950 via-teal-950 to-zinc-950 border-emerald-500/40 text-emerald-100",
    accentClass: "text-emerald-400",
  },
  {
    id: "rose",
    name: "Rose Velvet",
    bgClass: "bg-gradient-to-br from-rose-950 via-pink-950 to-zinc-950 border-rose-500/40 text-rose-100",
    accentClass: "text-rose-400",
  },
];

export function QuoteCardModal({
  open,
  onOpenChange,
  quoteText,
  novelTitle,
  authorName,
}: QuoteCardModalProps) {
  const [selectedTheme, setSelectedTheme] = React.useState(GRADIENT_THEMES[0]);
  const [copied, setCopied] = React.useState(false);

  const handleCopyQuote = () => {
    const formatted = `"${quoteText}"\n\n— ${novelTitle} by ${authorName}\nRead free on NovelVerse`;
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(formatted);
      setCopied(true);
      toast.success("Quote card copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: novelTitle,
          text: `"${quoteText}" — ${novelTitle} by ${authorName}`,
          url: window.location.href,
        });
      } catch {
        // Ignored if cancelled
      }
    } else {
      handleCopyQuote();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-zinc-950/95 border-white/10 text-white backdrop-blur-2xl p-6 sm:p-8 space-y-6">
        <DialogHeader className="pb-2 border-b border-white/10">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Social Quote Card (Module 26)
          </DialogTitle>
        </DialogHeader>

        {/* Visual Quote Card Preview */}
        <div
          className={cn(
            "p-8 sm:p-10 rounded-3xl border shadow-2xl relative flex flex-col justify-between min-h-[260px] transition-all",
            selectedTheme.bgClass
          )}
        >
          {/* Top quotation mark */}
          <div className="flex items-center justify-between">
            <span className={cn("text-4xl font-serif font-black opacity-40 leading-none", selectedTheme.accentClass)}>
              “
            </span>
            <div className="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase opacity-70">
              <BookOpen className="w-3 h-3" />
              <span>NovelVerse</span>
            </div>
          </div>

          {/* Quote Body */}
          <p className="font-serif italic text-base sm:text-lg lg:text-xl font-medium leading-relaxed my-6">
            &quot;{quoteText || "The truth was never buried."}&quot;
          </p>

          {/* Attribution Footer */}
          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <div>
              <p className="text-xs font-bold text-white tracking-wide">
                {novelTitle}
              </p>
              <p className={cn("text-[11px] font-medium opacity-80", selectedTheme.accentClass)}>
                by {authorName}
              </p>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white/10 border border-white/10">
              Free on NovelVerse
            </span>
          </div>
        </div>

        {/* Theme Palette Switcher */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-violet-400" />
            Card Theme
          </label>
          <div className="grid grid-cols-4 gap-2">
            {GRADIENT_THEMES.map((th) => (
              <button
                key={th.id}
                onClick={() => setSelectedTheme(th)}
                className={cn(
                  "p-2.5 rounded-xl border text-[11px] font-semibold text-center transition-all truncate",
                  selectedTheme.id === th.id
                    ? "border-violet-500 bg-white/10 text-white ring-1 ring-violet-500"
                    : "border-white/5 bg-zinc-900/60 text-zinc-400 hover:text-white"
                )}
              >
                {th.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            onClick={handleCopyQuote}
            variant="outline"
            className="rounded-2xl border-white/10 bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-white py-5"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-emerald-400" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2 text-violet-400" /> Copy Quote
              </>
            )}
          </Button>

          <Button
            onClick={handleNativeShare}
            className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-xs font-bold text-white py-5 shadow-lg shadow-violet-600/30"
          >
            <Share2 className="w-4 h-4 mr-2" /> Share Quote
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

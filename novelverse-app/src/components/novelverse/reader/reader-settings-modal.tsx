"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  type ReaderSettings,
  type ReaderTheme,
  type ReaderFontFamily,
  type ReaderFontSize,
  type ReaderLineHeight,
  type ReaderWidth,
  type ReaderAlign,
  saveReaderSettings,
} from "@/lib/reader-storage";
import {
  Type,
  Sun,
  Moon,
  AlignLeft,
  AlignJustify,
  Volume2,
  Maximize2,
  Sparkles,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ReaderSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: ReaderSettings;
  onSettingsChange: (newSettings: ReaderSettings) => void;
}

const THEMES: Array<{
  id: ReaderTheme;
  label: string;
  desc: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
}> = [
  {
    id: "amoled",
    label: "AMOLED",
    desc: "Pure #000000 black, zero battery drain",
    bgClass: "bg-black",
    textClass: "text-zinc-100",
    borderClass: "border-zinc-800",
  },
  {
    id: "dark",
    label: "Dark Charcoal",
    desc: "Sleek deep gray #121214",
    bgClass: "bg-[#121214]",
    textClass: "text-zinc-200",
    borderClass: "border-zinc-700",
  },
  {
    id: "sepia",
    label: "Warm Sepia",
    desc: "Parchment tone #fbf0d9, easy on eyes",
    bgClass: "bg-[#fbf0d9]",
    textClass: "text-[#433422]",
    borderClass: "border-[#e0ceb1]",
  },
  {
    id: "paper",
    label: "Clean Paper",
    desc: "Daylight ivory #f8f9fa",
    bgClass: "bg-[#f8f9fa]",
    textClass: "text-zinc-900",
    borderClass: "border-zinc-300",
  },
];

const FONTS: Array<{ id: ReaderFontFamily; label: string; preview: string; fontClass: string }> = [
  { id: "serif", label: "Serif (Classic)", preview: "The quick brown fox", fontClass: "font-serif" },
  { id: "sans", label: "Sans (Modern)", preview: "The quick brown fox", fontClass: "font-sans" },
  { id: "dyslexic", label: "Dyslexia Friendly", preview: "The quick brown fox", fontClass: "font-mono tracking-wide" },
  { id: "mono", label: "Monospace", preview: "The quick brown fox", fontClass: "font-mono" },
];

const FONT_SIZES: Array<{ id: ReaderFontSize; label: string; sizePx: string }> = [
  { id: "xs", label: "XS", sizePx: "14px" },
  { id: "sm", label: "SM", sizePx: "16px" },
  { id: "base", label: "MD", sizePx: "18px" },
  { id: "lg", label: "LG", sizePx: "20px" },
  { id: "xl", label: "XL", sizePx: "24px" },
  { id: "2xl", label: "2XL", sizePx: "28px" },
];

const WIDTHS: Array<{ id: ReaderWidth; label: string; desc: string }> = [
  { id: "narrow", label: "Narrow", desc: "640px" },
  { id: "normal", label: "Standard", desc: "768px" },
  { id: "wide", label: "Wide", desc: "960px" },
  { id: "full", label: "Full", desc: "100%" },
];

export function ReaderSettingsModal({
  open,
  onOpenChange,
  settings,
  onSettingsChange,
}: ReaderSettingsModalProps) {
  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([]);

  React.useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const updateVoices = () => {
        setVoices(window.speechSynthesis.getVoices());
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const update = (partial: Partial<ReaderSettings>) => {
    const updated = saveReaderSettings(partial);
    onSettingsChange(updated);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-zinc-950/95 border-white/10 text-white backdrop-blur-2xl p-6 sm:p-8">
        <DialogHeader className="pb-4 border-b border-white/10">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-white">
            <Sparkles className="w-5 h-5 text-violet-400" />
            Reading Environment Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* 1. Theme Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              Color Theme (Module 7)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {THEMES.map((th) => {
                const isSelected = settings.theme === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => update({ theme: th.id })}
                    className={cn(
                      "p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-24",
                      th.bgClass,
                      th.textClass,
                      isSelected ? "ring-2 ring-violet-500 border-violet-500 scale-[1.02]" : "border-white/10 hover:border-white/25 opacity-80 hover:opacity-100"
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold">{th.label}</span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-violet-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] opacity-75 line-clamp-2 leading-tight">
                      {th.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Font Family */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Type className="w-4 h-4 text-violet-400" />
              Typography Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              {FONTS.map((f) => {
                const isSelected = settings.fontFamily === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => update({ fontFamily: f.id })}
                    className={cn(
                      "p-3 rounded-xl border text-left transition-all flex items-center justify-between",
                      isSelected
                        ? "bg-violet-950/60 border-violet-500 text-violet-200"
                        : "bg-zinc-900/60 border-white/5 text-zinc-300 hover:bg-zinc-900"
                    )}
                  >
                    <div>
                      <p className="text-xs font-semibold">{f.label}</p>
                      <p className={cn("text-[11px] text-zinc-400 mt-0.5", f.fontClass)}>
                        {f.preview}
                      </p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-violet-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Font Size */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
              <span>Font Size</span>
              <span className="text-violet-400 font-mono text-xs">
                {FONT_SIZES.find((s) => s.id === settings.fontSize)?.sizePx}
              </span>
            </label>
            <div className="grid grid-cols-6 gap-1.5 bg-zinc-900/80 p-1.5 rounded-xl border border-white/5">
              {FONT_SIZES.map((size) => (
                <button
                  key={size.id}
                  onClick={() => update({ fontSize: size.id })}
                  className={cn(
                    "py-2 text-xs font-bold rounded-lg transition-all",
                    settings.fontSize === size.id
                      ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Reading Width & Alignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                Reading Width
              </label>
              <div className="grid grid-cols-4 gap-1 bg-zinc-900/80 p-1 rounded-xl border border-white/5">
                {WIDTHS.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => update({ readerWidth: w.id })}
                    className={cn(
                      "py-1.5 text-[11px] font-semibold rounded-lg transition-all text-center",
                      settings.readerWidth === w.id
                        ? "bg-violet-600 text-white"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <AlignLeft className="w-3.5 h-3.5 text-emerald-400" />
                Text Alignment
              </label>
              <div className="grid grid-cols-2 gap-1 bg-zinc-900/80 p-1 rounded-xl border border-white/5">
                <button
                  onClick={() => update({ textAlign: "left" })}
                  className={cn(
                    "py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5",
                    settings.textAlign === "left"
                      ? "bg-violet-600 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <AlignLeft className="w-3.5 h-3.5" /> Left
                </button>
                <button
                  onClick={() => update({ textAlign: "justify" })}
                  className={cn(
                    "py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5",
                    settings.textAlign === "justify"
                      ? "bg-violet-600 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <AlignJustify className="w-3.5 h-3.5" /> Justify
                </button>
              </div>
            </div>
          </div>

          {/* 5. Line Height & Paragraph Spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Line Spacing
              </label>
              <div className="grid grid-cols-4 gap-1 bg-zinc-900/80 p-1 rounded-xl border border-white/5">
                {(["tight", "normal", "relaxed", "loose"] as ReaderLineHeight[]).map((lh) => (
                  <button
                    key={lh}
                    onClick={() => update({ lineHeight: lh })}
                    className={cn(
                      "py-1.5 text-[11px] font-semibold rounded-lg capitalize transition-all",
                      settings.lineHeight === lh
                        ? "bg-violet-600 text-white"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {lh}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Paragraph Spacing
              </label>
              <div className="grid grid-cols-2 gap-1 bg-zinc-900/80 p-1 rounded-xl border border-white/5">
                <button
                  onClick={() => update({ paragraphSpacing: "normal" })}
                  className={cn(
                    "py-1.5 text-xs font-semibold rounded-lg transition-all",
                    settings.paragraphSpacing === "normal"
                      ? "bg-violet-600 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  Standard
                </button>
                <button
                  onClick={() => update({ paragraphSpacing: "spacious" })}
                  className={cn(
                    "py-1.5 text-xs font-semibold rounded-lg transition-all",
                    settings.paragraphSpacing === "spacious"
                      ? "bg-violet-600 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  Spacious
                </button>
              </div>
            </div>
          </div>

          {/* 6. TTS Voice Settings */}
          {voices.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                Audio TTS Narration Voice (Module 39)
              </label>
              <select
                value={settings.speechVoiceName || ""}
                onChange={(e) => update({ speechVoiceName: e.target.value })}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
              >
                <option value="">Default System Voice</option>
                {voices.slice(0, 15).map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

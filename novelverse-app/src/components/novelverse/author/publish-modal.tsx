"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  novelTitle: string;
  chapterTitle: string;
  chapterNumber: number;
  wordCount: number;
  onConfirmPublish: (details: {
    ageRating: string;
    contentWarnings: string[];
    isScheduled: boolean;
    scheduledDate?: string;
    license: string;
  }) => void;
}

const AGE_RATINGS = [
  { id: "ALL", label: "All Ages", desc: "Suitable for general audiences" },
  { id: "13+", label: "Teen (13+)", desc: "Mild fantasy violence or action" },
  { id: "16+", label: "Young Adult (16+)", desc: "Intense themes, dark intrigue" },
  { id: "18+", label: "Mature (18+)", desc: "Graphic violence or explicit content" },
];

const WARNING_OPTIONS = [
  "Graphic Violence",
  "Dark Psychological Themes",
  "Strong Language",
  "Substance Abuse",
  "Flashing Lights / Sensory",
];

export function PublishModal({
  isOpen,
  onClose,
  novelTitle,
  chapterTitle,
  chapterNumber,
  wordCount,
  onConfirmPublish,
}: PublishModalProps) {
  const [ageRating, setAgeRating] = React.useState("16+");
  const [warnings, setWarnings] = React.useState<string[]>([]);
  const [copyrightAgreed, setCopyrightAgreed] = React.useState(false);
  const [license, setLicense] = React.useState("ALL_RIGHTS_RESERVED");
  const [isScheduled, setIsScheduled] = React.useState(false);
  const [scheduledDate, setScheduledDate] = React.useState("");
  const [isPublishing, setIsPublishing] = React.useState(false);

  const toggleWarning = (w: string) => {
    setWarnings((prev) =>
      prev.includes(w) ? prev.filter((item) => item !== w) : [...prev, w]
    );
  };

  const handlePublish = () => {
    if (!copyrightAgreed) {
      toast.error("Please agree to the Copyright & Intellectual Property declaration.");
      return;
    }

    if (isScheduled && !scheduledDate) {
      toast.error("Please pick a scheduled release date and time.");
      return;
    }

    setIsPublishing(true);
    setTimeout(() => {
      onConfirmPublish({
        ageRating,
        contentWarnings: warnings,
        isScheduled,
        scheduledDate: isScheduled ? scheduledDate : undefined,
        license,
      });
      setIsPublishing(false);
      onClose();
      toast.success(
        isScheduled
          ? `Chapter ${chapterNumber} scheduled for release on ${scheduledDate}!`
          : `Chapter ${chapterNumber} published to NovelVerse live feed!`
      );
    }, 400);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-[#0d1017] border border-white/10 text-white p-6 rounded-3xl shadow-2xl space-y-4">
        <DialogHeader className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-violet-600/20 text-violet-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <DialogTitle className="text-lg font-bold text-white">
              Pre-Flight Publishing Checklist
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-zinc-400">
            Publishing Chapter {chapterNumber} &ldquo;{chapterTitle}&rdquo; ({wordCount.toLocaleString()} words) in {novelTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1 text-xs">
          {/* Section 1: Age Rating */}
          <div className="space-y-2">
            <label className="font-semibold text-zinc-300 block">
              1. Recommended Age Rating
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AGE_RATINGS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setAgeRating(r.id)}
                  className={cn(
                    "p-2.5 rounded-xl border text-left transition-all",
                    ageRating === r.id
                      ? "bg-violet-600/20 border-violet-500 text-white"
                      : "bg-zinc-900/60 border-white/5 text-zinc-400 hover:text-white"
                  )}
                >
                  <div className="font-bold text-xs">{r.label}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Content Warnings */}
          <div className="space-y-2">
            <label className="font-semibold text-zinc-300 block">
              2. Content Warnings (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {WARNING_OPTIONS.map((w) => {
                const active = warnings.includes(w);
                return (
                  <button
                    key={w}
                    type="button"
                    onClick={() => toggleWarning(w)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors",
                      active
                        ? "bg-amber-950/80 border-amber-500/50 text-amber-300 font-semibold"
                        : "bg-zinc-900 border-white/5 text-zinc-400 hover:text-white"
                    )}
                  >
                    {w}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Release Schedule */}
          <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-violet-400" />
                <span className="font-semibold text-zinc-200">Schedule Release</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isScheduled}
                  onChange={(e) => setIsScheduled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600"></div>
              </label>
            </div>

            {isScheduled && (
              <div className="pt-2 border-t border-white/5 flex items-center gap-3">
                <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="bg-zinc-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            )}
          </div>

          {/* Section 4: Copyright & Authorship Declaration (second-plan §17) */}
          <div className="p-3.5 rounded-2xl bg-violet-950/20 border border-violet-500/20 space-y-2">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-white text-xs block">
                  Copyright & Authorship Declaration
                </span>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  By publishing, you solemnly declare that you own all intellectual property rights to this work or have legal authority to distribute it under platform guidelines.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1 pl-6">
              <input
                type="checkbox"
                checked={copyrightAgreed}
                onChange={(e) => setCopyrightAgreed(e.target.checked)}
                className="rounded border-white/20 bg-zinc-900 text-violet-600 focus:ring-0 w-3.5 h-3.5"
              />
              <span className="text-xs font-semibold text-zinc-200">
                I confirm I am the original creator or authorized distributor.
              </span>
            </label>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="text-xs text-zinc-400 hover:text-white rounded-xl"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handlePublish}
            disabled={!copyrightAgreed || isPublishing}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold px-6 h-10 rounded-xl shadow-lg shadow-violet-600/30 flex items-center gap-1.5"
          >
            {isScheduled ? "Confirm Schedule" : "Publish Chapter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

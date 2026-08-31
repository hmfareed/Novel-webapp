"use client";

import * as React from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  X,
  Headphones,
  Sliders,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type ReaderSettings } from "@/lib/reader-storage";

interface ReaderAudioPlayerProps {
  title: string;
  chapterTitle: string;
  content: string;
  settings: ReaderSettings;
  isOpen: boolean;
  onClose: () => void;
  onRateChange: (rate: number) => void;
}

const SPEED_PRESETS = [0.75, 1.0, 1.25, 1.5, 2.0];

export function ReaderAudioPlayer({
  title,
  chapterTitle,
  content,
  settings,
  isOpen,
  onClose,
  onRateChange,
}: ReaderAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [currentParagraphIdx, setCurrentParagraphIdx] = React.useState(0);
  const [speechRate, setSpeechRate] = React.useState(settings.speechRate || 1.0);

  const paragraphs = React.useMemo(() => {
    return content
      .split("\n\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }, [content]);

  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);

  // Stop speech when closing
  const stopSpeech = React.useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, []);

  const speakParagraph = React.useCallback(
    (index: number) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();

      if (index >= paragraphs.length) {
        setIsPlaying(false);
        setCurrentParagraphIdx(0);
        return;
      }

      const text = paragraphs[index];
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechRate;
      utterance.pitch = settings.speechPitch || 1.0;

      if (settings.speechVoiceName) {
        const voices = window.speechSynthesis.getVoices();
        const matched = voices.find((v) => v.name === settings.speechVoiceName);
        if (matched) utterance.voice = matched;
      }

      utterance.onend = () => {
        if (index + 1 < paragraphs.length) {
          setCurrentParagraphIdx(index + 1);
          speakParagraph(index + 1);
        } else {
          setIsPlaying(false);
        }
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      setCurrentParagraphIdx(index);
    },
    [paragraphs, speechRate, settings.speechPitch, settings.speechVoiceName]
  );

  const togglePlay = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        speakParagraph(currentParagraphIdx);
      }
    }
  };

  const handleSkipForward = () => {
    const next = Math.min(paragraphs.length - 1, currentParagraphIdx + 1);
    speakParagraph(next);
  };

  const handleSkipBackward = () => {
    const prev = Math.max(0, currentParagraphIdx - 1);
    speakParagraph(prev);
  };

  const handleSpeedChange = (speed: number) => {
    setSpeechRate(speed);
    onRateChange(speed);
    if (isPlaying) {
      speakParagraph(currentParagraphIdx);
    }
  };

  React.useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [stopSpeech]);

  if (!isOpen) return null;

  const totalParagraphs = Math.max(1, paragraphs.length);
  const progressPercent = Math.min(100, Math.round(((currentParagraphIdx + 1) / totalParagraphs) * 100));

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-2xl animate-in slide-in-from-bottom-5 duration-200">
      <div className="bg-zinc-950/95 border border-violet-500/30 rounded-3xl p-4 sm:p-5 text-white shadow-2xl shadow-violet-950/40 backdrop-blur-2xl space-y-3">
        {/* Header bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/40 flex items-center justify-center shrink-0">
              <Headphones className="w-4 h-4 text-violet-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest bg-violet-950/80 px-2 py-0.5 rounded-full border border-violet-500/20">
                  Free Audio TTS
                </span>
                <span className="text-[11px] text-zinc-400 truncate font-medium">
                  {title}
                </span>
              </div>
              <p className="text-xs font-bold text-white truncate mt-0.5">
                {chapterTitle}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopSpeech();
              onClose();
            }}
            className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Paragraph Snippet */}
        {paragraphs[currentParagraphIdx] && (
          <p className="text-xs text-zinc-300 italic line-clamp-1 border-l-2 border-violet-500 pl-2.5 bg-white/5 py-1 rounded-r-lg">
            &quot;{paragraphs[currentParagraphIdx]}&quot;
          </p>
        )}

        {/* Progress scrub bar */}
        <div className="space-y-1">
          <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-violet-500 to-indigo-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
            <span>Para {currentParagraphIdx + 1} / {totalParagraphs}</span>
            <span>{progressPercent}% Complete</span>
          </div>
        </div>

        {/* Main Controls Row */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {/* Speed Presets */}
          <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-white/5">
            {SPEED_PRESETS.map((s) => (
              <button
                key={s}
                onClick={() => handleSpeedChange(s)}
                className={cn(
                  "px-2 py-1 text-[11px] font-bold rounded-lg transition-colors font-mono",
                  speechRate === s
                    ? "bg-violet-600 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Central Playback buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSkipBackward}
              disabled={currentParagraphIdx === 0}
              className="p-2 text-zinc-400 hover:text-white disabled:opacity-30 rounded-xl hover:bg-white/10 transition-colors"
              title="Previous Paragraph"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="w-11 h-11 rounded-full bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center shadow-lg shadow-violet-600/40 transition-all hover:scale-105 active:scale-95"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={handleSkipForward}
              disabled={currentParagraphIdx >= paragraphs.length - 1}
              className="p-2 text-zinc-400 hover:text-white disabled:opacity-30 rounded-xl hover:bg-white/10 transition-colors"
              title="Next Paragraph"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Mute button */}
          <button
            onClick={() => {
              if (typeof window !== "undefined" && "speechSynthesis" in window) {
                if (!isMuted) {
                  window.speechSynthesis.pause();
                } else {
                  window.speechSynthesis.resume();
                }
                setIsMuted(!isMuted);
              }
            }}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            title="Mute / Unmute"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Eye,
  Send,
  Plus,
  Trash2,
  Image as ImageIcon,
  Music,
  Radio,
  Clock,
  Sparkles,
  Layers,
  CheckCircle2,
  Sliders,
  HelpCircle,
} from "lucide-react";
import { Navbar } from "@/components/novelverse/navbar";
import { Footer } from "@/components/novelverse/footer";
import { Button } from "@/components/ui/button";
import { PublishModal } from "@/components/novelverse/author/publish-modal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SceneDraft {
  order: number;
  text: string;
  illustrationUrl?: string;
  ambientAudioUrl?: string;
}

export default function AuthorStudioEditorPage() {
  const [selectedNovelSlug, setSelectedNovelSlug] = React.useState("sundiata-lion-of-mali");
  const [chapterNumber, setChapterNumber] = React.useState(6);
  const [chapterTitle, setChapterTitle] = React.useState("The Blacksmith's Forge");
  const [arcName, setArcName] = React.useState("Arc II: The Gathering Armies");
  const [authorNote, setAuthorNote] = React.useState(
    "Thank you all for the tremendous support on Arc I! In this chapter, we discover the hidden secrets of the royal armory."
  );

  // Editor mode: standard text OR scene-based multimedia (second-plan §8)
  const [editorMode, setEditorMode] = React.useState<"STANDARD" | "SCENES">("SCENES");

  // Standard prose
  const [content, setContent] = React.useState(
    `The flames in Farakourou's smithy roared with a ferocious golden light, reflecting off the dark obsidian stones of Niani.\n\nSundiata stood motionless before the anvil. The weight of his exile bore heavily upon him, yet in the red embers of the forge, he saw the outline of a kingdom united beneath the lion banner.\n\n"Young master," the master smith whispered, pulling the white-hot iron from the heart of the hearth. "A bow of iron is not forged for games of children. It requires the breath of ancestors and the sinews of giants."`
  );

  // Scene breakdown
  const [scenes, setScenes] = React.useState<SceneDraft[]>([
    {
      order: 1,
      text: `The flames in Farakourou's smithy roared with a ferocious golden light, reflecting off the dark obsidian stones of Niani.\n\nSundiata stood motionless before the anvil. The weight of his exile bore heavily upon him, yet in the red embers of the forge, he saw the outline of a kingdom united beneath the lion banner.`,
      illustrationUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=800&auto=format&fit=crop",
      ambientAudioUrl: "https://cdn.pixabay.com/download/audio/forge-fire.mp3",
    },
    {
      order: 2,
      text: `"Young master," the master smith whispered, pulling the white-hot iron from the heart of the hearth. "A bow of iron is not forged for games of children. It requires the breath of ancestors and the sinews of giants."\n\nWith one hand, Sundiata grasped the tongs. The heat scorched his brow, but his golden gaze never wavered.`,
      illustrationUrl: "",
      ambientAudioUrl: "",
    },
  ]);

  const [isSaved, setIsSaved] = React.useState(true);
  const [publishModalOpen, setPublishModalOpen] = React.useState(false);

  // Derived metrics
  const totalWords = React.useMemo(() => {
    if (editorMode === "SCENES") {
      const combined = scenes.map((s) => s.text).join(" ");
      return combined.trim().split(/\s+/).filter(Boolean).length;
    }
    return content.trim().split(/\s+/).filter(Boolean).length;
  }, [editorMode, scenes, content]);

  const estimatedReadingTime = Math.max(1, Math.round(totalWords / 200));

  const handleAddScene = () => {
    setScenes((prev) => [
      ...prev,
      {
        order: prev.length + 1,
        text: "",
        illustrationUrl: "",
        ambientAudioUrl: "",
      },
    ]);
    setIsSaved(false);
  };

  const handleRemoveScene = (idx: number) => {
    if (scenes.length <= 1) {
      toast.error("A chapter must contain at least one scene.");
      return;
    }
    setScenes((prev) => prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, order: i + 1 })));
    setIsSaved(false);
  };

  const handleUpdateScene = (idx: number, field: keyof SceneDraft, val: string) => {
    setScenes((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
    setIsSaved(false);
  };

  const handleSaveDraft = () => {
    setIsSaved(true);
    toast.success("Draft saved successfully!");
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-violet-600/30 selection:text-white flex flex-col font-sans">
      <Navbar />

      {/* Editor Sub-Header Toolbar */}
      <header className="sticky top-16 z-30 border-b border-white/10 bg-[#0a0d14]/90 backdrop-blur-xl px-4 py-3">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/author"
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                  Author Studio Editor
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {isSaved ? "Saved" : "Unsaved changes"}
                </span>
              </div>
              <h1 className="text-sm font-bold text-white truncate max-w-sm">
                Chapter {chapterNumber}: {chapterTitle || "Untitled Draft"}
              </h1>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/5 text-[11px] text-zinc-400">
              <span><strong>{totalWords.toLocaleString()}</strong> words</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-zinc-500" />
                ~{estimatedReadingTime} min read
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              className="rounded-xl border-white/10 bg-zinc-900 text-xs font-semibold text-zinc-300 hover:text-white gap-1.5 h-9"
            >
              <Save className="w-3.5 h-3.5" />
              Save Draft
            </Button>

            <Button
              size="sm"
              onClick={() => setPublishModalOpen(true)}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold gap-1.5 h-9 shadow-lg shadow-violet-600/30"
            >
              <Send className="w-3.5 h-3.5" />
              Publish / Schedule
            </Button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 mx-auto max-w-5xl w-full px-4 sm:px-6 py-8 space-y-8">
        {/* Manuscript Metadata Bar */}
        <div className="p-5 rounded-3xl bg-zinc-950/80 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400">Select Novel</label>
            <select
              value={selectedNovelSlug}
              onChange={(e) => setSelectedNovelSlug(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
            >
              <option value="sundiata-lion-of-mali">Sundiata: Lion of Mali</option>
              <option value="dracula">Dracula</option>
              <option value="the-time-machine">The Time Machine</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400">Chapter Title</label>
            <input
              type="text"
              value={chapterTitle}
              onChange={(e) => {
                setChapterTitle(e.target.value);
                setIsSaved(false);
              }}
              placeholder="e.g. The Iron Bow"
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400">Arc Grouping</label>
            <input
              type="text"
              value={arcName}
              onChange={(e) => {
                setArcName(e.target.value);
                setIsSaved(false);
              }}
              placeholder="e.g. Arc II: The War of Kingdoms"
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {/* Format Selector Pills (second-plan §8) */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditorMode("SCENES")}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5",
                editorMode === "SCENES"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                  : "bg-zinc-900 text-zinc-400 hover:text-white"
              )}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Cinematic Scene Mode (Enhanced)</span>
            </button>
            <button
              onClick={() => setEditorMode("STANDARD")}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5",
                editorMode === "STANDARD"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                  : "bg-zinc-900 text-zinc-400 hover:text-white"
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Standard Prose</span>
            </button>
          </div>

          <Link href="/author/story-bible">
            <Button variant="ghost" size="sm" className="text-xs text-violet-400 hover:text-white gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Open Story Bible
            </Button>
          </Link>
        </div>

        {/* Editor Body */}
        {editorMode === "SCENES" ? (
          <div className="space-y-6">
            {scenes.map((scene, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-zinc-950 border border-white/10 space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-violet-600/20 text-violet-400 font-bold flex items-center justify-center text-xs">
                      {scene.order}
                    </span>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Scene #{scene.order}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRemoveScene(idx)}
                    className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                    title="Remove scene"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Scene Prose Textarea */}
                <textarea
                  rows={6}
                  value={scene.text}
                  onChange={(e) => handleUpdateScene(idx, "text", e.target.value)}
                  placeholder="Write the prose and character dialogues for this scene..."
                  className="w-full bg-zinc-900/60 border border-white/10 rounded-2xl p-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 font-serif leading-relaxed"
                />

                {/* Media attachments */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center gap-2 bg-zinc-900/40 border border-white/5 rounded-xl px-3 py-2">
                    <ImageIcon className="w-4 h-4 text-violet-400 shrink-0" />
                    <input
                      type="text"
                      value={scene.illustrationUrl || ""}
                      onChange={(e) => handleUpdateScene(idx, "illustrationUrl", e.target.value)}
                      placeholder="Scene Illustration CDN URL (Optional)"
                      className="bg-transparent text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none w-full"
                    />
                  </div>

                  <div className="flex items-center gap-2 bg-zinc-900/40 border border-white/5 rounded-xl px-3 py-2">
                    <Music className="w-4 h-4 text-emerald-400 shrink-0" />
                    <input
                      type="text"
                      value={scene.ambientAudioUrl || ""}
                      onChange={(e) => handleUpdateScene(idx, "ambientAudioUrl", e.target.value)}
                      placeholder="Ambient Audio Soundscape URL (Optional)"
                      className="bg-transparent text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none w-full"
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              onClick={handleAddScene}
              variant="outline"
              className="w-full border-dashed border-white/20 hover:border-violet-500/50 bg-zinc-950/60 text-xs font-bold text-zinc-300 hover:text-white py-6 rounded-2xl gap-2"
            >
              <Plus className="w-4 h-4 text-violet-400" />
              Add Next Scene
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              rows={16}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setIsSaved(false);
              }}
              placeholder="Write your chapter manuscript here..."
              className="w-full bg-zinc-950 border border-white/10 rounded-3xl p-6 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 font-serif leading-loose"
            />
          </div>
        )}

        {/* Author Notes Box */}
        <div className="p-5 rounded-3xl bg-zinc-950/80 border border-white/10 space-y-2">
          <label className="text-xs font-semibold text-zinc-400 block">
            Author Note to Readers (Shown at the end of the chapter)
          </label>
          <textarea
            rows={3}
            value={authorNote}
            onChange={(e) => {
              setAuthorNote(e.target.value);
              setIsSaved(false);
            }}
            placeholder="Share personal insights, thank patrons, or hint at upcoming plot developments..."
            className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-3 text-xs text-zinc-300 focus:outline-none focus:border-violet-500"
          />
        </div>
      </main>

      {/* Publish Modal */}
      <PublishModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        novelTitle="Sundiata: Lion of Mali"
        chapterTitle={chapterTitle}
        chapterNumber={chapterNumber}
        wordCount={totalWords}
        onConfirmPublish={(details) => {
          setIsSaved(true);
        }}
      />

      <Footer />
    </div>
  );
}

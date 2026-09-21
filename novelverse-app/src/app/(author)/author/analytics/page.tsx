"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  Users,
  Eye,
  Clock,
  DollarSign,
  Heart,
  MessageSquare,
  Star,
  ChevronRight,
  Filter,
  Layers,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/novelverse/navbar";
import { Footer } from "@/components/novelverse/footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChapterFunnelStep {
  chapterNumber: number;
  chapterTitle: string;
  readers: number;
  retentionPercent: number;
}

export default function AuthorAnalyticsPage() {
  const [timeRange, setTimeRange] = React.useState<"7d" | "30d" | "all">("30d");

  const funnelData: ChapterFunnelStep[] = [
    { chapterNumber: 1, chapterTitle: "The Prophecy of the Buffalo Woman", readers: 10420, retentionPercent: 100 },
    { chapterNumber: 2, chapterTitle: "The Sorcery of the First Queen", readers: 8960, retentionPercent: 86 },
    { chapterNumber: 3, chapterTitle: "The Crawling Prince", readers: 8410, retentionPercent: 80.7 },
    { chapterNumber: 4, chapterTitle: "The Iron Bow", readers: 7850, retentionPercent: 75.3 },
    { chapterNumber: 5, chapterTitle: "The Uprooted Baobab", readers: 7290, retentionPercent: 70 },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-violet-600/30 selection:text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pb-24">
        {/* Header */}
        <section className="pt-10 pb-8 border-b border-white/5 bg-gradient-to-b from-violet-950/40 via-zinc-950 to-zinc-950">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Link
                  href="/author"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <span className="text-xs font-bold uppercase tracking-wider text-violet-400 bg-violet-950/80 px-2.5 py-0.5 rounded-full border border-violet-500/30">
                  Readership Intelligence
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Author & Audience Analytics
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
                Track reader retention, chapter drop-off funnels, completion rates, and coin earnings across your novel catalog.
              </p>
            </div>

            <div className="flex items-center gap-2 p-1 rounded-xl bg-zinc-900 border border-white/10">
              {(["7d", "30d", "all"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-bold transition-all",
                    timeRange === r
                      ? "bg-violet-600 text-white shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  )}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Unique Readers", value: "24,810", delta: "+14.2% vs last month", icon: Users, color: "text-violet-400" },
              { label: "Chapter Reads", value: "142,920", delta: "+28.1% reads", icon: Eye, color: "text-blue-400" },
              { label: "Avg. Completion Rate", value: "72.4%", delta: "+4.2% completion", icon: TrendingUp, color: "text-emerald-400" },
              { label: "Creator Royalties", value: "$1,480.20", delta: "Paid monthly", icon: DollarSign, color: "text-amber-400" },
            ].map((m, idx) => (
              <div key={idx} className="p-5 rounded-3xl bg-zinc-950 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-medium">{m.label}</span>
                  <m.icon className={cn("w-4 h-4", m.color)} />
                </div>
                <div className="text-2xl font-black text-white">{m.value}</div>
                <div className="text-[11px] text-zinc-500">{m.delta}</div>
              </div>
            ))}
          </div>

          {/* Chapter Drop-Off Funnel (second-plan §14) */}
          <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-violet-400" />
                  Chapter Retention & Drop-Off Funnel
                </h3>
                <p className="text-xs text-zinc-400">
                  Observe where readers transition between chapters to optimize cliffhangers and pacing.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-400 font-mono">
                70% Arc 1 Completion
              </span>
            </div>

            <div className="space-y-4">
              {funnelData.map((step) => (
                <div key={step.chapterNumber} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-zinc-900 text-zinc-300 font-bold flex items-center justify-center text-[10px] border border-white/10">
                        {step.chapterNumber}
                      </span>
                      <span className="font-semibold text-white truncate max-w-xs sm:max-w-md">
                        {step.chapterTitle}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-400 font-mono">{step.readers.toLocaleString()} readers</span>
                      <span className="text-violet-400 font-bold font-mono w-14 text-right">
                        {step.retentionPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Funnel Progress Bar */}
                  <div className="w-full bg-zinc-900 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-violet-600 to-indigo-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${step.retentionPercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reader Engagement Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-3xl bg-zinc-950 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-violet-400">
                <Heart className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Reactions & Likes</h4>
              </div>
              <div className="text-2xl font-black text-white">18,420</div>
              <p className="text-[11px] text-zinc-400">Chapter 5 has the highest like-to-view ratio (84%).</p>
            </div>

            <div className="p-5 rounded-3xl bg-zinc-950 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-blue-400">
                <MessageSquare className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Paragraph Discussions</h4>
              </div>
              <div className="text-2xl font-black text-white">3,120</div>
              <p className="text-[11px] text-zinc-400">Paragraph #4 in Chapter 3 generated 142 comments.</p>
            </div>

            <div className="p-5 rounded-3xl bg-zinc-950 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Star className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Average Star Score</h4>
              </div>
              <div className="text-2xl font-black text-white">4.96 / 5.0</div>
              <p className="text-[11px] text-zinc-400">Based on 1,840 reader reviews.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

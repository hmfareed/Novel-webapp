"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/novelverse/navbar";
import { Footer } from "@/components/novelverse/footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  Sparkles,
  BookOpen,
  DollarSign,
  Users,
  Plus,
  Eye,
  Layers,
} from "lucide-react";
import { SEED_NOVELS } from "@/lib/seed-data";

export default function AuthorStudioPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-violet-600/30 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-1 pb-24">
        {/* Author Studio Banner */}
        <section className="pt-10 pb-8 border-b border-white/5 bg-gradient-to-b from-violet-950/30 via-zinc-950 to-zinc-950">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/80 border border-violet-500/40 text-violet-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                NovelVerse Author & Creator Studio
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Welcome to Author Studio, {user?.name || "Story Creator"}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
                Publish chapters, track your reader analytics, manage royalties, and engage with thousands of passionate readers.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/author/import">
                <Button variant="outline" className="border-white/10 hover:border-violet-500/50 bg-zinc-900 text-white text-xs font-semibold rounded-xl px-4 h-11 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-violet-400" />
                  Novel Ingestion Studio
                </Button>
              </Link>
              <Link href="/author/import">
                <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-semibold rounded-xl px-5 h-11 shadow-lg shadow-violet-600/30 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Import / Publish
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          {/* Creator Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Novel Reads", value: "142.8k", change: "+12.4% this week", icon: Eye, color: "text-blue-400" },
              { label: "Active Followers", value: "3,892", change: "+85 new readers", icon: Users, color: "text-purple-400" },
              { label: "Creator Royalties", value: "$1,240.50", change: "Paid monthly", icon: DollarSign, color: "text-emerald-400" },
              { label: "Published Novels", value: "3", change: "48 total chapters", icon: BookOpen, color: "text-amber-400" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-zinc-950 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400 font-medium">{stat.label}</span>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-white">{stat.value}</div>
                  <div className="text-[11px] text-zinc-500">{stat.change}</div>
                </div>
              );
            })}
          </div>

          {/* Author Novels Table / Cards */}
          <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-violet-400" />
                  Your Manuscripts & Novels
                </h2>
                <p className="text-xs text-zinc-400">Manage drafts, releases, and chapter scheduling.</p>
              </div>
            </div>

            <div className="space-y-3">
              {SEED_NOVELS.slice(0, 3).map((novel) => (
                <div
                  key={novel.slug}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-zinc-900/60 border border-white/5 gap-4 hover:border-violet-500/30 transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-12 h-16 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-zinc-900">
                      <Image src={novel.coverUrl} alt={novel.title} fill className="object-cover" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{novel.title}</h3>
                      <p className="text-xs text-zinc-400">
                        {novel.chapterCount} Chapters • {novel.genres[0]?.name || "Fantasy"} • Status:{" "}
                        <span className="text-emerald-400 font-medium">Published</span>
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-1">
                        ★ {novel.rating} ({novel.reviewCount} reviews) • {novel.readCount.toLocaleString()} reads
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link href={`/novels/${novel.slug}`} className="flex-1 sm:flex-initial">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-white/10 bg-zinc-900 hover:bg-zinc-800 text-xs rounded-xl"
                      >
                        View Story
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      className="flex-1 sm:flex-initial bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl"
                    >
                      Write Chapter
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

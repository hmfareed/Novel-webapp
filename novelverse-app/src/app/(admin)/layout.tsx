"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  BookOpen,
  Library,
  Database,
  ArrowLeft,
  Shield,
  Layers,
  Sparkles,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();

  const adminNav = [
    {
      name: "Library & Ingestion",
      href: "/admin/library",
      icon: Library,
      description: "Search & import from Gutenberg, Open Library, Google Books",
    },
    {
      name: "Public Catalog",
      href: "/novels",
      icon: BookOpen,
      description: "View all active novels on the live website",
    },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col font-sans selection:bg-violet-600/30 selection:text-white">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-50 border-b border-violet-500/20 bg-zinc-950/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="p-1.5 rounded-xl bg-violet-600/20 border border-violet-500/40 text-violet-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                  Novel<span className="text-violet-400">Verse</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-violet-950 border border-violet-500/40 text-violet-300">
                    ADMIN
                  </span>
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              {adminNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all",
                      isActive
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30 font-bold"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs rounded-xl gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Reader</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 pb-16">{children}</main>
    </div>
  );
}

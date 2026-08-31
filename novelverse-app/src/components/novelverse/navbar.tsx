"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  Home,
  Compass,
  Calendar,
  Bookmark,
  Search,
  X,
  Menu,
  User as UserIcon,
  LogOut,
  Settings,
  ChevronDown,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationCenter } from "@/components/novelverse/gamification/notification-center";
import { DirectMessagesDrawer } from "@/components/novelverse/social/direct-messages-drawer";
import { cn } from "@/lib/utils";
import { SEED_NOVELS } from "@/lib/seed-data";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [dmDrawerOpen, setDmDrawerOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "Schedule", href: "/schedule", icon: Calendar },
    { name: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  ];

  interface SearchResultNovel {
    id?: string;
    slug: string;
    title: string;
    coverUrl?: string;
    author?: { name: string };
    genres?: Array<{ name: string }>;
    chapterCount?: number;
    source?: string;
  }

  const [liveResults, setLiveResults] = React.useState<SearchResultNovel[]>([]);

  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setLiveResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/novels?q=${encodeURIComponent(searchQuery.trim())}&limit=8`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.novels)) {
            setLiveResults(data.novels);
            return;
          }
        }
      } catch {
        // Fallback
      }

      setLiveResults(
        SEED_NOVELS.filter(
          (n) =>
            n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.genres.some((g) => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      );
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const searchResults = liveResults.length > 0
    ? liveResults
    : searchQuery.trim()
    ? SEED_NOVELS.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.genres.some((g) => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      router.push(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#07090e]/80 backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Brand Logo & Desktop Navigation */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex h-8 w-8 items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-violet-400 group-hover:scale-105 transition-transform drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
                  <path d="M12 2L15 8L21 9L16.5 14L18 20L12 16.5L6 20L7.5 14L3 9L9 8L12 2Z" fill="url(#nv-logo-grad)" stroke="#a855f7" strokeWidth="1" />
                  <defs>
                    <linearGradient id="nv-logo-grad" x1="3" y1="2" x2="21" y2="20" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#c084fc" />
                      <stop offset="0.5" stopColor="#9333ea" />
                      <stop offset="1" stopColor="#6b21a8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Novel<span className="text-violet-400">Verse</span>
              </span>
            </Link>

            {/* Desktop Navigation Links with Icons */}
            <nav className="hidden md:flex items-center gap-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "relative px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer rounded-full flex items-center gap-2",
                      isActive
                        ? "text-white font-bold bg-white/10 shadow-sm"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className={cn("w-3.5 h-3.5", isActive ? "text-violet-400" : "text-zinc-400")} />
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-gradient-to-r from-violet-500 to-purple-400 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Search, DMs, Notifications, Auth */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Desktop Search Input with ⌘K */}
            <div
              onClick={() => setSearchOpen(true)}
              className="hidden lg:flex items-center gap-2.5 w-60 px-3.5 py-1.5 rounded-xl bg-zinc-900/80 border border-white/10 hover:border-violet-500/40 text-xs text-zinc-400 cursor-pointer transition-all shadow-inner group"
            >
              <Search className="h-3.5 w-3.5 text-zinc-400 group-hover:text-violet-300 transition-colors" />
              <span className="flex-1 truncate text-zinc-400">Search novels...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] text-zinc-400 bg-zinc-800 border border-white/5 rounded font-mono">
                ⌘K
              </kbd>
            </div>

            {/* Mobile Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-zinc-900/60 border border-white/10 text-zinc-400 hover:text-white transition-colors"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Direct Messages Drawer Button */}
            <button
              onClick={() => setDmDrawerOpen(true)}
              className="p-2 rounded-xl bg-zinc-900/80 border border-white/10 text-zinc-300 hover:text-white hover:border-white/20 transition-colors"
              title="Direct Messages"
            >
              <MessageSquare className="w-4 h-4 text-violet-400" />
            </button>

            {/* Notification Center Dropdown */}
            <NotificationCenter />

            {/* User Auth Profile Dropdown */}
            <div className="flex items-center gap-2">
              {!isLoading && !isAuthenticated && (
                <>
                  <Link href="/sign-in">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl px-3"
                    >
                      Log in
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button
                      size="sm"
                      className="text-xs font-semibold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-xl px-3.5 shadow-lg shadow-violet-600/30 border border-violet-400/30 transition-all hover:scale-105"
                    >
                      Sign up
                    </Button>
                  </Link>
                </>
              )}

              {!isLoading && isAuthenticated && user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1.5 p-1 rounded-full hover:bg-white/5 transition-colors outline-none focus:ring-1 focus:ring-violet-500">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-purple-800 border border-violet-500/40 flex items-center justify-center text-white text-xs font-bold overflow-hidden relative shadow-md">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            fill
                            className="object-cover"
                            unoptimized={user.avatar.includes("dicebear") || user.avatar.endsWith(".svg")}
                          />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border border-white/10 text-white shadow-2xl p-1.5 rounded-2xl">
                    <DropdownMenuLabel className="font-normal px-3 py-2">
                      <div className="flex flex-col space-y-0.5">
                        <p className="text-sm font-semibold text-white leading-none">{user.name}</p>
                        <p className="text-xs text-zinc-400 leading-none truncate">@{user.username || "reader"}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />

                    <DropdownMenuItem asChild className="focus:bg-violet-950/60 focus:text-violet-200 cursor-pointer rounded-xl">
                      <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-xs">
                        <UserIcon className="w-4 h-4 text-violet-400" />
                        My Profile & Badges
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="focus:bg-violet-950/60 focus:text-violet-200 cursor-pointer rounded-xl">
                      <Link href="/bookmarks" className="flex items-center gap-2 px-3 py-2 text-xs">
                        <Bookmark className="w-4 h-4 text-violet-400" />
                        My Bookmarks
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="focus:bg-violet-950/60 focus:text-violet-200 cursor-pointer rounded-xl">
                      <Link href="/schedule" className="flex items-center gap-2 px-3 py-2 text-xs">
                        <Calendar className="w-4 h-4 text-violet-400" />
                        Reading Schedule
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="focus:bg-violet-950/60 focus:text-violet-200 cursor-pointer rounded-xl">
                      <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-xs">
                        <Settings className="w-4 h-4 text-violet-400" />
                        Settings
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="text-rose-400 focus:bg-rose-950/30 focus:text-rose-300 cursor-pointer px-3 py-2 text-xs rounded-xl"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-white/10 bg-[#07090e] px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-150">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "bg-violet-600 text-white font-bold"
                      : "text-zinc-300 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Global Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-2xl bg-zinc-950/95 border-white/10 text-white backdrop-blur-2xl p-0 overflow-hidden shadow-2xl rounded-3xl">
          <form onSubmit={handleSearchSubmit} className="p-4 border-b border-white/10 flex items-center gap-3">
            <Search className="w-5 h-5 text-violet-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search novels, authors, folklore, sci-fi..."
              autoFocus
              className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          <div className="max-h-80 overflow-y-auto p-4 space-y-2">
            {searchQuery.trim() && searchResults.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-6">
                No novels found for &quot;{searchQuery}&quot;.
              </p>
            ) : (
              searchResults.map((novel) => {
                const sourceBadge =
                  novel.source === "gutenberg"
                    ? { label: "Gutenberg", color: "text-cyan-400 bg-cyan-950/60" }
                    : novel.source === "openlibrary"
                    ? { label: "Open Library", color: "text-amber-400 bg-amber-950/60" }
                    : novel.source === "googlebooks"
                    ? { label: "Google Books", color: "text-blue-400 bg-blue-950/60" }
                    : { label: "Original", color: "text-violet-400 bg-violet-950/60" };

                return (
                  <Link
                    key={novel.slug}
                    href={`/novels/${novel.slug}`}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-zinc-900/60 border border-white/5 hover:border-violet-500/40 transition-all text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={novel.coverUrl || "/assets/mood-epic-adventure.jpg"}
                        alt={novel.title}
                        className="w-10 h-14 object-cover rounded-lg border border-white/10"
                      />
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className={cn("text-[9px] px-1.5 py-0.5 rounded font-bold uppercase", sourceBadge.color)}>
                            {sourceBadge.label}
                          </span>
                          <p className="font-bold text-white truncate">{novel.title}</p>
                        </div>
                        <p className="text-[11px] text-zinc-400">by {novel.author?.name || "Author"}</p>
                        <span className="text-[10px] text-violet-400">
                          {novel.genres?.map((g) => g.name).join(", ")}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] text-zinc-400 font-mono shrink-0">
                      {novel.chapterCount ? `${novel.chapterCount} Chs` : "1 Work"}
                    </span>
                  </Link>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Direct Messages Drawer */}
      <DirectMessagesDrawer
        isOpen={dmDrawerOpen}
        onClose={() => setDmDrawerOpen(false)}
      />
    </>
  );
}

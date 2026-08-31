"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/novelverse/navbar";
import { Footer } from "@/components/novelverse/footer";
import { Button } from "@/components/ui/button";
import { SEED_NOVELS } from "@/lib/seed-data";
import {
  getLocalStatsOverview,
  trackReadingProgress,
  type LocalReadingProgressItem,
  type LocalLibraryItem,
} from "@/lib/client-reading-tracker";
import {
  getHighlights,
  getNotes,
  type ReaderHighlight,
  type ReaderNote,
} from "@/lib/reader-storage";
import {
  getFriends,
  type FriendUser,
} from "@/lib/social-store";
import {
  type UserStatsOverview,
} from "@/lib/user-stats";
import { StreakTrackerCard } from "@/components/novelverse/gamification/streak-tracker-card";
import { XpLevelBadge } from "@/components/novelverse/gamification/xp-level-badge";
import { AchievementsGrid } from "@/components/novelverse/gamification/achievements-grid";
import { FriendsActivityFeed } from "@/components/novelverse/social/friends-activity-feed";
import { FriendRecommendations } from "@/components/novelverse/social/friend-recommendations";
import { DirectMessagesDrawer } from "@/components/novelverse/social/direct-messages-drawer";
import {
  Flame,
  BookOpen,
  Clock,
  Trophy,
  Award,
  Edit3,
  Heart,
  ChevronRight,
  X,
  Zap,
  Users,
  MessageSquare,
  FileText,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProfileTabItem {
  id: "overview" | "reading" | "achievements" | "friends" | "highlights" | "activity";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = React.useState<
    "overview" | "reading" | "achievements" | "friends" | "highlights" | "activity"
  >("overview");

  // Real-time statistics state
  const [statsData, setStatsData] = React.useState<UserStatsOverview | null>(null);
  const [currentlyReading, setCurrentlyReading] = React.useState<LocalReadingProgressItem[]>([]);
  const [, setLibraryItems] = React.useState<LocalLibraryItem[]>([]);
  const [, setFavoriteNovels] = React.useState<LocalLibraryItem[]>([]);
  const [userHighlights, setUserHighlights] = React.useState<ReaderHighlight[]>([]);
  const [userNotes, setUserNotes] = React.useState<ReaderNote[]>([]);
  const [friendsList, setFriendsList] = React.useState<FriendUser[]>([]);
  const [isDataLoading, setIsDataLoading] = React.useState(true);

  // Edit Profile Modal State
  const [isEditing, setIsEditing] = React.useState(false);
  const [editName, setEditName] = React.useState("");
  const [editBio, setEditBio] = React.useState("");
  const [editAvatar, setEditAvatar] = React.useState("");
  const [selectedGenres, setSelectedGenres] = React.useState<string[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isSimulating, setIsSimulating] = React.useState(false);
  const [dmDrawerOpen, setDmDrawerOpen] = React.useState(false);
  const [selectedFriendId, setSelectedFriendId] = React.useState<string | undefined>();

  // Load profile data
  const loadProfileStats = React.useCallback(async () => {
    try {
      if (isAuthenticated) {
        const res = await fetch("/api/user/profile", {
          headers: { "Cache-Control": "no-cache" },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.stats) {
            setStatsData(data.stats);
            setCurrentlyReading(data.currentlyReading || []);
            setLibraryItems(data.libraryItems || []);
            setFavoriteNovels(data.favoriteNovels || []);
            setIsDataLoading(false);
            return;
          }
        }
      }

      const local = getLocalStatsOverview();
      setStatsData(local.stats);
      setCurrentlyReading(local.currentlyReading);
      setLibraryItems(local.libraryItems);
      setFavoriteNovels(local.favoriteNovels);
    } catch {
      const local = getLocalStatsOverview();
      setStatsData(local.stats);
      setCurrentlyReading(local.currentlyReading);
      setLibraryItems(local.libraryItems);
      setFavoriteNovels(local.favoriteNovels);
    } finally {
      setUserHighlights(getHighlights());
      setUserNotes(getNotes());
      setFriendsList(getFriends());
      setIsDataLoading(false);
    }
  }, [isAuthenticated]);

  React.useEffect(() => {
    loadProfileStats();
  }, [loadProfileStats]);

  React.useEffect(() => {
    if (user) {
      setEditName(user.name || "");
      setEditBio(user.bio || "");
      setEditAvatar(user.avatar || "");
      setSelectedGenres(user.favoriteGenres?.length ? user.favoriteGenres : ["African Stories", "Fantasy", "Mystery"]);
    }
  }, [user]);

  const currentUser = user || {
    id: "guest-id",
    name: "Mohammed",
    username: "mohammedreads",
    email: "mohammed@novelverse.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "READER",
    bio: "Voracious reader of African mythology, epic folklore, and dark mysteries 🌌✨",
    favoriteGenres: selectedGenres.length ? selectedGenres : ["African Stories", "Fantasy", "Mystery"],
    followersCount: 142,
    followingCount: 38,
    novelsReadCount: statsData?.novelsReadCount || 24,
    readingStreakDays: statsData?.activeStreak || 18,
    lastActiveAt: new Date(),
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setIsEditing(false);
      toast.info("Profile updated in session!");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          bio: editBio,
          avatar: editAvatar,
          favoriteGenres: selectedGenres,
        }),
      });

      if (res.ok) {
        await refreshUser();
        setIsEditing(false);
        toast.success("Profile saved successfully!");
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSimulateReading = async () => {
    setIsSimulating(true);
    const targetNovel = SEED_NOVELS[0];
    try {
      await trackReadingProgress({
        novelSlug: targetNovel.slug,
        novelTitle: targetNovel.title,
        novelCoverUrl: targetNovel.coverUrl,
        authorName: targetNovel.author.name,
        totalChapters: targetNovel.chapterCount || 10,
        chapterNumber: 1,
        position: 85,
        timeIncrementSeconds: 900,
        completed: true,
      });

      await loadProfileStats();
      if (isAuthenticated) {
        await refreshUser();
      }
      toast.success("⚡ Session logged: +15m reading time & 1 chapter completed (+20 XP)!");
    } catch {
      toast.error("Failed to log session");
    } finally {
      setIsSimulating(false);
    }
  };

  if (authLoading && isDataLoading) {
    return (
      <div className="min-h-screen bg-black text-white selection:bg-violet-600/30 selection:text-white flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-16 animate-pulse space-y-6">
          <div className="h-48 rounded-3xl bg-zinc-900/60" />
          <div className="flex items-center gap-6">
            <div className="w-28 h-28 rounded-full bg-zinc-800 -mt-14 ring-4 ring-black" />
            <div className="space-y-2 flex-1">
              <div className="h-6 w-48 bg-zinc-800 rounded-lg" />
              <div className="h-4 w-32 bg-zinc-800/60 rounded-lg" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const profileTabs: ProfileTabItem[] = [
    { id: "overview", label: "Overview", icon: Trophy },
    { id: "reading", label: "Reading & Library", icon: BookOpen, count: currentlyReading.length },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "friends", label: "Friends", icon: Users, count: friendsList.filter((f) => f.friendshipStatus === "friends").length },
    { id: "highlights", label: "Highlights & Notes", icon: FileText, count: userHighlights.length + userNotes.length },
    { id: "activity", label: "Activity", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-violet-600/30 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-1 pb-24">
        {/* Profile Hero Header (Module 19) */}
        <section className="relative pt-12 pb-8 border-b border-white/5 bg-gradient-to-b from-zinc-950 via-zinc-950/80 to-black">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* User Avatar & Info */}
              <div className="flex items-center gap-5">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-violet-500/40 shadow-2xl shadow-violet-950/50 bg-zinc-900">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-400 ring-2 ring-zinc-950" />
                </div>

                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-white truncate">
                      {currentUser.name}
                    </h1>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400 bg-violet-950/80 px-2 py-0.5 rounded-full border border-violet-500/30">
                      Reader
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 font-mono">
                    @{currentUser.username || "reader"}
                  </p>

                  <p className="text-xs text-zinc-300 max-w-md line-clamp-2 leading-relaxed">
                    {currentUser.bio}
                  </p>

                  {/* 3 Key Stats Pills (Module 19) */}
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                    <span className="flex items-center gap-1 text-violet-400 font-bold">
                      <BookOpen className="w-3.5 h-3.5" /> {currentUser.novelsReadCount} Novels
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Flame className="w-3.5 h-3.5 fill-current" /> {currentUser.readingStreakDays} Day Streak
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="flex items-center gap-1 text-rose-400 font-bold">
                      <Heart className="w-3.5 h-3.5 fill-current" /> 3.4K Likes
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  onClick={handleSimulateReading}
                  disabled={isSimulating}
                  variant="outline"
                  className="rounded-2xl border-white/10 bg-zinc-900/60 hover:bg-zinc-800 text-xs font-bold py-5"
                >
                  <Zap className="w-4 h-4 mr-1.5 text-amber-400" />
                  {isSimulating ? "Logging..." : "Log Reading (+XP)"}
                </Button>

                <Button
                  onClick={() => setIsEditing(true)}
                  className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-xs font-bold py-5 shadow-lg shadow-violet-600/30"
                >
                  <Edit3 className="w-4 h-4 mr-1.5" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Profile Tabs Navigation */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
            {profileTabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap",
                    isSelected
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                      : "bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="text-[10px] bg-black/40 px-2 py-0.2 rounded-full font-mono">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6">
                  <StreakTrackerCard />
                </div>
                <div className="lg:col-span-6">
                  <XpLevelBadge totalXp={640} />
                </div>
              </div>

              <AchievementsGrid />
            </div>
          )}

          {/* TAB 2: READING & LIBRARY */}
          {activeTab === "reading" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">
                  Currently Reading Stories ({currentlyReading.length > 0 ? currentlyReading.length : 3})
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(currentlyReading.length > 0
                  ? currentlyReading
                  : SEED_NOVELS.slice(0, 3).map((n) => ({
                      novelSlug: n.slug,
                      novelTitle: n.title,
                      novelCoverUrl: n.coverUrl,
                      authorName: n.author.name,
                      totalChapters: n.chapterCount,
                      chapterNumber: 2,
                      percentage: 65,
                      position: 65,
                      completed: false,
                      timeSpentSeconds: 900,
                      lastReadAt: new Date().toISOString(),
                    }))
                ).map((item: LocalReadingProgressItem) => (
                  <div
                    key={item.novelSlug}
                    className="p-4 rounded-3xl bg-zinc-900/60 border border-white/5 flex items-center gap-3.5"
                  >
                    <img
                      src={item.novelCoverUrl}
                      alt={item.novelTitle}
                      className="w-14 h-20 object-cover rounded-xl border border-white/10 shrink-0"
                    />
                    <div className="min-w-0 space-y-1">
                      <h4 className="text-xs font-bold text-white truncate">{item.novelTitle}</h4>
                      <p className="text-[10px] text-zinc-400 truncate">by {item.authorName}</p>
                      <div className="w-32 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-violet-500 h-full rounded-full"
                          style={{ width: `${item.percentage || 50}%` }}
                        />
                      </div>
                      <Link
                        href={`/read/${item.novelSlug}/${item.chapterNumber || 1}`}
                        className="inline-flex items-center gap-1 text-[11px] text-violet-400 font-bold hover:underline pt-1"
                      >
                        Resume Ch.{item.chapterNumber || 1} <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ACHIEVEMENTS */}
          {activeTab === "achievements" && (
            <AchievementsGrid />
          )}

          {/* TAB 4: FRIENDS & COMMUNITY */}
          {activeTab === "friends" && (
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-violet-400" />
                    My Friends ({friendsList.filter((f) => f.friendshipStatus === "friends").length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {friendsList
                    .filter((f) => f.friendshipStatus === "friends")
                    .map((friend) => (
                      <div
                        key={friend.id}
                        className="p-4 rounded-3xl bg-zinc-900/60 border border-white/5 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={friend.avatar}
                            alt={friend.name}
                            className="w-10 h-10 rounded-full object-cover border border-white/10"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate">{friend.name}</h4>
                            <p className="text-[10px] text-zinc-400 truncate">@{friend.username}</p>
                            <span className="text-[10px] text-amber-400 font-bold">
                              🔥 {friend.streakDays}d streak
                            </span>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedFriendId(friend.id);
                            setDmDrawerOpen(true);
                          }}
                          className="rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold"
                        >
                          <MessageSquare className="w-3.5 h-3.5 mr-1" /> Message
                        </Button>
                      </div>
                    ))}
                </div>
              </div>

              <FriendRecommendations />
            </div>
          )}

          {/* TAB 5: HIGHLIGHTS & NOTES */}
          {activeTab === "highlights" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Highlights */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Saved Highlights ({userHighlights.length})
                </h3>

                {userHighlights.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-6 text-center bg-zinc-950 border border-white/5 rounded-2xl">
                    No highlights yet. Select text in any chapter to highlight!
                  </p>
                ) : (
                  userHighlights.map((hl) => (
                    <div
                      key={hl.id}
                      className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-1.5 text-xs"
                    >
                      <span className="text-[10px] font-bold text-violet-400 uppercase">
                        Chapter {hl.chapterNumber}
                      </span>
                      <p className="italic text-zinc-200 border-l-2 border-amber-400 pl-2.5">
                        &quot;{hl.selectedText}&quot;
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Notes */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-violet-400" />
                  Personal Margin Notes ({userNotes.length})
                </h3>

                {userNotes.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-6 text-center bg-zinc-950 border border-white/5 rounded-2xl">
                    No notes yet. Select text in the reader and tap &quot;Add Note&quot;.
                  </p>
                ) : (
                  userNotes.map((nt) => (
                    <div
                      key={nt.id}
                      className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-1.5 text-xs"
                    >
                      <span className="text-[10px] font-bold text-violet-400 uppercase">
                        Chapter {nt.chapterNumber} Note
                      </span>
                      <p className="text-white font-medium bg-white/5 p-2 rounded-xl">
                        {nt.noteText}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 6: ACTIVITY FEED */}
          {activeTab === "activity" && (
            <div className="max-w-2xl mx-auto">
              <FriendsActivityFeed maxItems={6} />
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Direct Messages Drawer */}
      <DirectMessagesDrawer
        isOpen={dmDrawerOpen}
        onClose={() => setDmDrawerOpen(false)}
        selectedFriendId={selectedFriendId}
      />

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Edit Reader Profile</h3>
              <button onClick={() => setIsEditing(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Bio
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="rounded-xl text-xs">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving} className="rounded-xl bg-violet-600 text-xs font-bold">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/novelverse/navbar";
import { Footer } from "@/components/novelverse/footer";
import { Button } from "@/components/ui/button";
import {
  Settings as SettingsIcon,
  User as UserIcon,
  BookOpen,
  Bell,
  Shield,
  Check,
  Save,
  Loader2,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
];

export default function SettingsPage() {
  const { user, isAuthenticated, signOut, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = React.useState<
    "profile" | "reading" | "notifications" | "security"
  >("profile");

  // Profile fields
  const [name, setName] = React.useState(user?.name || "Reader");
  const [bio, setBio] = React.useState(user?.bio || "");
  const [avatar, setAvatar] = React.useState(
    user?.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=Felix"
  );

  // Reading preferences
  const [fontSize, setFontSize] = React.useState("medium");
  const [readerTheme, setReaderTheme] = React.useState("dark");
  const [autoBookmark, setAutoBookmark] = React.useState(true);

  // Notifications
  const [notifyChapters, setNotifyChapters] = React.useState(true);
  const [notifyStreak, setNotifyStreak] = React.useState(true);

  const [isSaving, setIsSaving] = React.useState(false);
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setBio(user.bio || "");
      if (user.avatar) setAvatar(user.avatar);
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      if (isAuthenticated) {
        await fetch("/api/user/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, bio, avatar }),
        });
        await refreshUser();
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-violet-600/30 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-1 pb-24">
        {/* Header */}
        <section className="pt-8 pb-6 border-b border-white/5 bg-zinc-950/60">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <SettingsIcon className="w-6 h-6 text-violet-400" />
              Account & Reading Settings
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Customize your profile, reading interface preferences, and notification alerts.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Sidebar Navigation */}
            <aside className="md:col-span-4 space-y-1.5 bg-zinc-950 border border-white/10 p-3 rounded-2xl">
              {[
                { id: "profile", label: "Profile & Identity", icon: UserIcon },
                { id: "reading", label: "Reading Preferences", icon: BookOpen },
                { id: "notifications", label: "Notifications", icon: Bell },
                { id: "security", label: "Account & Security", icon: Shield },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all text-left",
                      isActive
                        ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-zinc-400")} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}

              <div className="pt-3 mt-3 border-t border-white/5">
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/30 transition-all text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </aside>

            {/* Main Form Content */}
            <div className="md:col-span-8 bg-zinc-950 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
              <form onSubmit={handleSave} className="space-y-6">
                {/* TAB 1: PROFILE */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-base font-bold text-white">Public Profile</h2>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        This information will be displayed to other readers and authors across NovelVerse.
                      </p>
                    </div>

                    {/* Avatar selection */}
                    <div className="space-y-2.5">
                      <label className="text-xs font-semibold text-zinc-300">Avatar</label>
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-violet-500 shadow-md">
                          <Image
                            src={avatar}
                            alt="Current Avatar"
                            fill
                            className="object-cover"
                            unoptimized={avatar.includes("dicebear") || avatar.endsWith(".svg")}
                          />
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                          {AVATAR_PRESETS.map((preset, idx) => (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => setAvatar(preset)}
                              className={cn(
                                "relative w-10 h-10 rounded-xl overflow-hidden border transition-all shrink-0",
                                avatar === preset
                                  ? "border-violet-400 ring-2 ring-violet-500/50"
                                  : "border-white/10 opacity-70 hover:opacity-100"
                              )}
                            >
                              <Image
                                src={preset}
                                alt="Preset"
                                fill
                                className="object-cover"
                                unoptimized={preset.includes("dicebear") || preset.endsWith(".svg")}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Display Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">Display Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder:text-zinc-500 text-sm focus:border-violet-500 focus:outline-none"
                      />
                    </div>

                    {/* Username (Read only) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">Username</label>
                      <input
                        type="text"
                        disabled
                        value={user ? `@${user.username}` : "@guest_reader"}
                        className="w-full h-11 px-3.5 rounded-xl bg-zinc-900/50 border border-white/5 text-zinc-400 text-sm cursor-not-allowed"
                      />
                    </div>

                    {/* Bio */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">Reader Bio</label>
                      <textarea
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell the community what stories you love..."
                        className="w-full p-3 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder:text-zinc-500 text-sm focus:border-violet-500 focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 2: READING PREFERENCES */}
                {activeTab === "reading" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-base font-bold text-white">Reading Preferences</h2>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Customize how chapter text appears for maximum comfort.
                      </p>
                    </div>

                    {/* Theme */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-300">Reader Theme</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: "dark", label: "OLED Pitch Dark", bg: "bg-black text-white" },
                          { id: "dim", label: "Midnight Slate", bg: "bg-zinc-900 text-zinc-200" },
                          { id: "sepia", label: "Warm Sepia", bg: "bg-[#2d2822] text-[#f4ecd8]" },
                        ].map((theme) => (
                          <button
                            type="button"
                            key={theme.id}
                            onClick={() => setReaderTheme(theme.id)}
                            className={cn(
                              "p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all",
                              theme.bg,
                              readerTheme === theme.id
                                ? "border-violet-500 ring-2 ring-violet-500/30"
                                : "border-white/10"
                            )}
                          >
                            <span>{theme.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font Size */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-300">Default Font Size</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: "small", label: "Compact (14px)" },
                          { id: "medium", label: "Default (16px)" },
                          { id: "large", label: "Large (18px)" },
                        ].map((sz) => (
                          <button
                            type="button"
                            key={sz.id}
                            onClick={() => setFontSize(sz.id)}
                            className={cn(
                              "p-3 rounded-xl border text-xs font-semibold transition-all",
                              fontSize === sz.id
                                ? "border-violet-500 bg-violet-950/40 text-violet-300"
                                : "border-white/10 bg-zinc-900 text-zinc-400"
                            )}
                          >
                            {sz.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Toggle auto-bookmark */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/60 border border-white/5">
                      <div>
                        <div className="text-xs font-bold text-white">Auto-Bookmark Scroll Position</div>
                        <div className="text-[11px] text-zinc-400">
                          Automatically save exact scroll point when switching chapters.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAutoBookmark(!autoBookmark)}
                        className={cn(
                          "w-11 h-6 rounded-full transition-colors relative flex items-center p-1",
                          autoBookmark ? "bg-violet-600" : "bg-zinc-800"
                        )}
                      >
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full bg-white transition-transform",
                            autoBookmark ? "translate-x-5" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 3: NOTIFICATIONS */}
                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-base font-bold text-white">Notification Alerts</h2>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Manage when and how you receive updates.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/60 border border-white/5">
                        <div>
                          <div className="text-xs font-bold text-white">New Chapter Releases</div>
                          <div className="text-[11px] text-zinc-400">
                            Get alerted when followed authors publish new chapters.
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNotifyChapters(!notifyChapters)}
                          className={cn(
                            "w-11 h-6 rounded-full transition-colors relative flex items-center p-1",
                            notifyChapters ? "bg-violet-600" : "bg-zinc-800"
                          )}
                        >
                          <div
                            className={cn(
                              "w-4 h-4 rounded-full bg-white transition-transform",
                              notifyChapters ? "translate-x-5" : "translate-x-0"
                            )}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/60 border border-white/5">
                        <div>
                          <div className="text-xs font-bold text-white">Daily Streak Reminders</div>
                          <div className="text-[11px] text-zinc-400">
                            Receive a reminder before midnight if your reading streak is at risk.
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNotifyStreak(!notifyStreak)}
                          className={cn(
                            "w-11 h-6 rounded-full transition-colors relative flex items-center p-1",
                            notifyStreak ? "bg-violet-600" : "bg-zinc-800"
                          )}
                        >
                          <div
                            className={cn(
                              "w-4 h-4 rounded-full bg-white transition-transform",
                              notifyStreak ? "translate-x-5" : "translate-x-0"
                            )}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: SECURITY */}
                {activeTab === "security" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-base font-bold text-white">Account & Authentication</h2>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Manage your account credentials and security preferences.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-400">Account Type</span>
                        <span className="text-xs font-bold text-violet-300 bg-violet-950/80 px-2.5 py-0.5 rounded-full border border-violet-500/30">
                          {user?.role || "READER"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-400">Registered Email</span>
                        <span className="text-xs font-semibold text-white">
                          {user?.email || "reader@novelverse.com"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save button & feedback */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  {savedSuccess ? (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> Preferences saved successfully!
                    </span>
                  ) : (
                    <span />
                  )}

                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-semibold rounded-xl px-6 h-10 shadow-lg shadow-violet-600/30 flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

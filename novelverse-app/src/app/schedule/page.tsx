"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Plus,
  Play,
  CheckCircle2,
  Bell,
  BellOff,
  Trash2,
  Sparkles,
  BookOpen,
  Zap,
  ChevronRight,
  Flame,
  X,
  Target,
  Coffee,
  Moon,
  Sun,
} from "lucide-react";
import { Navbar } from "@/components/novelverse/navbar";
import { Footer } from "@/components/novelverse/footer";
import { Button } from "@/components/ui/button";
import { SEED_NOVELS } from "@/lib/seed-data";
import {
  getReadingSchedule,
  addScheduleSlot,
  deleteScheduleSlot,
  updateScheduleSlot,
  markSlotCompletedToday,
  getTodayDayOfWeek,
  type ReadingScheduleSlot,
  type DayOfWeek,
} from "@/lib/schedule-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const DAYS_OF_WEEK: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ROUTINE_PRESETS = [
  {
    title: "Morning Focus",
    icon: Sun,
    time: "07:30",
    duration: 15,
    chapters: 1,
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"] as DayOfWeek[],
    description: "Start the morning with 15 minutes of uninterrupted story immersion.",
  },
  {
    title: "Lunch Break",
    icon: Coffee,
    time: "12:45",
    duration: 20,
    chapters: 1,
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"] as DayOfWeek[],
    description: "Unwind mid-day with a quick chapter during your lunch pause.",
  },
  {
    title: "Bedtime Story",
    icon: Moon,
    time: "21:30",
    duration: 30,
    chapters: 2,
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as DayOfWeek[],
    description: "Wind down peacefully before sleep with 2 deep lore chapters.",
  },
  {
    title: "Weekend Deep Dive",
    icon: Sparkles,
    time: "14:00",
    duration: 60,
    chapters: 4,
    days: ["Sat", "Sun"] as DayOfWeek[],
    description: "Binge high-stakes climax chapters and theory discussions.",
  },
];

export default function SchedulePage() {
  const [scheduleSlots, setScheduleSlots] = React.useState<ReadingScheduleSlot[]>([]);
  const [selectedDay, setSelectedDay] = React.useState<DayOfWeek>(getTodayDayOfWeek());
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  // Modal Form State
  const [formNovelSlug, setFormNovelSlug] = React.useState(SEED_NOVELS[0].slug);
  const [formDays, setFormDays] = React.useState<DayOfWeek[]>(["Mon", "Wed", "Fri"]);
  const [formTime, setFormTime] = React.useState("20:30");
  const [formDuration, setFormDuration] = React.useState(30);
  const [formChapters, setFormChapters] = React.useState(2);
  const [formReminder, setFormReminder] = React.useState(true);
  const [formNote, setFormNote] = React.useState("");

  const todayDay = getTodayDayOfWeek();
  const todayStr = new Date().toISOString().split("T")[0];

  const loadSlots = React.useCallback(() => {
    setScheduleSlots(getReadingSchedule());
  }, []);

  React.useEffect(() => {
    loadSlots();
    const handleUpdate = () => loadSlots();
    window.addEventListener("novelverse:schedule-updated", handleUpdate);
    return () => window.removeEventListener("novelverse:schedule-updated", handleUpdate);
  }, [loadSlots]);

  const slotsForSelectedDay = scheduleSlots.filter((slot) =>
    slot.daysOfWeek.includes(selectedDay)
  );

  const todaysSlots = scheduleSlots.filter((slot) =>
    slot.daysOfWeek.includes(todayDay)
  );

  const completedTodayCount = todaysSlots.filter(
    (s) => s.lastCompletedDate === todayStr
  ).length;

  const handleToggleDay = (day: DayOfWeek) => {
    setFormDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSelectAllDays = () => {
    if (formDays.length === 7) {
      setFormDays([]);
    } else {
      setFormDays([...DAYS_OF_WEEK]);
    }
  };

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (formDays.length === 0) {
      toast.error("Please select at least one day for your reading schedule");
      return;
    }

    const selectedNovel = SEED_NOVELS.find((n) => n.slug === formNovelSlug) || SEED_NOVELS[0];

    addScheduleSlot({
      novelSlug: selectedNovel.slug,
      novelTitle: selectedNovel.title,
      novelCoverUrl: selectedNovel.coverUrl,
      authorName: selectedNovel.author.name,
      daysOfWeek: formDays,
      time: formTime,
      durationMinutes: formDuration,
      targetChapters: formChapters,
      reminderEnabled: formReminder,
      reminderNote: formNote.trim() || undefined,
    });

    setIsAddModalOpen(false);
    toast.success(`Reading schedule created for "${selectedNovel.title}"! 🎉`);
  };

  const handleApplyPreset = (preset: (typeof ROUTINE_PRESETS)[0]) => {
    setFormTime(preset.time);
    setFormDuration(preset.duration);
    setFormChapters(preset.chapters);
    setFormDays(preset.days);
    setFormNote(preset.title);
    setIsAddModalOpen(true);
  };

  const handleToggleReminder = (slotId: string, current: boolean) => {
    updateScheduleSlot(slotId, { reminderEnabled: !current });
    toast.info(!current ? "Reminder notifications enabled!" : "Reminder disabled.");
  };

  const handleDelete = (slotId: string, title: string) => {
    deleteScheduleSlot(slotId);
    toast.info(`Schedule for "${title}" removed.`);
  };

  const handleMarkComplete = (slotId: string) => {
    markSlotCompletedToday(slotId);
    toast.success("Reading session completed! +25 XP & Streak saved! 🔥");
  };

  // Calculate total weekly planned reading time
  const totalWeeklyMinutes = scheduleSlots.reduce((acc, slot) => {
    return acc + slot.durationMinutes * slot.daysOfWeek.length;
  }, 0);

  return (
    <div className="min-h-screen bg-[#07090e] text-white selection:bg-violet-600/30 selection:text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pb-24 pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-600/30 text-white">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
                    Reading Schedule
                  </h1>
                  <p className="text-xs text-zinc-400 font-medium">
                    Build your daily reading habit, set reminders, and conquer story arcs with focused routine slots.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-6 py-5 rounded-2xl shadow-xl shadow-violet-600/30 flex items-center gap-2 text-xs"
              >
                <Plus className="w-4 h-4" />
                Schedule Reading Time
              </Button>
            </div>
          </div>

          {/* Top Quick Stats & Routine Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-zinc-950/80 border border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Flame className="w-6 h-6 fill-amber-400" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Today&apos;s Goal
                </span>
                <p className="text-lg font-black text-white">
                  {completedTodayCount} / {todaysSlots.length} Sessions
                </p>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-zinc-950/80 border border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Weekly Commitment
                </span>
                <p className="text-lg font-black text-white">
                  {Math.floor(totalWeeklyMinutes / 60)}h {totalWeeklyMinutes % 60}m / week
                </p>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-zinc-950/80 border border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Target className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Active Routines
                </span>
                <p className="text-lg font-black text-white">
                  {scheduleSlots.length} Novels Scheduled
                </p>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-zinc-950/80 border border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Zap className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  XP Habit Multiplier
                </span>
                <p className="text-lg font-black text-indigo-300">
                  1.5x Streak Boost
                </p>
              </div>
            </div>
          </div>

          {/* Quick Routine Presets Row */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                Quick Habit Presets (1-Click Setup)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {ROUTINE_PRESETS.map((preset) => {
                const Icon = preset.icon;
                return (
                  <button
                    key={preset.title}
                    onClick={() => handleApplyPreset(preset)}
                    className="p-4 rounded-3xl bg-zinc-950/60 border border-white/5 hover:border-violet-500/40 hover:bg-zinc-900/80 text-left transition-all group flex flex-col justify-between space-y-3 shadow-lg"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-9 h-9 rounded-xl bg-violet-950/60 border border-violet-800/40 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-lg border border-white/5">
                        {preset.time} • {preset.duration}m
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors">
                        {preset.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>

                    <span className="text-[10px] text-violet-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Use Preset <ChevronRight className="w-3 h-3" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Weekly Interactive Schedule Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Weekly Schedule Calendar
              </span>
            </div>

            {/* Day Tabs (Mon - Sun) */}
            <div className="grid grid-cols-7 gap-2">
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = selectedDay === day;
                const isToday = todayDay === day;
                const count = scheduleSlots.filter((s) => s.daysOfWeek.includes(day)).length;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={cn(
                      "p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 relative overflow-hidden",
                      isSelected
                        ? "bg-violet-600 text-white border-violet-400 shadow-xl shadow-violet-600/30 font-bold"
                        : "bg-zinc-950/70 text-zinc-400 hover:text-white hover:bg-zinc-900 border-white/10"
                    )}
                  >
                    {isToday && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                    <span className="text-xs uppercase tracking-wider">{day}</span>
                    <span
                      className={cn(
                        "text-[10px] px-2 py-0.2 rounded-full font-mono font-bold",
                        isSelected ? "bg-white/20 text-white" : "bg-zinc-900 text-zinc-400"
                      )}
                    >
                      {count} {count === 1 ? "slot" : "slots"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Schedule Slot Cards for Selected Day */}
            <div className="space-y-3">
              {slotsForSelectedDay.length === 0 ? (
                <div className="text-center py-16 bg-zinc-950/40 border border-white/5 rounded-3xl space-y-3">
                  <Calendar className="w-8 h-8 mx-auto text-zinc-600" />
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    No reading time scheduled for <strong>{selectedDay}</strong> yet. Tap &quot;Schedule Reading Time&quot; above to set your goal!
                  </p>
                </div>
              ) : (
                slotsForSelectedDay.map((slot) => {
                  const isDoneToday = slot.lastCompletedDate === todayStr;

                  return (
                    <div
                      key={slot.id}
                      className={cn(
                        "p-5 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl",
                        isDoneToday
                          ? "bg-emerald-950/20 border-emerald-500/30"
                          : "bg-zinc-950/80 border-white/10 hover:border-violet-500/40 hover:bg-zinc-900/90"
                      )}
                    >
                      {/* Left: Novel Thumbnail & Schedule Time */}
                      <div className="flex items-center gap-4 min-w-0">
                        <img
                          src={slot.novelCoverUrl}
                          alt={slot.novelTitle}
                          className="w-14 h-20 rounded-2xl object-cover border border-white/10 shrink-0"
                        />

                        <div className="min-w-0 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-black text-violet-300 bg-violet-950/80 px-2.5 py-0.5 rounded-full border border-violet-500/30 font-mono">
                              ⏰ {slot.time} ({slot.durationMinutes} mins)
                            </span>
                            <span className="text-[10px] font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-full border border-white/5">
                              Target: {slot.targetChapters} chs
                            </span>
                            {slot.reminderNote && (
                              <span className="text-[10px] text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-500/30">
                                {slot.reminderNote}
                              </span>
                            )}
                          </div>

                          <h3 className="text-base font-bold text-white truncate">
                            {slot.novelTitle}
                          </h3>

                          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                            <span>Days:</span>
                            {slot.daysOfWeek.map((d) => (
                              <span
                                key={d}
                                className={cn(
                                  "px-1.5 py-0.5 rounded text-[9px] font-bold",
                                  d === selectedDay
                                    ? "bg-violet-600 text-white"
                                    : "bg-zinc-900 text-zinc-400 border border-white/5"
                                )}
                              >
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                        {/* Start Reading Focus Button */}
                        <Link href={`/read/${slot.novelSlug}/1`}>
                          <Button className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-xs font-bold px-6 py-5 shadow-lg shadow-violet-600/30 flex items-center gap-2">
                            <Play className="w-4 h-4 fill-current" />
                            Start Reading Now
                          </Button>
                        </Link>

                        {/* Mark Completed Button */}
                        <Button
                          variant="outline"
                          onClick={() => handleMarkComplete(slot.id)}
                          className={cn(
                            "rounded-2xl text-xs font-bold py-5 transition-all",
                            isDoneToday
                              ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-300"
                              : "border-white/10 bg-zinc-900/60 hover:bg-zinc-800 text-white"
                          )}
                        >
                          <CheckCircle2 className={cn("w-4 h-4 mr-1.5", isDoneToday ? "text-emerald-400" : "text-zinc-500")} />
                          {isDoneToday ? "Completed Today ✓" : "Mark as Done"}
                        </Button>

                        {/* Toggle Reminder Notification */}
                        <button
                          onClick={() => handleToggleReminder(slot.id, slot.reminderEnabled)}
                          className={cn(
                            "p-3 rounded-2xl border transition-colors",
                            slot.reminderEnabled
                              ? "bg-violet-950/60 border-violet-500/40 text-violet-300"
                              : "bg-zinc-900 border-white/10 text-zinc-500 hover:text-white"
                          )}
                          title={slot.reminderEnabled ? "Reminder on" : "Reminder off"}
                        >
                          {slot.reminderEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                        </button>

                        {/* Delete Slot */}
                        <button
                          onClick={() => handleDelete(slot.id, slot.novelTitle)}
                          className="p-3 rounded-2xl bg-zinc-900 border border-white/10 text-zinc-500 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                          title="Delete Schedule"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* ============================================================
          ADD READING SCHEDULE MODAL
          ============================================================ */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-zinc-950 border border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-violet-950/80 border border-violet-800/40 text-violet-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Schedule Reading Time</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSlot} className="space-y-5">
              {/* Novel Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Select Novel
                </label>
                <select
                  value={formNovelSlug}
                  onChange={(e) => setFormNovelSlug(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-violet-500"
                >
                  {SEED_NOVELS.map((novel) => (
                    <option key={novel.slug} value={novel.slug} className="bg-zinc-950">
                      {novel.title} ({novel.author.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Days of Week Selector */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Repeat Days
                  </label>
                  <button
                    type="button"
                    onClick={handleSelectAllDays}
                    className="text-[11px] text-violet-400 hover:underline font-semibold"
                  >
                    {formDays.length === 7 ? "Deselect All" : "Everyday"}
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected = formDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleToggleDay(day)}
                        className={cn(
                          "py-2.5 rounded-xl text-xs font-bold transition-all border",
                          isSelected
                            ? "bg-violet-600 text-white border-violet-400 shadow-md shadow-violet-600/30"
                            : "bg-zinc-900/80 text-zinc-400 hover:text-white border-white/5"
                        )}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time & Duration Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Preferred Time
                  </label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Duration (Minutes)
                  </label>
                  <select
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={20}>20 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>1 Hour</option>
                    <option value={90}>1.5 Hours</option>
                  </select>
                </div>
              </div>

              {/* Target Chapters Goal */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Target Chapter Goal per Session
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 5].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setFormChapters(count)}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all",
                        formChapters === count
                          ? "bg-violet-600 text-white border-violet-400 shadow-md shadow-violet-600/30"
                          : "bg-zinc-900 text-zinc-400 hover:text-white border-white/5"
                      )}
                    >
                      {count} {count === 1 ? "Chapter" : "Chapters"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Routine Tag / Note */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Routine Name / Note (Optional)
                </label>
                <input
                  type="text"
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  placeholder="e.g. Evening Bedtime Folklore Dive"
                  className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* Reminder Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/60 border border-white/5">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-white">Browser Alert Reminder</p>
                  <p className="text-[11px] text-zinc-400">Receive a gentle reminder 5 minutes before scheduled start time</p>
                </div>
                <input
                  type="checkbox"
                  checked={formReminder}
                  onChange={(e) => setFormReminder(e.target.checked)}
                  className="w-4 h-4 accent-violet-600 rounded cursor-pointer"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-2xl text-xs px-5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-xs font-bold px-6 py-5 shadow-lg shadow-violet-600/30"
                >
                  Save Schedule Slot (+XP)
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

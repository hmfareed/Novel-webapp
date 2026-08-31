"use client";

export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface ReadingScheduleSlot {
  id: string;
  novelSlug: string;
  novelTitle: string;
  novelCoverUrl: string;
  authorName: string;
  daysOfWeek: DayOfWeek[];
  time: string; // e.g. "20:30" (24h format)
  durationMinutes: number; // e.g. 30
  targetChapters: number; // e.g. 2
  reminderEnabled: boolean;
  reminderNote?: string;
  lastCompletedDate?: string; // YYYY-MM-DD
  createdAt: string;
}

const SCHEDULE_STORAGE_KEY = "novelverse_reading_schedule_v1";

const DEFAULT_SCHEDULE_SLOTS: ReadingScheduleSlot[] = [
  {
    id: "slot_1",
    novelSlug: "sundiata-lion-of-mali",
    novelTitle: "Sundiata: Lion of Mali",
    novelCoverUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=800&auto=format&fit=crop",
    authorName: "Djeli Mamadou Kouyaté",
    daysOfWeek: ["Mon", "Wed", "Fri", "Sun"],
    time: "20:30",
    durationMinutes: 30,
    targetChapters: 2,
    reminderEnabled: true,
    reminderNote: "Evening epic folklore routine",
    createdAt: new Date().toISOString(),
  },
  {
    id: "slot_2",
    novelSlug: "the-adventures-of-sherlock-holmes",
    novelTitle: "The Adventures of Sherlock Holmes",
    novelCoverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
    authorName: "Arthur Conan Doyle",
    daysOfWeek: ["Tue", "Thu", "Sat"],
    time: "22:00",
    durationMinutes: 45,
    targetChapters: 1,
    reminderEnabled: true,
    reminderNote: "Bedtime mystery deduction session",
    createdAt: new Date().toISOString(),
  },
  {
    id: "slot_3",
    novelSlug: "the-time-machine",
    novelTitle: "The Time Machine",
    novelCoverUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    authorName: "H.G. Wells",
    daysOfWeek: ["Sat", "Sun"],
    time: "10:30",
    durationMinutes: 60,
    targetChapters: 3,
    reminderEnabled: false,
    reminderNote: "Weekend Sci-Fi exploration",
    createdAt: new Date().toISOString(),
  },
];

export function getReadingSchedule(): ReadingScheduleSlot[] {
  if (typeof window === "undefined") return DEFAULT_SCHEDULE_SLOTS;
  try {
    const raw = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(DEFAULT_SCHEDULE_SLOTS));
      return DEFAULT_SCHEDULE_SLOTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SCHEDULE_SLOTS;
  }
}

export function saveReadingSchedule(slots: ReadingScheduleSlot[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(slots));
    window.dispatchEvent(new CustomEvent("novelverse:schedule-updated", { detail: slots }));
  } catch (err) {
    console.error("Failed to save schedule:", err);
  }
}

export function addScheduleSlot(slot: Omit<ReadingScheduleSlot, "id" | "createdAt">): ReadingScheduleSlot {
  const current = getReadingSchedule();
  const newSlot: ReadingScheduleSlot = {
    ...slot,
    id: `slot_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newSlot, ...current];
  saveReadingSchedule(updated);
  return newSlot;
}

export function updateScheduleSlot(id: string, updates: Partial<ReadingScheduleSlot>): void {
  const current = getReadingSchedule();
  const updated = current.map((s) => (s.id === id ? { ...s, ...updates } : s));
  saveReadingSchedule(updated);
}

export function deleteScheduleSlot(id: string): void {
  const current = getReadingSchedule();
  const updated = current.filter((s) => s.id !== id);
  saveReadingSchedule(updated);
}

export function markSlotCompletedToday(id: string): void {
  const todayStr = new Date().toISOString().split("T")[0];
  updateScheduleSlot(id, { lastCompletedDate: todayStr });
}

export function getTodayDayOfWeek(): DayOfWeek {
  const days: DayOfWeek[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[new Date().getDay()];
}

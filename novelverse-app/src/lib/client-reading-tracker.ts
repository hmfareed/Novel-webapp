/**
 * NovelVerse — Client Reading Tracker & Local Fallback
 * Handles heartbeat syncing, idle detection, scroll progress,
 * and seamless fallback for unauthenticated users.
 */

import {
  calculateStreak,
  getWeekCalendar,
  formatReadingTime,
  evaluateBadges,
  calculateLevelProgress,
  formatDateKey,
  type ReadingDayRecord,
  type UserStatsOverview,
} from "./user-stats";

export interface LocalReadingProgressItem {
  novelSlug: string;
  novelTitle: string;
  novelCoverUrl: string;
  authorName: string;
  totalChapters: number;
  chapterNumber: number;
  position: number;
  percentage: number;
  completed: boolean;
  timeSpentSeconds: number;
  lastReadAt: string;
}

export interface LocalLibraryItem {
  novelSlug: string;
  novelTitle: string;
  novelCoverUrl: string;
  authorName: string;
  rating: number;
  chapterCount: number;
  status: "READING" | "WANT_TO_READ" | "COMPLETED" | "DOWNLOADED" | "BOOKMARKED";
  isFavorite: boolean;
  addedAt: string;
}

const STORAGE_KEYS = {
  ACTIVITIES: "novelverse_activities",
  TOTAL_SECONDS: "novelverse_total_seconds",
  CHAPTERS_COUNT: "novelverse_chapters_count",
  PROGRESS: "novelverse_reading_progress",
  LIBRARY: "novelverse_library",
  FAVORITES: "novelverse_favorites",
};

/**
 * Get guest/local stats from localStorage
 */
export function getLocalStatsOverview(): {
  stats: UserStatsOverview;
  currentlyReading: LocalReadingProgressItem[];
  libraryItems: LocalLibraryItem[];
  favoriteNovels: LocalLibraryItem[];
} {
  if (typeof window === "undefined") {
    const emptyWeek = getWeekCalendar([]);
    const emptyBadges = evaluateBadges({
      currentStreak: 0,
      longestStreak: 0,
      totalReadingTimeSeconds: 0,
      chaptersReadCount: 0,
      novelsReadCount: 0,
      libraryCount: 0,
      readingActivity: [],
    });
    return {
      stats: {
        activeStreak: 0,
        longestStreak: 0,
        readToday: false,
        novelsReadCount: 0,
        chaptersReadCount: 0,
        totalReadingTimeSeconds: 0,
        readingTimeDisplay: "0 mins",
        badgesUnlockedCount: 0,
        totalBadgesCount: emptyBadges.length,
        weekCalendar: emptyWeek,
        badges: emptyBadges,
        levelInfo: calculateLevelProgress(0, 0),
      },
      currentlyReading: [],
      libraryItems: [],
      favoriteNovels: [],
    };
  }

  let activities: ReadingDayRecord[] = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (raw) activities = JSON.parse(raw);
  } catch {
    activities = [];
  }

  const totalSeconds = parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_SECONDS) || "0", 10);
  const chaptersCount = parseInt(localStorage.getItem(STORAGE_KEYS.CHAPTERS_COUNT) || "0", 10);

  let progressList: LocalReadingProgressItem[] = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (raw) progressList = JSON.parse(raw);
  } catch {
    progressList = [];
  }

  let libraryItems: LocalLibraryItem[] = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LIBRARY);
    if (raw) libraryItems = JSON.parse(raw);
  } catch {
    libraryItems = [];
  }

  const favoriteNovels = libraryItems.filter((i) => i.isFavorite);

  const streakResult = calculateStreak(activities);
  const weekCalendar = getWeekCalendar(activities);
  const badges = evaluateBadges({
    currentStreak: streakResult.currentStreak,
    longestStreak: streakResult.longestStreak,
    totalReadingTimeSeconds: totalSeconds,
    chaptersReadCount: chaptersCount,
    novelsReadCount: progressList.length,
    libraryCount: libraryItems.length,
    readingActivity: activities,
  });

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return {
    stats: {
      activeStreak: streakResult.currentStreak,
      longestStreak: streakResult.longestStreak,
      readToday: streakResult.readToday,
      novelsReadCount: progressList.length,
      chaptersReadCount: chaptersCount,
      totalReadingTimeSeconds: totalSeconds,
      readingTimeDisplay: formatReadingTime(totalSeconds),
      badgesUnlockedCount: unlockedCount,
      totalBadgesCount: badges.length,
      weekCalendar,
      badges,
      levelInfo: calculateLevelProgress(totalSeconds, chaptersCount),
    },
    currentlyReading: progressList,
    libraryItems,
    favoriteNovels,
  };
}

/**
 * Record reading progress both locally and to API (if logged in)
 */
export async function trackReadingProgress(data: {
  novelSlug: string;
  novelTitle?: string;
  novelCoverUrl?: string;
  authorName?: string;
  totalChapters?: number;
  chapterNumber: number;
  position: number;
  timeIncrementSeconds: number;
  completed?: boolean;
}): Promise<void> {
  const {
    novelSlug,
    novelTitle = novelSlug,
    novelCoverUrl = "",
    authorName = "NovelVerse Author",
    totalChapters = 10,
    chapterNumber,
    position,
    timeIncrementSeconds,
    completed = false,
  } = data;

  // 1. Update localStorage
  if (typeof window !== "undefined") {
    try {
      // Activities & streak
      const rawAct = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      const activities: ReadingDayRecord[] = rawAct ? JSON.parse(rawAct) : [];
      const todayKey = formatDateKey(new Date());
      const dayIdx = activities.findIndex((a) => a.date === todayKey);

      if (dayIdx >= 0) {
        activities[dayIdx].seconds += timeIncrementSeconds;
        if (completed) activities[dayIdx].chaptersRead += 1;
        activities[dayIdx].lastReadAt = new Date().toISOString();
      } else {
        activities.push({
          date: todayKey,
          seconds: timeIncrementSeconds,
          chaptersRead: completed ? 1 : 0,
          lastReadAt: new Date().toISOString(),
        });
      }
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));

      // Total seconds
      const currentSeconds = parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_SECONDS) || "0", 10);
      localStorage.setItem(STORAGE_KEYS.TOTAL_SECONDS, String(currentSeconds + timeIncrementSeconds));

      // Chapters read
      if (completed) {
        const currentChapters = parseInt(localStorage.getItem(STORAGE_KEYS.CHAPTERS_COUNT) || "0", 10);
        localStorage.setItem(STORAGE_KEYS.CHAPTERS_COUNT, String(currentChapters + 1));
      }

      // Progress items
      const rawProg = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      const progList: LocalReadingProgressItem[] = rawProg ? JSON.parse(rawProg) : [];
      const progIdx = progList.findIndex((p) => p.novelSlug === novelSlug);

      const overallPercentage = Math.min(
        100,
        Math.round(((chapterNumber - 1 + position / 100) / Math.max(1, totalChapters)) * 100)
      );

      const updatedProgressItem: LocalReadingProgressItem = {
        novelSlug,
        novelTitle,
        novelCoverUrl,
        authorName,
        totalChapters,
        chapterNumber,
        position,
        percentage: overallPercentage,
        completed: completed || overallPercentage >= 100,
        timeSpentSeconds: ((progIdx >= 0 ? progList[progIdx].timeSpentSeconds : 0) || 0) + timeIncrementSeconds,
        lastReadAt: new Date().toISOString(),
      };

      if (progIdx >= 0) {
        progList[progIdx] = updatedProgressItem;
      } else {
        progList.unshift(updatedProgressItem);
      }
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progList));

      // Auto-add to local library
      const rawLib = localStorage.getItem(STORAGE_KEYS.LIBRARY);
      const libList: LocalLibraryItem[] = rawLib ? JSON.parse(rawLib) : [];
      if (!libList.some((i) => i.novelSlug === novelSlug)) {
        libList.unshift({
          novelSlug,
          novelTitle,
          novelCoverUrl,
          authorName,
          rating: 4.8,
          chapterCount: totalChapters,
          status: "READING",
          isFavorite: false,
          addedAt: new Date().toISOString(),
        });
        localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(libList));
      }
    } catch (err) {
      console.warn("Failed to write reading progress to localStorage", err);
    }
  }

  // 2. Call API route (fire-and-forget / non-blocking)
  try {
    await fetch("/api/user/reading-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        novelSlug,
        chapterNumber,
        position,
        timeIncrementSeconds,
        completed,
      }),
    });
  } catch {
    // Silently continue (guest or offline)
  }
}

/**
 * Toggle favorite or library status
 */
export async function toggleLocalLibraryFavorite(novel: {
  slug: string;
  title: string;
  coverUrl: string;
  authorName: string;
  rating?: number;
  chapterCount?: number;
}): Promise<boolean> {
  let isFav = false;
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.LIBRARY);
      const libList: LocalLibraryItem[] = raw ? JSON.parse(raw) : [];
      const item = libList.find((i) => i.novelSlug === novel.slug);

      if (item) {
        item.isFavorite = !item.isFavorite;
        isFav = item.isFavorite;
      } else {
        isFav = true;
        libList.unshift({
          novelSlug: novel.slug,
          novelTitle: novel.title,
          novelCoverUrl: novel.coverUrl,
          authorName: novel.authorName,
          rating: novel.rating || 4.8,
          chapterCount: novel.chapterCount || 10,
          status: "READING",
          isFavorite: true,
          addedAt: new Date().toISOString(),
        });
      }
      localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(libList));
    } catch (e) {
      console.warn("Failed to toggle favorite locally", e);
    }
  }

  try {
    await fetch("/api/user/library", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        novelSlug: novel.slug,
        isFavorite: isFav,
      }),
    });
  } catch {
    // Ignore error for offline / guest
  }

  return isFav;
}

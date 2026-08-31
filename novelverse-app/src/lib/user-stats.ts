/**
 * NovelVerse — Real-Time User Statistics, Streaks 2.0 & XP/Level Engine
 * Accurately calculates streaks, recovery shields, reading time, 7-day activity calendars,
 * XP levels (1 to 100), and comprehensive badges/achievements.
 */

export interface ReadingDayRecord {
  date: string; // "YYYY-MM-DD"
  seconds: number;
  chaptersRead: number;
  lastReadAt?: Date | string;
}

export interface WeekDayStatus {
  dayName: string; // "Mon", "Tue", "Wed", etc.
  dayNumber: number; // 1 to 31
  date: string; // "YYYY-MM-DD"
  isToday: boolean;
  isPast: boolean;
  completed: boolean;
  seconds: number;
  chaptersRead: number;
}

export interface CalculatedStreak {
  currentStreak: number;
  longestStreak: number;
  readToday: boolean;
  readYesterday: boolean;
  lastActiveDate: string | null;
  hasStreakShield: boolean;
  streakType: "daily" | "chapter" | "friend" | "guild";
}

export interface DynamicBadge {
  id: string;
  category: "reading" | "exploration" | "social" | "dedication" | "rare";
  title: string;
  description: string;
  iconName: string; // "Flame" | "BookOpen" | "Clock" | "Bookmark" | "Star" | "Trophy" | "Sparkles" | "Users" | "Globe" | "Award"
  color: string;
  unlocked: boolean;
  unlockedAt: string | null;
  progress: string;
  progressPercent: number;
}

export interface LevelInfo {
  level: number;
  title: string;
  currentXp: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
  nextTitle: string;
}

export interface UserStatsOverview {
  activeStreak: number;
  longestStreak: number;
  readToday: boolean;
  novelsReadCount: number;
  chaptersReadCount: number;
  totalReadingTimeSeconds: number;
  readingTimeDisplay: string;
  badgesUnlockedCount: number;
  totalBadgesCount: number;
  weekCalendar: WeekDayStatus[];
  badges: DynamicBadge[];
  levelInfo: LevelInfo;
}

/**
 * Format a Date object into local YYYY-MM-DD string
 */
export function formatDateKey(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Given a date, subtract or add days
 */
export function addDays(d: Date, days: number): Date {
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Calculate XP and Level progression (Level 1 to 100)
 */
export function calculateLevelInfo(totalXp: number): LevelInfo {
  // XP formula: Level = Math.floor(Math.sqrt(totalXp / 25)) + 1, capped at 100
  const level = Math.min(100, Math.max(1, Math.floor(Math.sqrt(totalXp / 25)) + 1));
  
  const xpForCurrentLevel = (level - 1) * (level - 1) * 25;
  const xpForNextLevel = level * level * 25;
  const xpInCurrentLevel = totalXp - xpForCurrentLevel;
  const xpSpan = Math.max(1, xpForNextLevel - xpForCurrentLevel);
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpSpan) * 100)));

  const getRankTitle = (lvl: number): string => {
    if (lvl >= 100) return "NovelVerse Legend";
    if (lvl >= 80) return "Grand Mythmaker";
    if (lvl >= 50) return "Story Master";
    if (lvl >= 30) return "Devoted Bookworm";
    if (lvl >= 20) return "Story Lover";
    if (lvl >= 10) return "Story Seeker";
    if (lvl >= 5) return "Book Explorer";
    return "New Reader";
  };

  const getNextRankTitle = (lvl: number): string => {
    if (lvl >= 80) return "NovelVerse Legend";
    if (lvl >= 50) return "Grand Mythmaker";
    if (lvl >= 30) return "Story Master";
    if (lvl >= 20) return "Devoted Bookworm";
    if (lvl >= 10) return "Story Lover";
    if (lvl >= 5) return "Story Seeker";
    return "Book Explorer";
  };

  return {
    level,
    title: getRankTitle(level),
    currentXp: totalXp,
    xpForCurrentLevel,
    xpForNextLevel,
    progressPercent,
    nextTitle: getNextRankTitle(level),
  };
}

/**
 * Accurately calculates consecutive active reading days (Streaks 2.0)
 */
export function calculateStreak(activities: ReadingDayRecord[]): CalculatedStreak {
  if (!activities || activities.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      readToday: false,
      readYesterday: false,
      lastActiveDate: null,
      hasStreakShield: true,
      streakType: "daily",
    };
  }

  const activeDateSet = new Set<string>();
  for (const act of activities) {
    if (act.seconds >= 10 || act.chaptersRead >= 1) {
      activeDateSet.add(act.date);
    }
  }

  const now = new Date();
  const todayKey = formatDateKey(now);
  const yesterdayKey = formatDateKey(addDays(now, -1));

  const readToday = activeDateSet.has(todayKey);
  const readYesterday = activeDateSet.has(yesterdayKey);

  let currentStreak = 0;

  if (readToday) {
    currentStreak = 1;
    let checkDate = addDays(now, -1);
    while (activeDateSet.has(formatDateKey(checkDate))) {
      currentStreak++;
      checkDate = addDays(checkDate, -1);
    }
  } else if (readYesterday) {
    currentStreak = 1;
    let checkDate = addDays(now, -2);
    while (activeDateSet.has(formatDateKey(checkDate))) {
      currentStreak++;
      checkDate = addDays(checkDate, -1);
    }
  } else {
    currentStreak = 0;
  }

  const sortedDates = Array.from(activeDateSet).sort();
  let longestStreak = 0;
  let runningStreak = 0;
  let prevDate: Date | null = null;

  for (const dStr of sortedDates) {
    const [y, m, d] = dStr.split("-").map(Number);
    const currDate = new Date(y, m - 1, d);

    if (prevDate) {
      const diffMs = currDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        runningStreak++;
      } else if (diffDays > 1) {
        runningStreak = 1;
      }
    } else {
      runningStreak = 1;
    }

    if (runningStreak > longestStreak) {
      longestStreak = runningStreak;
    }
    prevDate = currDate;
  }

  longestStreak = Math.max(longestStreak, currentStreak);

  return {
    currentStreak,
    longestStreak,
    readToday,
    readYesterday,
    lastActiveDate: sortedDates.length > 0 ? sortedDates[sortedDates.length - 1] : null,
    hasStreakShield: true,
    streakType: "daily",
  };
}

/**
 * Generates the current week's 7-day calendar (Monday through Sunday)
 */
export function getWeekCalendar(activities: ReadingDayRecord[] = []): WeekDayStatus[] {
  const activityMap = new Map<string, ReadingDayRecord>();
  for (const act of activities) {
    activityMap.set(act.date, act);
  }

  const now = new Date();
  const todayKey = formatDateKey(now);

  const currentDayOfWeek = now.getDay();
  const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const monday = addDays(now, distanceToMonday);

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const week: WeekDayStatus[] = [];

  for (let i = 0; i < 7; i++) {
    const dayDate = addDays(monday, i);
    const dateKey = formatDateKey(dayDate);
    const act = activityMap.get(dateKey);

    const seconds = act?.seconds || 0;
    const chaptersRead = act?.chaptersRead || 0;
    const completed = seconds >= 10 || chaptersRead >= 1;
    const isToday = dateKey === todayKey;
    const isPast = dayDate.getTime() < new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    week.push({
      dayName: dayNames[i],
      dayNumber: dayDate.getDate(),
      date: dateKey,
      isToday,
      isPast,
      completed,
      seconds,
      chaptersRead,
    });
  }

  return week;
}

/**
 * Format reading time nicely for UI display
 */
export function formatReadingTime(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return "0 mins";

  const totalMinutes = Math.floor(totalSeconds / 60);
  if (totalMinutes < 60) {
    return `${Math.max(1, totalMinutes)} mins`;
  }

  const hours = (totalSeconds / 3600).toFixed(1);
  return `${hours.replace(/\.0$/, "")} hrs`;
}

/**
 * Dynamically evaluate badge milestones based on live metrics
 */
export function evaluateBadges(params: {
  currentStreak: number;
  longestStreak: number;
  totalReadingTimeSeconds: number;
  chaptersReadCount: number;
  novelsReadCount: number;
  libraryCount: number;
  readingActivity: ReadingDayRecord[];
  unlockedBadgeIds?: string[];
}): DynamicBadge[] {
  const {
    currentStreak,
    longestStreak,
    totalReadingTimeSeconds,
    chaptersReadCount,
    novelsReadCount,
    libraryCount,
    readingActivity,
    unlockedBadgeIds = [],
  } = params;

  const effectiveStreak = Math.max(currentStreak, longestStreak);
  const unlockedSet = new Set(unlockedBadgeIds);

  let nightSessionsCount = 0;
  for (const act of readingActivity) {
    if (act.lastReadAt) {
      const d = new Date(act.lastReadAt);
      const hour = d.getHours();
      if (hour >= 0 && hour < 5) {
        nightSessionsCount++;
      }
    }
  }

  const BADGE_DEFINITIONS: Array<{
    id: string;
    category: "reading" | "exploration" | "social" | "dedication" | "rare";
    title: string;
    description: string;
    iconName: string;
    color: string;
    target: number;
    current: number;
    unit: string;
    isUnlocked: boolean;
  }> = [
    {
      id: "streak_7",
      category: "dedication",
      title: "Fire Within",
      description: "Maintained a 7-day reading streak",
      iconName: "Flame",
      color: "from-amber-500 to-orange-600",
      target: 7,
      current: effectiveStreak,
      unit: "Days",
      isUnlocked: effectiveStreak >= 7,
    },
    {
      id: "streak_30",
      category: "dedication",
      title: "Eternal Spark",
      description: "Maintained a 30-day uninterrupted reading streak",
      iconName: "Flame",
      color: "from-red-500 to-amber-600",
      target: 30,
      current: effectiveStreak,
      unit: "Days",
      isUnlocked: effectiveStreak >= 30,
    },
    {
      id: "first_chapter",
      category: "reading",
      title: "First Step",
      description: "Finished your first chapter on NovelVerse",
      iconName: "BookOpen",
      color: "from-emerald-500 to-teal-600",
      target: 1,
      current: chaptersReadCount,
      unit: "Chapter",
      isUnlocked: chaptersReadCount >= 1,
    },
    {
      id: "first_novel",
      category: "reading",
      title: "Bookworm Initiate",
      description: "Read 5 full novel chapters",
      iconName: "BookOpen",
      color: "from-violet-500 to-purple-600",
      target: 5,
      current: chaptersReadCount,
      unit: "Chapters",
      isUnlocked: chaptersReadCount >= 5,
    },
    {
      id: "century_reader",
      category: "reading",
      title: "Century Scholar",
      description: "Completed 100 chapters across the platform",
      iconName: "Award",
      color: "from-yellow-400 to-amber-600",
      target: 100,
      current: chaptersReadCount,
      unit: "Chapters",
      isUnlocked: chaptersReadCount >= 100,
    },
    {
      id: "night_owl",
      category: "exploration",
      title: "Midnight Reader",
      description: "Read past midnight for 3 reading sessions",
      iconName: "Clock",
      color: "from-blue-500 to-indigo-600",
      target: 3,
      current: nightSessionsCount,
      unit: "Nights",
      isUnlocked: nightSessionsCount >= 3,
    },
    {
      id: "novel_collector",
      category: "exploration",
      title: "Grand Archivist",
      description: "Saved 10 or more novels to your library",
      iconName: "Bookmark",
      color: "from-emerald-500 to-teal-600",
      target: 10,
      current: libraryCount,
      unit: "Saved",
      isUnlocked: libraryCount >= 10,
    },
    {
      id: "time_weaver",
      category: "dedication",
      title: "Time Weaver",
      description: "Accumulated 1 hour of total reading time",
      iconName: "Clock",
      color: "from-cyan-500 to-blue-600",
      target: 60,
      current: Math.floor(totalReadingTimeSeconds / 60),
      unit: "Mins",
      isUnlocked: totalReadingTimeSeconds >= 3600,
    },
    {
      id: "social_reader",
      category: "social",
      title: "Kindred Spirit",
      description: "Connected with friends and shared story reactions",
      iconName: "Users",
      color: "from-pink-500 to-rose-600",
      target: 1,
      current: 1,
      unit: "Friend",
      isUnlocked: true,
    },
    {
      id: "vip_status",
      category: "rare",
      title: "Verse Champion",
      description: "Reached top reader status (10+ chapters or 2+ hrs)",
      iconName: "Trophy",
      color: "from-yellow-400 to-amber-600",
      target: 10,
      current: chaptersReadCount,
      unit: "Chapters",
      isUnlocked: chaptersReadCount >= 10 || totalReadingTimeSeconds >= 7200 || novelsReadCount >= 3,
    },
  ];

  return BADGE_DEFINITIONS.map((def) => {
    const unlocked = def.isUnlocked || unlockedSet.has(def.id);
    const progressVal = Math.min(def.current, def.target);
    const percent = def.target > 0 ? Math.min(100, Math.round((progressVal / def.target) * 100)) : 100;

    return {
      id: def.id,
      category: def.category,
      title: def.title,
      description: def.description,
      iconName: def.iconName,
      color: def.color,
      unlocked,
      unlockedAt: unlocked ? new Date().toISOString() : null,
      progress: unlocked ? "Unlocked" : `${progressVal}/${def.target} ${def.unit}`,
      progressPercent: percent,
    };
  });
}

/**
 * Calculate user level progress and title from reading metrics
 */
export function calculateLevelProgress(totalSeconds: number = 0, chaptersRead: number = 0): LevelInfo {
  const currentXp = Math.floor(totalSeconds / 10) + chaptersRead * 50;
  const level = Math.max(1, Math.min(100, Math.floor(currentXp / 500) + 1));
  const xpForCurrentLevel = (level - 1) * 500;
  const xpForNextLevel = level * 500;
  const progressPercent = Math.min(100, Math.round(((currentXp - xpForCurrentLevel) / 500) * 100));

  const TITLES = [
    "Novice Reader",
    "Avid Scholar",
    "Tale Explorer",
    "Lore Master",
    "Grand Archivist",
    "Verse Champion",
  ];
  const title = TITLES[Math.min(TITLES.length - 1, Math.floor((level - 1) / 5))];
  const nextTitle = TITLES[Math.min(TITLES.length - 1, Math.floor(level / 5))];

  return {
    level,
    title,
    currentXp,
    xpForCurrentLevel,
    xpForNextLevel,
    progressPercent,
    nextTitle,
  };
}


"use client";

// Types for Reader Storage
export type ReaderTheme = "amoled" | "dark" | "sepia" | "paper";
export type ReaderFontFamily = "serif" | "sans" | "dyslexic" | "mono";
export type ReaderFontSize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl";
export type ReaderLineHeight = "tight" | "normal" | "relaxed" | "loose";
export type ReaderWidth = "narrow" | "normal" | "wide" | "full";
export type ReaderAlign = "left" | "justify";

export interface ReaderSettings {
  theme: ReaderTheme;
  fontFamily: ReaderFontFamily;
  fontSize: ReaderFontSize;
  lineHeight: ReaderLineHeight;
  readerWidth: ReaderWidth;
  textAlign: ReaderAlign;
  paragraphSpacing: "normal" | "spacious";
  speechRate: number; // 0.75 to 2.0
  speechPitch: number; // 0.8 to 1.2
  speechVoiceName?: string;
  autoScrollSpeed: number; // 0 = off, 1-5
}

export interface ReaderHighlight {
  id: string;
  novelSlug: string;
  chapterNumber: number;
  selectedText: string;
  color: "yellow" | "emerald" | "violet" | "coral";
  createdAt: string;
  paragraphIndex?: number;
}

export interface ReaderNote {
  id: string;
  novelSlug: string;
  chapterNumber: number;
  selectedText: string;
  noteText: string;
  createdAt: string;
  paragraphIndex?: number;
}

export interface ReaderBookmark {
  id: string;
  novelSlug: string;
  novelTitle: string;
  chapterNumber: number;
  chapterTitle: string;
  snippet: string;
  scrollPercentage: number;
  createdAt: string;
}

export interface OfflineChapter {
  novelSlug: string;
  chapterNumber: number;
  title: string;
  content: string;
  wordCount: number;
  savedAt: string;
}

export interface OfflineNovel {
  slug: string;
  title: string;
  coverUrl: string;
  authorName: string;
  totalChapters: number;
  downloadedChapters: number[];
  downloadedAt: string;
}

export interface ChapterReactionCounts {
  love: number;
  fire: number;
  tears: number;
  shock: number;
  laugh: number;
  mindblown: number;
}

const STORAGE_KEYS = {
  SETTINGS: "novelverse_reader_settings",
  HIGHLIGHTS: "novelverse_reader_highlights",
  NOTES: "novelverse_reader_notes",
  BOOKMARKS: "novelverse_reader_bookmarks",
  OFFLINE_NOVELS: "novelverse_offline_novels",
  OFFLINE_CHAPTERS: "novelverse_offline_chapters",
  REACTIONS: "novelverse_chapter_reactions",
  USER_REACTIONS: "novelverse_user_reactions",
};

export const DEFAULT_READER_SETTINGS: ReaderSettings = {
  theme: "amoled",
  fontFamily: "serif",
  fontSize: "lg",
  lineHeight: "relaxed",
  readerWidth: "normal",
  textAlign: "left",
  paragraphSpacing: "normal",
  speechRate: 1.0,
  speechPitch: 1.0,
  autoScrollSpeed: 0,
};

// Helpers
function getJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota fallback
  }
}

// 1. Reader Settings
export function getReaderSettings(): ReaderSettings {
  return getJson<ReaderSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_READER_SETTINGS);
}

export function saveReaderSettings(settings: Partial<ReaderSettings>): ReaderSettings {
  const current = getReaderSettings();
  const updated = { ...current, ...settings };
  setJson(STORAGE_KEYS.SETTINGS, updated);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("novelverse:reader-settings-changed", { detail: updated }));
  }
  return updated;
}

// 2. Highlights
export function getHighlights(novelSlug?: string, chapterNumber?: number): ReaderHighlight[] {
  const all = getJson<ReaderHighlight[]>(STORAGE_KEYS.HIGHLIGHTS, []);
  if (!novelSlug) return all;
  if (chapterNumber === undefined) return all.filter((h) => h.novelSlug === novelSlug);
  return all.filter((h) => h.novelSlug === novelSlug && h.chapterNumber === chapterNumber);
}

export function addHighlight(highlight: Omit<ReaderHighlight, "id" | "createdAt">): ReaderHighlight {
  const all = getHighlights();
  const item: ReaderHighlight = {
    ...highlight,
    id: `hl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  all.unshift(item);
  setJson(STORAGE_KEYS.HIGHLIGHTS, all);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("novelverse:highlight-added", { detail: item }));
  }
  return item;
}

export function deleteHighlight(id: string): void {
  const all = getHighlights().filter((h) => h.id !== id);
  setJson(STORAGE_KEYS.HIGHLIGHTS, all);
}

// 3. Notes
export function getNotes(novelSlug?: string, chapterNumber?: number): ReaderNote[] {
  const all = getJson<ReaderNote[]>(STORAGE_KEYS.NOTES, []);
  if (!novelSlug) return all;
  if (chapterNumber === undefined) return all.filter((n) => n.novelSlug === novelSlug);
  return all.filter((n) => n.novelSlug === novelSlug && n.chapterNumber === chapterNumber);
}

export function addNote(note: Omit<ReaderNote, "id" | "createdAt">): ReaderNote {
  const all = getNotes();
  const item: ReaderNote = {
    ...note,
    id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  all.unshift(item);
  setJson(STORAGE_KEYS.NOTES, all);
  return item;
}

export function deleteNote(id: string): void {
  const all = getNotes().filter((n) => n.id !== id);
  setJson(STORAGE_KEYS.NOTES, all);
}

// 4. Bookmarks
export function getBookmarks(novelSlug?: string): ReaderBookmark[] {
  const all = getJson<ReaderBookmark[]>(STORAGE_KEYS.BOOKMARKS, []);
  if (!novelSlug) return all;
  return all.filter((b) => b.novelSlug === novelSlug);
}

export function isChapterBookmarked(novelSlug: string, chapterNumber: number): boolean {
  return getBookmarks(novelSlug).some((b) => b.chapterNumber === chapterNumber);
}

export function toggleBookmark(bookmark: Omit<ReaderBookmark, "id" | "createdAt">): {
  isBookmarked: boolean;
  bookmark?: ReaderBookmark;
} {
  const all = getBookmarks();
  const existingIdx = all.findIndex(
    (b) => b.novelSlug === bookmark.novelSlug && b.chapterNumber === bookmark.chapterNumber
  );

  if (existingIdx >= 0) {
    all.splice(existingIdx, 1);
    setJson(STORAGE_KEYS.BOOKMARKS, all);
    return { isBookmarked: false };
  } else {
    const item: ReaderBookmark = {
      ...bookmark,
      id: `bm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    all.unshift(item);
    setJson(STORAGE_KEYS.BOOKMARKS, all);
    return { isBookmarked: true, bookmark: item };
  }
}

export function deleteBookmark(id: string): void {
  const all = getBookmarks().filter((b) => b.id !== id);
  setJson(STORAGE_KEYS.BOOKMARKS, all);
}

// 5. Offline Storage
export function getOfflineNovels(): OfflineNovel[] {
  return getJson<OfflineNovel[]>(STORAGE_KEYS.OFFLINE_NOVELS, []);
}

export function getOfflineChapters(novelSlug: string): OfflineChapter[] {
  const all = getJson<OfflineChapter[]>(STORAGE_KEYS.OFFLINE_CHAPTERS, []);
  return all.filter((c) => c.novelSlug === novelSlug);
}

export function saveChapterOffline(
  novel: { slug: string; title: string; coverUrl: string; authorName: string; totalChapters: number },
  chapter: { chapterNumber: number; title: string; content: string; wordCount: number }
): void {
  const chapters = getJson<OfflineChapter[]>(STORAGE_KEYS.OFFLINE_CHAPTERS, []);
  const existingChapterIdx = chapters.findIndex(
    (c) => c.novelSlug === novel.slug && c.chapterNumber === chapter.chapterNumber
  );
  const chapterData: OfflineChapter = {
    novelSlug: novel.slug,
    chapterNumber: chapter.chapterNumber,
    title: chapter.title,
    content: chapter.content,
    wordCount: chapter.wordCount,
    savedAt: new Date().toISOString(),
  };

  if (existingChapterIdx >= 0) {
    chapters[existingChapterIdx] = chapterData;
  } else {
    chapters.push(chapterData);
  }
  setJson(STORAGE_KEYS.OFFLINE_CHAPTERS, chapters);

  const novels = getOfflineNovels();
  const existingNovel = novels.find((n) => n.slug === novel.slug);
  if (existingNovel) {
    if (!existingNovel.downloadedChapters.includes(chapter.chapterNumber)) {
      existingNovel.downloadedChapters.push(chapter.chapterNumber);
      existingNovel.downloadedChapters.sort((a, b) => a - b);
    }
  } else {
    novels.push({
      slug: novel.slug,
      title: novel.title,
      coverUrl: novel.coverUrl,
      authorName: novel.authorName,
      totalChapters: novel.totalChapters,
      downloadedChapters: [chapter.chapterNumber],
      downloadedAt: new Date().toISOString(),
    });
  }
  setJson(STORAGE_KEYS.OFFLINE_NOVELS, novels);
}

export function removeOfflineNovel(novelSlug: string): void {
  const novels = getOfflineNovels().filter((n) => n.slug !== novelSlug);
  setJson(STORAGE_KEYS.OFFLINE_NOVELS, novels);

  const chapters = getJson<OfflineChapter[]>(STORAGE_KEYS.OFFLINE_CHAPTERS, []).filter(
    (c) => c.novelSlug !== novelSlug
  );
  setJson(STORAGE_KEYS.OFFLINE_CHAPTERS, chapters);
}

export function isChapterOffline(novelSlug: string, chapterNumber: number): boolean {
  const chapters = getOfflineChapters(novelSlug);
  return chapters.some((c) => c.chapterNumber === chapterNumber);
}

// 6. Chapter Reactions Engine
export function getChapterReactions(novelSlug: string, chapterNumber: number): ChapterReactionCounts {
  const key = `${novelSlug}_ch${chapterNumber}`;
  const all = getJson<Record<string, ChapterReactionCounts>>(STORAGE_KEYS.REACTIONS, {});
  return (
    all[key] || {
      love: Math.floor(400 + ((novelSlug.length * 73 + chapterNumber * 31) % 900)),
      fire: Math.floor(300 + ((novelSlug.length * 47 + chapterNumber * 19) % 600)),
      tears: Math.floor(100 + ((novelSlug.length * 29 + chapterNumber * 13) % 400)),
      shock: Math.floor(250 + ((novelSlug.length * 53 + chapterNumber * 23) % 550)),
      laugh: Math.floor(80 + ((novelSlug.length * 17 + chapterNumber * 7) % 200)),
      mindblown: Math.floor(200 + ((novelSlug.length * 61 + chapterNumber * 29) % 480)),
    }
  );
}

export function getUserReaction(
  novelSlug: string,
  chapterNumber: number
): keyof ChapterReactionCounts | null {
  const key = `${novelSlug}_ch${chapterNumber}`;
  const userReactions = getJson<Record<string, keyof ChapterReactionCounts>>(
    STORAGE_KEYS.USER_REACTIONS,
    {}
  );
  return userReactions[key] || null;
}

export function toggleChapterReaction(
  novelSlug: string,
  chapterNumber: number,
  reaction: keyof ChapterReactionCounts
): { updatedCounts: ChapterReactionCounts; userReaction: keyof ChapterReactionCounts | null } {
  const key = `${novelSlug}_ch${chapterNumber}`;
  const allCounts = getJson<Record<string, ChapterReactionCounts>>(STORAGE_KEYS.REACTIONS, {});
  const userReactions = getJson<Record<string, keyof ChapterReactionCounts>>(
    STORAGE_KEYS.USER_REACTIONS,
    {}
  );

  const currentCounts = getChapterReactions(novelSlug, chapterNumber);
  const previousUserReaction = userReactions[key] || null;

  if (previousUserReaction === reaction) {
    currentCounts[reaction] = Math.max(0, currentCounts[reaction] - 1);
    delete userReactions[key];
  } else {
    if (previousUserReaction) {
      currentCounts[previousUserReaction] = Math.max(0, currentCounts[previousUserReaction] - 1);
    }
    currentCounts[reaction] = (currentCounts[reaction] || 0) + 1;
    userReactions[key] = reaction;
  }

  allCounts[key] = currentCounts;
  setJson(STORAGE_KEYS.REACTIONS, allCounts);
  setJson(STORAGE_KEYS.USER_REACTIONS, userReactions);

  return {
    updatedCounts: currentCounts,
    userReaction: userReactions[key] || null,
  };
}

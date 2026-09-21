"use client";

/* ================================================================
   NOVELVERSE — ENTERPRISE INDEXEDDB OFFLINE SYNC ENGINE
   High-capacity offline storage replacing 5MB localStorage limits.
   Supports chapters, offline reading queue, sync-on-reconnect,
   and browser storage quota management.
   ================================================================ */

const DB_NAME = "NovelVerseOfflineDB";
const DB_VERSION = 1;

export interface StoredOfflineChapter {
  novelSlug: string;
  chapterNumber: number;
  title: string;
  content: string;
  scenes?: Array<{
    order: number;
    text: string;
    illustrationUrl?: string;
    ambientAudioUrl?: string;
  }>;
  wordCount: number;
  downloadedAt: string;
}

export interface StoredOfflineNovel {
  slug: string;
  title: string;
  coverUrl: string;
  authorName: string;
  totalChapters: number;
  downloadedChapterNumbers: number[];
  updatedAt: string;
}

export interface QueuedProgressEvent {
  id?: number;
  userId?: string;
  novelSlug: string;
  chapterNumber: number;
  position: number;
  percentage: number;
  timestamp: string;
  synced: boolean;
}

// Singleton DB connection promise
let dbPromise: Promise<IDBDatabase> | null = null;

export function getOfflineDB(): Promise<IDBDatabase> {
  if (typeof window === "undefined" || !window.indexedDB) {
    return Promise.reject(new Error("IndexedDB is not available in this environment"));
  }

  if (!dbPromise) {
    dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Store 1: Chapters (Compound key: novelSlug + chapterNumber)
        if (!db.objectStoreNames.contains("chapters")) {
          const chapterStore = db.createObjectStore("chapters", {
            keyPath: ["novelSlug", "chapterNumber"],
          });
          chapterStore.createIndex("novelSlug", "novelSlug", { unique: false });
        }

        // Store 2: Novel metadata summaries
        if (!db.objectStoreNames.contains("novels")) {
          db.createObjectStore("novels", { keyPath: "slug" });
        }

        // Store 3: Offline reading progress queue (auto-increment id)
        if (!db.objectStoreNames.contains("sync_queue")) {
          const queueStore = db.createObjectStore("sync_queue", {
            keyPath: "id",
            autoIncrement: true,
          });
          queueStore.createIndex("synced", "synced", { unique: false });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  return dbPromise;
}

/* ── Save Chapter for Offline Reading ──────────────────────────── */
export async function saveChapterOfflineIDB(
  novel: { slug: string; title: string; coverUrl: string; authorName: string; totalChapters: number },
  chapter: {
    chapterNumber: number;
    title: string;
    content: string;
    wordCount: number;
    scenes?: StoredOfflineChapter["scenes"];
  }
): Promise<void> {
  const db = await getOfflineDB();

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(["chapters", "novels"], "readwrite");
    const chapterStore = tx.objectStore("chapters");
    const novelStore = tx.objectStore("novels");

    const chapterRecord: StoredOfflineChapter = {
      novelSlug: novel.slug,
      chapterNumber: chapter.chapterNumber,
      title: chapter.title,
      content: chapter.content,
      scenes: chapter.scenes,
      wordCount: chapter.wordCount,
      downloadedAt: new Date().toISOString(),
    };

    chapterStore.put(chapterRecord);

    // Update or create novel index record
    const getNovelReq = novelStore.get(novel.slug);
    getNovelReq.onsuccess = () => {
      const existing = (getNovelReq.result as StoredOfflineNovel) || {
        slug: novel.slug,
        title: novel.title,
        coverUrl: novel.coverUrl,
        authorName: novel.authorName,
        totalChapters: novel.totalChapters,
        downloadedChapterNumbers: [],
        updatedAt: new Date().toISOString(),
      };

      if (!existing.downloadedChapterNumbers.includes(chapter.chapterNumber)) {
        existing.downloadedChapterNumbers.push(chapter.chapterNumber);
        existing.downloadedChapterNumbers.sort((a, b) => a - b);
      }
      existing.updatedAt = new Date().toISOString();

      novelStore.put(existing);
    };

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/* ── Retrieve Offline Chapter ──────────────────────────────────── */
export async function getChapterOfflineIDB(
  novelSlug: string,
  chapterNumber: number
): Promise<StoredOfflineChapter | null> {
  try {
    const db = await getOfflineDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("chapters", "readonly");
      const store = tx.objectStore("chapters");
      const req = store.get([novelSlug, chapterNumber]);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

/* ── Check if Chapter is Saved Offline ─────────────────────────── */
export async function isChapterOfflineIDB(
  novelSlug: string,
  chapterNumber: number
): Promise<boolean> {
  const chapter = await getChapterOfflineIDB(novelSlug, chapterNumber);
  return chapter !== null;
}

/* ── Get All Downloaded Novels ─────────────────────────────────── */
export async function getAllOfflineNovelsIDB(): Promise<StoredOfflineNovel[]> {
  try {
    const db = await getOfflineDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("novels", "readonly");
      const store = tx.objectStore("novels");
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

/* ── Remove Single Chapter from Offline Cache ──────────────────── */
export async function removeChapterOfflineIDB(
  novelSlug: string,
  chapterNumber: number
): Promise<void> {
  const db = await getOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["chapters", "novels"], "readwrite");
    const chapterStore = tx.objectStore("chapters");
    const novelStore = tx.objectStore("novels");

    chapterStore.delete([novelSlug, chapterNumber]);

    const getNovelReq = novelStore.get(novelSlug);
    getNovelReq.onsuccess = () => {
      const novel = getNovelReq.result as StoredOfflineNovel | undefined;
      if (novel) {
        novel.downloadedChapterNumbers = novel.downloadedChapterNumbers.filter(
          (n) => n !== chapterNumber
        );
        if (novel.downloadedChapterNumbers.length === 0) {
          novelStore.delete(novelSlug);
        } else {
          novelStore.put(novel);
        }
      }
    };

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/* ── Remove Entire Novel from Offline Cache ────────────────────── */
export async function removeNovelOfflineIDB(novelSlug: string): Promise<void> {
  const db = await getOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["chapters", "novels"], "readwrite");
    const chapterStore = tx.objectStore("chapters");
    const novelStore = tx.objectStore("novels");

    const index = chapterStore.index("novelSlug");
    const req = index.openCursor(IDBKeyRange.only(novelSlug));

    req.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };

    novelStore.delete(novelSlug);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/* ── Offline Reading Progress Queue (Sync on Reconnect) ────────── */
export async function queueOfflineReadingProgress(event: {
  userId?: string;
  novelSlug: string;
  chapterNumber: number;
  position: number;
  percentage: number;
}): Promise<void> {
  try {
    const db = await getOfflineDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("sync_queue", "readwrite");
      const store = tx.objectStore("sync_queue");
      store.add({
        ...event,
        timestamp: new Date().toISOString(),
        synced: false,
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Graceful silent fallback
  }
}

/* ── Flush Offline Queue When Back Online ──────────────────────── */
export async function flushOfflineReadingQueue(): Promise<number> {
  if (typeof window === "undefined" || !navigator.onLine) return 0;

  try {
    const db = await getOfflineDB();
    const unsyncedItems: QueuedProgressEvent[] = await new Promise((resolve, reject) => {
      const tx = db.transaction("sync_queue", "readonly");
      const store = tx.objectStore("sync_queue");
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    if (unsyncedItems.length === 0) return 0;

    let syncedCount = 0;
    for (const item of unsyncedItems) {
      try {
        const res = await fetch("/api/user/reading-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            novelSlug: item.novelSlug,
            chapterNumber: item.chapterNumber,
            position: item.position,
            percentage: item.percentage,
          }),
        });
        if (res.ok) {
          syncedCount++;
          // Delete synced item from queue
          const tx = db.transaction("sync_queue", "readwrite");
          if (item.id !== undefined) {
            tx.objectStore("sync_queue").delete(item.id);
          }
        }
      } catch {
        // Stop flushing if network drops again
        break;
      }
    }

    return syncedCount;
  } catch {
    return 0;
  }
}

/* ── Browser Storage Quota Estimator ───────────────────────────── */
export async function estimateOfflineStorageUsage(): Promise<{
  usedBytes: number;
  quotaBytes: number;
  usedFormatted: string;
  quotaFormatted: string;
  percentageUsed: number;
}> {
  if (typeof navigator !== "undefined" && navigator.storage && navigator.storage.estimate) {
    const { usage = 0, quota = 1 } = await navigator.storage.estimate();
    const usedMB = (usage / (1024 * 1024)).toFixed(1);
    const quotaGB = (quota / (1024 * 1024 * 1024)).toFixed(1);
    const percentage = Math.min(100, (usage / quota) * 100);
    return {
      usedBytes: usage,
      quotaBytes: quota,
      usedFormatted: `${usedMB} MB`,
      quotaFormatted: `${quotaGB} GB`,
      percentageUsed: Number(percentage.toFixed(2)),
    };
  }

  return {
    usedBytes: 0,
    quotaBytes: 0,
    usedFormatted: "Unknown",
    quotaFormatted: "Unknown",
    percentageUsed: 0,
  };
}

"use client";

import * as React from "react";
import {
  Download,
  CheckCircle,
  HardDrive,
  Trash2,
  WifiOff,
  Wifi,
} from "lucide-react";
import {
  saveChapterOffline,
  isChapterOffline,
  getOfflineNovels,
  removeOfflineNovel,
} from "@/lib/reader-storage";
import {
  saveChapterOfflineIDB,
  isChapterOfflineIDB,
  flushOfflineReadingQueue,
} from "@/lib/offline-sync-engine";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface OfflineDownloadButtonProps {
  novel: {
    slug: string;
    title: string;
    coverUrl: string;
    authorName: string;
    totalChapters: number;
  };
  chapter: {
    chapterNumber: number;
    title: string;
    content: string;
    wordCount: number;
  };
  className?: string;
}

export function OfflineDownloadButton({
  novel,
  chapter,
  className,
}: OfflineDownloadButtonProps) {
  const [isDownloaded, setIsDownloaded] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    async function checkOffline() {
      const offlineInIDB = await isChapterOfflineIDB(novel.slug, chapter.chapterNumber);
      const offlineInStorage = isChapterOffline(novel.slug, chapter.chapterNumber);
      if (mounted) {
        setIsDownloaded(offlineInIDB || offlineInStorage);
      }
    }
    checkOffline();

    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      if (online) {
        // Auto flush queued progress when reconnecting
        flushOfflineReadingQueue().catch(() => {});
      }
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    setIsOnline(navigator.onLine);

    return () => {
      mounted = false;
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, [novel.slug, chapter.chapterNumber]);

  const handleDownload = async () => {
    try {
      // Save in high-capacity IndexedDB
      await saveChapterOfflineIDB(novel, chapter);
      // Also write to reader-storage for fast synchronous lookups
      saveChapterOffline(novel, chapter);
      setIsDownloaded(true);
      toast.success(`Chapter ${chapter.chapterNumber} saved for offline reading! (IndexedDB)`);
    } catch {
      // Fallback to storage
      saveChapterOffline(novel, chapter);
      setIsDownloaded(true);
      toast.success(`Chapter ${chapter.chapterNumber} saved for offline reading!`);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {!isOnline && (
        <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/30">
          <WifiOff className="w-3 h-3" /> Offline Mode
        </span>
      )}

      <button
        onClick={handleDownload}
        disabled={isDownloaded}
        className={cn(
          "px-2.5 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border",
          isDownloaded
            ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300 cursor-default"
            : "bg-zinc-900 border-white/10 text-zinc-300 hover:text-white hover:border-white/20"
        )}
        title={isDownloaded ? "Saved Offline" : "Save Offline"}
      >
        {isDownloaded ? (
          <>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Downloaded</span>
          </>
        ) : (
          <>
            <Download className="w-3.5 h-3.5 text-violet-400" />
            <span className="hidden sm:inline">Save Offline</span>
          </>
        )}
      </button>
    </div>
  );
}

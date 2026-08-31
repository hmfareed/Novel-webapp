import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User, ReadingProgress, Library, Novel } from "@/models";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/jwt";
import { formatDateKey, calculateStreak, evaluateBadges } from "@/lib/user-stats";
import { SEED_NOVELS } from "@/lib/seed-data";
import { z } from "zod";

const RecordProgressSchema = z.object({
  novelSlug: z.string().min(1),
  chapterNumber: z.number().int().min(1),
  position: z.number().min(0).max(100).default(0),
  timeIncrementSeconds: z.number().min(0).max(3600).default(0),
  completed: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifySessionToken(token);
    if (!payload?.userId) {
      return NextResponse.json({ success: false, error: "Invalid session" }, { status: 401 });
    }

    const body = await request.json();
    const parseResult = RecordProgressSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.issues[0]?.message || "Invalid payload" },
        { status: 400 }
      );
    }

    const { novelSlug, chapterNumber, position, timeIncrementSeconds, completed } = parseResult.data;

    await connectToDatabase();

    // Find novel metadata (from DB or fallback to seed data)
    const novelData = await Novel.findOne({ slug: novelSlug });
    const seedFallback = SEED_NOVELS.find((n) => n.slug === novelSlug);

    const novelTitle = novelData?.title || seedFallback?.title || novelSlug;
    const novelCoverUrl = novelData?.coverUrl || seedFallback?.coverUrl || "";
    const authorName = novelData?.author?.name || seedFallback?.author?.name || "NovelVerse Author";
    const totalChapters = novelData?.chapterCount || seedFallback?.chapters?.length || 10;

    const overallPercentage = Math.min(
      100,
      Math.round(((chapterNumber - 1 + position / 100) / Math.max(1, totalChapters)) * 100)
    );

    // 1. Update or create ReadingProgress record
    const progressRecord = await ReadingProgress.findOneAndUpdate(
      { userId: payload.userId, novelSlug },
      {
        $set: {
          novelId: novelData?._id,
          novelSlug,
          novelTitle,
          novelCoverUrl,
          authorName,
          totalChapters,
          chapterNumber,
          position,
          percentage: overallPercentage,
          completed: completed || overallPercentage >= 100,
          lastReadAt: new Date(),
        },
        $inc: {
          timeSpentSeconds: timeIncrementSeconds,
        },
      },
      { upsert: true, new: true }
    );

    // Also auto-add to Library shelf as "READING" if not present
    await Library.findOneAndUpdate(
      { userId: payload.userId, novelSlug },
      {
        $setOnInsert: {
          novelId: novelData?._id,
          novelSlug,
          novelTitle,
          novelCoverUrl,
          authorName,
          chapterCount: totalChapters,
          status: "READING",
          isFavorite: false,
          addedAt: new Date(),
        },
      },
      { upsert: true }
    );

    // 2. Update User's Real-Time Reading Activity & Streak
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const todayKey = formatDateKey(new Date());
    const activities = user.readingActivity || [];
    const dayIndex = activities.findIndex((a) => a.date === todayKey);

    if (dayIndex >= 0) {
      activities[dayIndex].seconds += timeIncrementSeconds;
      if (completed) {
        activities[dayIndex].chaptersRead += 1;
      }
      activities[dayIndex].lastReadAt = new Date();
    } else {
      activities.push({
        date: todayKey,
        seconds: timeIncrementSeconds,
        chaptersRead: completed ? 1 : 0,
        lastReadAt: new Date(),
      });
    }

    // Recalculate streak
    const streakResult = calculateStreak(activities);

    user.readingActivity = activities;
    user.totalReadingTimeSeconds = (user.totalReadingTimeSeconds || 0) + timeIncrementSeconds;
    if (completed) {
      user.chaptersReadCount = (user.chaptersReadCount || 0) + 1;
    }
    user.readingStreakDays = streakResult.currentStreak;
    user.longestStreakDays = Math.max(user.longestStreakDays || 0, streakResult.longestStreak);
    user.lastActiveAt = new Date();

    // Recalculate novelsReadCount from distinct progress records
    const distinctNovels = await ReadingProgress.countDocuments({ userId: payload.userId });
    user.novelsReadCount = distinctNovels;

    // Check newly unlocked badges
    const libraryCount = await Library.countDocuments({ userId: payload.userId });
    const currentUnlockedIds = (user.unlockedBadges || []).map((b) => b.badgeId);
    const badges = evaluateBadges({
      currentStreak: user.readingStreakDays,
      longestStreak: user.longestStreakDays,
      totalReadingTimeSeconds: user.totalReadingTimeSeconds,
      chaptersReadCount: user.chaptersReadCount,
      novelsReadCount: user.novelsReadCount,
      libraryCount,
      readingActivity: user.readingActivity,
      unlockedBadgeIds: currentUnlockedIds,
    });

    const newlyUnlockedBadges = badges
      .filter((b) => b.unlocked && !currentUnlockedIds.includes(b.id))
      .map((b) => ({ badgeId: b.id, unlockedAt: new Date() }));

    if (newlyUnlockedBadges.length > 0) {
      user.unlockedBadges = [...(user.unlockedBadges || []), ...newlyUnlockedBadges];
    }

    await user.save();

    return NextResponse.json({
      success: true,
      progress: progressRecord,
      streak: user.readingStreakDays,
      totalReadingTimeSeconds: user.totalReadingTimeSeconds,
      newlyUnlockedBadges,
    });
  } catch (error) {
    console.error("[Reading Progress Error]", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ success: false, progress: [] }, { status: 200 });
    }

    const payload = await verifySessionToken(token);
    if (!payload?.userId) {
      return NextResponse.json({ success: false, progress: [] }, { status: 200 });
    }

    await connectToDatabase();
    const progressList = await ReadingProgress.find({ userId: payload.userId })
      .sort({ lastReadAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      progress: progressList,
    });
  } catch (error) {
    console.error("[Reading Progress GET Error]", error);
    return NextResponse.json({ success: false, progress: [] }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User, toSafeUser } from "@/models/User";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/jwt";
import { z } from "zod";

const UpdateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50).optional(),
  bio: z.string().max(250, "Bio cannot exceed 250 characters").optional(),
  avatar: z.string().url("Avatar must be a valid URL").optional().or(z.literal("")),
  favoriteGenres: z.array(z.string()).optional(),
});

import { ReadingProgress, Library } from "@/models";
import {
  calculateStreak,
  getWeekCalendar,
  formatReadingTime,
  evaluateBadges,
  type ReadingDayRecord,
} from "@/lib/user-stats";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifySessionToken(token);
    if (!payload?.userId) {
      return NextResponse.json({ success: false, error: "Invalid session" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // 1. Fetch reading progress records
    const readingProgressList = await ReadingProgress.find({ userId: payload.userId })
      .sort({ lastReadAt: -1 })
      .lean();

    // 2. Fetch library items & favorites
    const libraryItems = await Library.find({ userId: payload.userId })
      .sort({ addedAt: -1 })
      .lean();
    const favoriteNovels = libraryItems.filter((item) => item.isFavorite);

    // 3. Compute Real-Time Streaks and Calendar
    const rawActivities = (user.readingActivity || []) as unknown as ReadingDayRecord[];
    const streakResult = calculateStreak(rawActivities);
    const weekCalendar = getWeekCalendar(rawActivities);

    // Synchronize user streak state in DB if changed
    if (user.readingStreakDays !== streakResult.currentStreak) {
      user.readingStreakDays = streakResult.currentStreak;
      user.longestStreakDays = Math.max(user.longestStreakDays || 0, streakResult.longestStreak);
      user.novelsReadCount = readingProgressList.length;
      await user.save();
    }

    // 4. Dynamically Evaluate Badges
    const unlockedBadgeIds = (user.unlockedBadges || []).map((b) => b.badgeId);
    const badges = evaluateBadges({
      currentStreak: streakResult.currentStreak,
      longestStreak: Math.max(user.longestStreakDays || 0, streakResult.longestStreak),
      totalReadingTimeSeconds: user.totalReadingTimeSeconds || 0,
      chaptersReadCount: user.chaptersReadCount || 0,
      novelsReadCount: readingProgressList.length,
      libraryCount: libraryItems.length,
      readingActivity: rawActivities,
      unlockedBadgeIds,
    });

    const unlockedCount = badges.filter((b) => b.unlocked).length;

    const stats = {
      activeStreak: streakResult.currentStreak,
      longestStreak: Math.max(user.longestStreakDays || 0, streakResult.longestStreak),
      readToday: streakResult.readToday,
      readYesterday: streakResult.readYesterday,
      novelsReadCount: readingProgressList.length,
      chaptersReadCount: user.chaptersReadCount || 0,
      totalReadingTimeSeconds: user.totalReadingTimeSeconds || 0,
      readingTimeDisplay: formatReadingTime(user.totalReadingTimeSeconds || 0),
      badgesUnlockedCount: unlockedCount,
      totalBadgesCount: badges.length,
      weekCalendar,
      badges,
    };

    return NextResponse.json({
      success: true,
      user: toSafeUser(user),
      stats,
      currentlyReading: readingProgressList,
      libraryItems,
      favoriteNovels,
    });
  } catch (error) {
    console.error("[Profile GET Error]", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
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
    const result = UpdateProfileSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0]?.message || "Invalid data" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const updateData: Record<string, unknown> = {};
    if (result.data.name !== undefined) updateData.name = result.data.name.trim();
    if (result.data.bio !== undefined) updateData.bio = result.data.bio.trim();
    if (result.data.avatar !== undefined) updateData.avatar = result.data.avatar;
    if (result.data.favoriteGenres !== undefined) updateData.favoriteGenres = result.data.favoriteGenres;

    const updatedUser = await User.findByIdAndUpdate(
      payload.userId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: toSafeUser(updatedUser),
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("[Profile PATCH Error]", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

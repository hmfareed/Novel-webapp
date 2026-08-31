import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Library, Novel, User } from "@/models";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/jwt";
import { SEED_NOVELS } from "@/lib/seed-data";
import { evaluateBadges } from "@/lib/user-stats";
import { z } from "zod";

const LibraryActionSchema = z.object({
  novelSlug: z.string().min(1),
  status: z.enum(["READING", "WANT_TO_READ", "COMPLETED", "DOWNLOADED", "BOOKMARKED"]).optional(),
  isFavorite: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ success: false, items: [], favorites: [] }, { status: 200 });
    }

    const payload = await verifySessionToken(token);
    if (!payload?.userId) {
      return NextResponse.json({ success: false, items: [], favorites: [] }, { status: 200 });
    }

    await connectToDatabase();
    const items = await Library.find({ userId: payload.userId })
      .sort({ addedAt: -1 })
      .lean();

    const favorites = items.filter((item) => item.isFavorite);

    return NextResponse.json({
      success: true,
      items,
      favorites,
    });
  } catch (error) {
    console.error("[Library GET Error]", error);
    return NextResponse.json({ success: false, items: [], favorites: [] }, { status: 500 });
  }
}

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
    const parseResult = LibraryActionSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.issues[0]?.message || "Invalid payload" },
        { status: 400 }
      );
    }

    const { novelSlug, status, isFavorite } = parseResult.data;

    await connectToDatabase();

    // Novel metadata
    const novelData = await Novel.findOne({ slug: novelSlug });
    const seedFallback = SEED_NOVELS.find((n) => n.slug === novelSlug);

    const novelTitle = novelData?.title || seedFallback?.title || novelSlug;
    const novelCoverUrl = novelData?.coverUrl || seedFallback?.coverUrl || "";
    const authorName = novelData?.author?.name || seedFallback?.author?.name || "NovelVerse Author";
    const rating = novelData?.rating || seedFallback?.rating || 4.8;
    const chapterCount = novelData?.chapterCount || seedFallback?.chapters?.length || 10;

    const existing = await Library.findOne({ userId: payload.userId, novelSlug });

    let updatedItem;
    if (existing) {
      if (status !== undefined) existing.status = status;
      if (isFavorite !== undefined) existing.isFavorite = isFavorite;
      existing.updatedAt = new Date();
      updatedItem = await existing.save();
    } else {
      updatedItem = await Library.create({
        userId: payload.userId,
        novelId: novelData?._id,
        novelSlug,
        novelTitle,
        novelCoverUrl,
        authorName,
        rating,
        chapterCount,
        status: status || "WANT_TO_READ",
        isFavorite: isFavorite ?? false,
        addedAt: new Date(),
      });
    }

    // Check if user unlocked "Grand Archivist" badge (10+ saved)
    const user = await User.findById(payload.userId);
    if (user) {
      const libraryCount = await Library.countDocuments({ userId: payload.userId });
      const currentUnlockedIds = (user.unlockedBadges || []).map((b) => b.badgeId);
      const badges = evaluateBadges({
        currentStreak: user.readingStreakDays || 0,
        longestStreak: user.longestStreakDays || 0,
        totalReadingTimeSeconds: user.totalReadingTimeSeconds || 0,
        chaptersReadCount: user.chaptersReadCount || 0,
        novelsReadCount: user.novelsReadCount || 0,
        libraryCount,
        readingActivity: user.readingActivity || [],
        unlockedBadgeIds: currentUnlockedIds,
      });

      const newlyUnlocked = badges
        .filter((b) => b.unlocked && !currentUnlockedIds.includes(b.id))
        .map((b) => ({ badgeId: b.id, unlockedAt: new Date() }));

      if (newlyUnlocked.length > 0) {
        user.unlockedBadges = [...(user.unlockedBadges || []), ...newlyUnlocked];
        await user.save();
      }
    }

    return NextResponse.json({
      success: true,
      item: updatedItem,
    });
  } catch (error) {
    console.error("[Library POST Error]", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifySessionToken(token);
    if (!payload?.userId) {
      return NextResponse.json({ success: false, error: "Invalid session" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const novelSlug = searchParams.get("novelSlug");
    if (!novelSlug) {
      return NextResponse.json({ success: false, error: "novelSlug is required" }, { status: 400 });
    }

    await connectToDatabase();
    await Library.deleteOne({ userId: payload.userId, novelSlug });

    return NextResponse.json({
      success: true,
      message: "Novel removed from library",
    });
  } catch (error) {
    console.error("[Library DELETE Error]", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

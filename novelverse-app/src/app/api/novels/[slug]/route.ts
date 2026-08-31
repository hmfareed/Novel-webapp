import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Novel, Chapter } from "@/models";
import { SEED_NOVELS } from "@/lib/seed-data";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    if (!slug) {
      return NextResponse.json({ success: false, error: "Slug is required" }, { status: 400 });
    }

    await connectToDatabase();

    // 1. Check MongoDB
    const dbNovel = await Novel.findOne({ slug }).lean();

    if (dbNovel) {
      const chapters = await Chapter.find({ novelId: dbNovel._id })
        .select("chapterNumber title wordCount isPremium status")
        .sort({ chapterNumber: 1 })
        .lean();

      return NextResponse.json({
        success: true,
        novel: {
          ...dbNovel,
          id: String(dbNovel._id),
          chapters: chapters.map((ch) => ({
            id: String(ch._id),
            chapterNumber: ch.chapterNumber,
            title: ch.title,
            wordCount: ch.wordCount,
            isPremium: ch.isPremium,
          })),
        },
      });
    }

    // 2. Fallback to SEED_NOVELS
    const seedNovel = SEED_NOVELS.find((n) => n.slug === slug);
    if (seedNovel) {
      return NextResponse.json({
        success: true,
        novel: {
          ...seedNovel,
          id: seedNovel.slug,
          chapters: seedNovel.chapters.map((ch) => ({
            id: `${seedNovel.slug}-${ch.chapterNumber}`,
            chapterNumber: ch.chapterNumber,
            title: ch.title,
            wordCount: ch.wordCount,
            isPremium: ch.isPremium,
          })),
        },
      });
    }

    return NextResponse.json({ success: false, error: "Novel not found" }, { status: 404 });
  } catch (error) {
    console.error("[Novel Details API Error]", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

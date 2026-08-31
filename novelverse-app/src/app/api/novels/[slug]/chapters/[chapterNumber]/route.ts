import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Novel, Chapter } from "@/models";
import { SEED_NOVELS } from "@/lib/seed-data";

interface RouteContext {
  params: Promise<{ slug: string; chapterNumber: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { slug, chapterNumber } = await context.params;
    const chNum = parseInt(chapterNumber, 10);

    if (!slug || isNaN(chNum)) {
      return NextResponse.json({ success: false, error: "Invalid parameters" }, { status: 400 });
    }

    await connectToDatabase();

    // 1. Look up in MongoDB
    const dbNovel = await Novel.findOne({ slug }).lean();

    if (dbNovel) {
      const chapter = await Chapter.findOne({ novelId: dbNovel._id, chapterNumber: chNum }).lean();
      const allChapters = await Chapter.find({ novelId: dbNovel._id })
        .select("chapterNumber title")
        .sort({ chapterNumber: 1 })
        .lean();

      if (chapter) {
        return NextResponse.json({
          success: true,
          novel: {
            id: String(dbNovel._id),
            slug: dbNovel.slug,
            title: dbNovel.title,
            coverUrl: dbNovel.coverUrl,
            author: dbNovel.author,
            chapterCount: allChapters.length,
          },
          chapter: {
            id: String(chapter._id),
            chapterNumber: chapter.chapterNumber,
            title: chapter.title,
            content: chapter.content,
            wordCount: chapter.wordCount,
            isPremium: chapter.isPremium,
          },
          chaptersList: allChapters,
        });
      }
    }

    // 2. Fallback to SEED_NOVELS
    const seedNovel = SEED_NOVELS.find((n) => n.slug === slug);
    if (seedNovel) {
      const seedChapter = seedNovel.chapters.find((c) => c.chapterNumber === chNum);
      if (seedChapter) {
        return NextResponse.json({
          success: true,
          novel: {
            id: seedNovel.slug,
            slug: seedNovel.slug,
            title: seedNovel.title,
            coverUrl: seedNovel.coverUrl,
            author: seedNovel.author,
            chapterCount: seedNovel.chapters.length,
          },
          chapter: {
            id: `${seedNovel.slug}-${seedChapter.chapterNumber}`,
            chapterNumber: seedChapter.chapterNumber,
            title: seedChapter.title,
            content: seedChapter.content,
            wordCount: seedChapter.wordCount,
            isPremium: seedChapter.isPremium,
          },
          chaptersList: seedNovel.chapters.map((c) => ({
            chapterNumber: c.chapterNumber,
            title: c.title,
          })),
        });
      }
    }

    return NextResponse.json({ success: false, error: "Chapter not found" }, { status: 404 });
  } catch (error) {
    console.error("[Chapter Reader API Error]", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Genre, Novel, Chapter } from "@/models";
import { SEED_GENRES, SEED_NOVELS } from "@/lib/seed-data";

export async function GET() {
  try {
    await connectToDatabase();

    // 1. Seed Genres
    for (const g of SEED_GENRES) {
      await Genre.findOneAndUpdate(
        { slug: g.slug },
        { ...g },
        { upsert: true, new: true }
      );
    }

    // 2. Seed Novels & Chapters
    for (const n of SEED_NOVELS) {
      const { chapters, ...novelData } = n;

      const savedNovel = await Novel.findOneAndUpdate(
        { slug: n.slug },
        { ...novelData },
        { upsert: true, new: true }
      );

      if (chapters && chapters.length > 0) {
        for (const ch of chapters) {
          await Chapter.findOneAndUpdate(
            { novelId: savedNovel._id, chapterNumber: ch.chapterNumber },
            {
              novelId: savedNovel._id,
              chapterNumber: ch.chapterNumber,
              title: ch.title,
              content: ch.content,
              wordCount: ch.wordCount,
              isPremium: ch.isPremium,
              status: "PUBLISHED",
            },
            { upsert: true, new: true }
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${SEED_GENRES.length} genres and ${SEED_NOVELS.length} novels into MongoDB Atlas!`,
    });
  } catch (error: unknown) {
    console.error("[Seed Error]", error);
    const message = error instanceof Error ? error.message : "Failed to seed database";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

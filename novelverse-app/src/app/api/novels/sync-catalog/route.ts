import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Novel, Chapter, Genre } from "@/models";
import { batchIngestTopic, CURATED_ICONIC_NOVELS, fetchGutenbergNovel, saveIngestedNovelToDatabase } from "@/services/novel-ingester";
import { z } from "zod";

const SyncCatalogSchema = z.object({
  action: z.enum(["curated_all", "topic_batch"]).default("curated_all"),
  topic: z.string().optional().default("fantasy"),
  count: z.number().int().min(1).max(50).default(10),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const parseResult = SyncCatalogSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.issues[0]?.message || "Invalid payload" },
        { status: 400 }
      );
    }

    const { action, topic, count } = parseResult.data;

    await connectToDatabase();

    if (action === "curated_all") {
      // Ingest all curated iconic novels with complete chapters
      const importedNovels: Array<{ title: string; slug: string; chapterCount: number }> = [];

      for (const item of CURATED_ICONIC_NOVELS) {
        try {
          const novelData = await fetchGutenbergNovel(item.id);
          if (novelData && novelData.chapters.length > 0) {
            await saveIngestedNovelToDatabase(novelData);
            importedNovels.push({
              title: novelData.title,
              slug: novelData.slug,
              chapterCount: novelData.chapters.length,
            });
          }
        } catch (err) {
          console.warn(`[SyncCatalog] Failed to ingest book ID ${item.id}`, err);
        }
      }

      return NextResponse.json({
        success: true,
        message: `Successfully synced ${importedNovels.length} iconic complete novels with hundreds of chapters!`,
        count: importedNovels.length,
        novels: importedNovels,
      });
    } else {
      // Batch ingest by topic/genre
      const result = await batchIngestTopic(topic, count);

      return NextResponse.json({
        success: true,
        message: `Successfully synced ${result.importedCount} full novels for topic "${topic}"!`,
        count: result.importedCount,
        novels: result.novels,
      });
    }
  } catch (error) {
    console.error("[Sync Catalog Route Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to sync catalog" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();

    const totalNovels = await Novel.countDocuments();
    const totalChapters = await Chapter.countDocuments();
    const totalGenres = await Genre.countDocuments();

    const sampleNovels = await Novel.find()
      .select("title slug author rating chapterCount coverUrl genres")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({
      success: true,
      stats: {
        totalNovels,
        totalChapters,
        totalGenres,
      },
      recentNovels: sampleNovels,
    });
  } catch (error) {
    console.error("[Sync Catalog GET Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch catalog statistics" },
      { status: 500 }
    );
  }
}

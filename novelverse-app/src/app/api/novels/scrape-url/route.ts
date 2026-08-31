import { NextRequest, NextResponse } from "next/server";
import { scrapeNovelFromUrl, saveIngestedNovelToDatabase } from "@/services/novel-ingester";
import { z } from "zod";

const ScrapeUrlSchema = z.object({
  url: z.string().url("Must be a valid webpage URL"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = ScrapeUrlSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.issues[0]?.message || "Invalid URL" },
        { status: 400 }
      );
    }

    const { url } = parseResult.data;

    const novelData = await scrapeNovelFromUrl(url);
    if (!novelData || novelData.chapters.length === 0) {
      return NextResponse.json(
        { success: false, error: "Unable to extract novel or chapters from the provided URL." },
        { status: 422 }
      );
    }

    const saveResult = await saveIngestedNovelToDatabase(novelData);

    return NextResponse.json({
      success: true,
      message: `Successfully scraped "${novelData.title}" with ${saveResult.chapterCount} chapters!`,
      novel: {
        id: saveResult.novelId,
        slug: novelData.slug,
        title: novelData.title,
        author: novelData.author.name,
        chapterCount: saveResult.chapterCount,
        wordCount: novelData.wordCount,
        coverUrl: novelData.coverUrl,
      },
    });
  } catch (error) {
    console.error("[Scrape URL Route Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to scrape web novel from URL" },
      { status: 500 }
    );
  }
}

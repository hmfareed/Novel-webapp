import { NextRequest, NextResponse } from "next/server";
import {
  fetchGutenbergNovel,
  segmentChaptersFromText,
  saveIngestedNovelToDatabase,
} from "@/services/novel-ingester";
import { z } from "zod";

const ImportRequestSchema = z.object({
  source: z.enum(["gutenberg", "custom_text"]),
  gutenbergId: z.number().optional(),
  title: z.string().optional(),
  author: z.string().optional(),
  synopsis: z.string().optional(),
  coverUrl: z.string().optional(),
  genre: z.string().optional(),
  rawText: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = ImportRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0]?.message || "Invalid payload" },
        { status: 400 }
      );
    }

    const { source, gutenbergId, title, author, synopsis, coverUrl, genre, rawText } = result.data;

    let novelData;

    if (source === "gutenberg") {
      if (!gutenbergId) {
        return NextResponse.json(
          { success: false, error: "gutenbergId is required for Gutenberg import" },
          { status: 400 }
        );
      }

      novelData = await fetchGutenbergNovel(gutenbergId);
      if (!novelData) {
        return NextResponse.json(
          { success: false, error: `Failed to fetch novel with Gutenberg ID: ${gutenbergId}` },
          { status: 502 }
        );
      }
    } else {
      if (!title || !rawText) {
        return NextResponse.json(
          { success: false, error: "Title and rawText are required for custom import" },
          { status: 400 }
        );
      }

      const chapters = segmentChaptersFromText(rawText);
      const totalWords = chapters.reduce((acc, c) => acc + c.wordCount, 0);
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const authorName = author || "NovelVerse Author";

      novelData = {
        slug,
        title,
        synopsis: synopsis || `A captivating full novel titled "${title}" published on NovelVerse.`,
        coverUrl:
          coverUrl ||
          "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
        bannerUrl:
          coverUrl ||
          "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1600&auto=format&fit=crop",
        author: {
          name: authorName,
          username: authorName.toLowerCase().replace(/[^a-z0-9]/g, ""),
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(authorName)}`,
          verified: true,
        },
        genres: [
          {
            id: (genre || "fantasy").toLowerCase(),
            name: genre || "Fantasy",
            slug: (genre || "fantasy").toLowerCase(),
          },
        ],
        tags: [genre || "Fiction", "Multi-Chapter", "Full Novel"],
        status: "PUBLISHED" as const,
        rating: 4.9,
        reviewCount: 150,
        readCount: 5200,
        chapterCount: chapters.length,
        wordCount: totalWords,
        isPremium: false,
        isCompleted: true,
        featured: true,
        mood: "Epic & Adventurous",
        category: "trending" as const,
        storyDna: {
          romance: 40,
          politics: 30,
          action: 60,
          drama: 70,
          magic: 50,
        },
        ageRating: "13+",
        language: "English",
        chapters,
      };
    }

    // Persist to MongoDB
    const saveResult = await saveIngestedNovelToDatabase(novelData);

    return NextResponse.json({
      success: true,
      message: `Successfully imported "${novelData.title}" with ${saveResult.chapterCount} full chapters!`,
      novel: {
        id: saveResult.novelId,
        slug: novelData.slug,
        title: novelData.title,
        chapterCount: saveResult.chapterCount,
        wordCount: novelData.wordCount,
      },
    });
  } catch (error) {
    console.error("[Novel Import Route Error]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error during import" },
      { status: 500 }
    );
  }
}

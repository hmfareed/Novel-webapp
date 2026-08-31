import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Novel } from "@/models";
import { SEED_NOVELS } from "@/lib/seed-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source") || "";
    const genre = searchParams.get("genre") || "";
    const category = searchParams.get("category") || "";
    const query = searchParams.get("q") || searchParams.get("query") || "";
    const page = parseInt(searchParams.get("page") || "1", 10) || 1;
    const limit = parseInt(searchParams.get("limit") || "24", 10) || 24;

    await connectToDatabase();

    const filter: Record<string, unknown> = {};

    if (source && source !== "all") {
      filter.source = source.toLowerCase();
    }

    if (genre && genre !== "all") {
      filter["genres.slug"] = genre.toLowerCase();
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { "author.name": { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [dbNovels, total] = await Promise.all([
      Novel.find(filter)
        .sort({ rating: -1, readCount: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Novel.countDocuments(filter),
    ]);

    interface NovelSummaryItem {
      id: string;
      slug: string;
      title: string;
      subtitle?: string;
      synopsis?: string;
      coverUrl?: string;
      bannerUrl?: string;
      author: {
        name: string;
        username?: string;
        avatar?: string;
        verified?: boolean;
      };
      genres: Array<{ id: string; name: string; slug: string }>;
      tags?: string[];
      status?: string;
      rating?: number;
      reviewCount?: number;
      readCount?: number;
      chapterCount?: number;
      wordCount?: number;
      isPremium?: boolean;
      isCompleted?: boolean;
      featured?: boolean;
      mood?: string;
      category?: string;
      source?: "gutenberg" | "openlibrary" | "googlebooks" | "manual";
      sourceId?: string;
      sourceUrl?: string;
      previewUrl?: string;
      readingUrl?: string;
      contentType?: "full_text" | "metadata_only" | "preview_only";
      isPublicDomain?: boolean;
      isReadable?: boolean;
      publisher?: string;
      publishedDate?: string;
      isbn10?: string;
      isbn13?: string;
      pageCount?: number;
    }

    // Map database novels
    let results: NovelSummaryItem[] = dbNovels.map((n) => ({
      id: String(n._id),
      slug: n.slug,
      title: n.title,
      subtitle: n.subtitle,
      synopsis: n.synopsis,
      coverUrl: n.coverUrl,
      bannerUrl: n.bannerUrl,
      author: n.author,
      genres: n.genres,
      tags: n.tags,
      status: n.status,
      rating: n.rating,
      reviewCount: n.reviewCount,
      readCount: n.readCount,
      chapterCount: n.chapterCount,
      wordCount: n.wordCount,
      isPremium: n.isPremium,
      isCompleted: n.isCompleted,
      featured: n.featured,
      mood: n.mood,
      category: n.category,
      source: n.source || "manual",
      sourceId: n.sourceId,
      sourceUrl: n.sourceUrl,
      previewUrl: n.previewUrl,
      readingUrl: n.readingUrl || (n.isReadable !== false && n.chapterCount > 0 ? `/read/${n.slug}/1` : undefined),
      contentType: n.contentType,
      isPublicDomain: n.isPublicDomain,
      isReadable: n.isReadable !== undefined ? n.isReadable : true,
      publisher: n.publisher,
      publishedDate: n.publishedDate,
      isbn10: n.isbn10,
      isbn13: n.isbn13,
      pageCount: n.pageCount,
    }));

    // If MongoDB is empty or has very few novels, merge with seed novels
    if (results.length === 0 && page === 1) {
      results = SEED_NOVELS.filter((n) => {
        if (source && source !== "all") {
          // If source filter is given, map classics to gutenberg / manual
          const inferredSource =
            n.slug === "dracula" || n.slug === "the-adventures-of-sherlock-holmes" || n.slug === "the-time-machine" || n.slug === "pride-and-prejudice"
              ? "gutenberg"
              : "manual";
          if (inferredSource !== source.toLowerCase()) return false;
        }
        if (genre && genre !== "all") {
          return n.genres.some((g) => g.slug === genre.toLowerCase());
        }
        if (query) {
          return (
            n.title.toLowerCase().includes(query.toLowerCase()) ||
            n.author.name.toLowerCase().includes(query.toLowerCase())
          );
        }
        return true;
      }).map((n) => {
        const isGutenbergClassic =
          n.slug === "dracula" || n.slug === "the-adventures-of-sherlock-holmes" || n.slug === "the-time-machine" || n.slug === "pride-and-prejudice";
        return {
          id: n.slug,
          slug: n.slug,
          title: n.title,
          synopsis: n.synopsis,
          coverUrl: n.coverUrl,
          bannerUrl: n.bannerUrl,
          author: n.author,
          genres: n.genres,
          tags: n.tags,
          status: n.status,
          rating: n.rating,
          reviewCount: n.reviewCount,
          readCount: n.readCount,
          chapterCount: n.chapterCount,
          wordCount: n.wordCount,
          isPremium: n.isPremium,
          isCompleted: n.isCompleted,
          featured: n.featured,
          mood: n.mood,
          category: n.category,
          source: isGutenbergClassic ? "gutenberg" : "manual",
          isPublicDomain: isGutenbergClassic,
          isReadable: true,
          readingUrl: `/read/${n.slug}/1`,
          contentType: "full_text" as const,
        };
      });
    }

    return NextResponse.json({
      success: true,
      novels: results,
      pagination: {
        page,
        limit,
        total: Math.max(total, results.length),
        totalPages: Math.ceil(Math.max(total, results.length) / limit),
      },
    });
  } catch (error) {
    console.error("[Novels API Error]", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

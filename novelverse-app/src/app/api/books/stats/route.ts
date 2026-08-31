import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Novel, Chapter, Genre } from "@/models";

export async function GET() {
  try {
    await connectToDatabase();

    const [
      totalNovels,
      totalChapters,
      totalGenres,
      publicDomainNovels,
      readableNovels,
      gutenbergNovels,
      openLibraryNovels,
      googleBooksNovels,
      manualNovels,
      recentImports,
    ] = await Promise.all([
      Novel.countDocuments(),
      Chapter.countDocuments(),
      Genre.countDocuments(),
      Novel.countDocuments({ isPublicDomain: true }),
      Novel.countDocuments({ isReadable: true }),
      Novel.countDocuments({ source: "gutenberg" }),
      Novel.countDocuments({ source: "openlibrary" }),
      Novel.countDocuments({ source: "googlebooks" }),
      Novel.countDocuments({ source: { $in: ["manual", null] } }),
      Novel.find()
        .select("title slug author rating chapterCount coverUrl source isReadable isPublicDomain createdAt")
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalNovels,
        totalChapters,
        totalGenres,
        publicDomainNovels,
        readableNovels,
        sources: {
          gutenberg: gutenbergNovels,
          openlibrary: openLibraryNovels,
          googlebooks: googleBooksNovels,
          manual: manualNovels,
        },
      },
      recentImports,
    });
  } catch (error) {
    console.error("[API Books Stats Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch catalog statistics" },
      { status: 500 }
    );
  }
}

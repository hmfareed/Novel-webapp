import { NextRequest, NextResponse } from "next/server";
import { searchGlobalNovels } from "@/services/novel-ingester";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || searchParams.get("q") || "";
    const topic = searchParams.get("topic") || "";
    const page = parseInt(searchParams.get("page") || "1", 10) || 1;

    const result = await searchGlobalNovels({ query, topic, page });

    return NextResponse.json({
      success: true,
      count: result.count,
      results: result.results,
      page,
    });
  } catch (error) {
    console.error("[Search Global Route Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to search global catalog" },
      { status: 500 }
    );
  }
}

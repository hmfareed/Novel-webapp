import { NextRequest, NextResponse } from "next/server";
import { searchGutenberg } from "@/services/books/gutenberg.service";
import { searchOpenLibrary } from "@/services/books/open-library.service";
import { searchGoogleBooks } from "@/services/books/google-books.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source") || "gutenberg";
    const query = searchParams.get("query") || "";
    const topic = searchParams.get("topic") || searchParams.get("genre") || "";
    const author = searchParams.get("author") || "";
    const isbn = searchParams.get("isbn") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);

    if (source === "gutenberg") {
      const data = await searchGutenberg({ query, topic, page });
      return NextResponse.json({ success: true, source: "gutenberg", ...data });
    }

    if (source === "openlibrary") {
      const data = await searchOpenLibrary({ query, subject: topic, author, page });
      return NextResponse.json({ success: true, source: "openlibrary", ...data });
    }

    if (source === "googlebooks") {
      const data = await searchGoogleBooks({ query, author, isbn, genre: topic, page });
      return NextResponse.json({ success: true, source: "googlebooks", ...data });
    }

    return NextResponse.json(
      { success: false, error: `Invalid source: ${source}. Use gutenberg, openlibrary, or googlebooks.` },
      { status: 400 }
    );
  } catch (error) {
    console.error("[API Books Search Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to perform book search across catalog APIs." },
      { status: 500 }
    );
  }
}

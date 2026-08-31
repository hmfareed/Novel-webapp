import { NextRequest, NextResponse } from "next/server";
import { importBookByPayload } from "@/services/books/book-import.service";
import { z } from "zod";

const ImportBookSchema = z.object({
  source: z.enum(["gutenberg", "openlibrary", "googlebooks", "manual"]),
  sourceId: z.string().optional(),
  title: z.string().optional(),
  author: z.string().optional(),
  genre: z.string().optional(),
  synopsis: z.string().optional(),
  coverUrl: z.string().optional(),
  rawText: z.string().optional(),
  isPublicDomain: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = ImportBookSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: parseResult.error.issues[0]?.message || "Invalid import payload",
        },
        { status: 400 }
      );
    }

    const result = await importBookByPayload(parseResult.data);

    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[API Books Import Error]", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Failed to import book into catalog database.",
      },
      { status: 500 }
    );
  }
}

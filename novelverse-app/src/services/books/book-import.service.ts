/**
 * Book Import Service
 * Handles MongoDB upserting, chapter ingestion, genre synchronization, deduplication,
 * and batch importing from external sources.
 */

import { connectToDatabase } from "@/lib/db";
import { Novel, Chapter, Genre } from "@/models";
import { NormalizedBook, ImportBookPayload } from "@/types/book";
import { fetchGutenbergText } from "./gutenberg.service";
import { fetchOpenLibraryWork } from "./open-library.service";
import { fetchGoogleBookVolume } from "./google-books.service";
import {
  normalizeGutenbergBook,
  normalizeOpenLibraryBook,
  normalizeGoogleBook,
  normalizeManualBook,
} from "./book-normalizer";

export interface ImportResult {
  success: boolean;
  novelId?: string;
  slug: string;
  title: string;
  chapterCount: number;
  wordCount: number;
  source: string;
  isReadable: boolean;
  message?: string;
}

/**
 * Saves a NormalizedBook and its chapters to MongoDB
 */
export async function saveNormalizedBook(bookData: NormalizedBook): Promise<{
  novelId: string;
  slug: string;
  chapterCount: number;
}> {
  await connectToDatabase();

  // 1. Ensure genres exist and update counts
  for (const g of bookData.genres) {
    await Genre.findOneAndUpdate(
      { slug: g.slug },
      {
        $setOnInsert: {
          name: g.name,
          slug: g.slug,
          color: "#8b5cf6",
          description: `${g.name} novels and stories`,
          novelCount: 0,
        },
        $inc: { novelCount: 1 },
      },
      { upsert: true }
    );
  }

  // 2. Separate chapters from novel document
  const { chapters, ...novelFields } = bookData;

  // 3. Upsert novel by (source + sourceId) if present, otherwise by slug
  let query: Record<string, unknown> = { slug: bookData.slug };
  if (bookData.source && bookData.sourceId) {
    query = {
      $or: [
        { source: bookData.source, sourceId: String(bookData.sourceId) },
        { slug: bookData.slug },
      ],
    };
  }

  const savedNovel = await Novel.findOneAndUpdate(
    query,
    {
      $set: {
        ...novelFields,
        chapterCount: chapters ? chapters.length : 0,
      },
    },
    { upsert: true, new: true }
  );

  // 4. Save all chapters if present
  if (chapters && chapters.length > 0) {
    for (const ch of chapters) {
      await Chapter.findOneAndUpdate(
        { novelId: savedNovel._id, chapterNumber: ch.chapterNumber },
        {
          $set: {
            novelId: savedNovel._id,
            chapterNumber: ch.chapterNumber,
            title: ch.title,
            content: ch.content,
            wordCount: ch.wordCount,
            isPremium: ch.isPremium,
            status: "PUBLISHED",
          },
        },
        { upsert: true, new: true }
      );
    }
  }

  return {
    novelId: String(savedNovel._id),
    slug: savedNovel.slug,
    chapterCount: chapters ? chapters.length : 0,
  };
}

/**
 * Universal importer for any source payload
 */
export async function importBookByPayload(payload: ImportBookPayload): Promise<ImportResult> {
  const { source, sourceId } = payload;

  if (source === "gutenberg") {
    if (!sourceId) throw new Error("sourceId (Gutenberg ID) is required for Gutenberg import.");
    const { meta, rawText } = await fetchGutenbergText(sourceId);
    if (!meta) throw new Error(`Could not retrieve metadata for Gutenberg ID ${sourceId}`);

    const normalized = normalizeGutenbergBook(meta, rawText);
    const result = await saveNormalizedBook(normalized);

    return {
      success: true,
      novelId: result.novelId,
      slug: result.slug,
      title: normalized.title,
      chapterCount: result.chapterCount,
      wordCount: normalized.wordCount,
      source: "gutenberg",
      isReadable: true,
      message: `Successfully ingested "${normalized.title}" with ${result.chapterCount} complete chapters.`,
    };
  }

  if (source === "openlibrary") {
    if (!sourceId) throw new Error("sourceId (Work Key) is required for Open Library import.");
    const workData = await fetchOpenLibraryWork(sourceId);
    if (!workData) throw new Error(`Could not fetch Open Library Work ${sourceId}`);

    const normalized = normalizeOpenLibraryBook({
      id: sourceId,
      ...workData,
    });
    const result = await saveNormalizedBook(normalized);

    return {
      success: true,
      novelId: result.novelId,
      slug: result.slug,
      title: normalized.title,
      chapterCount: 0,
      wordCount: normalized.wordCount,
      source: "openlibrary",
      isReadable: false,
      message: `Successfully imported Open Library metadata for "${normalized.title}".`,
    };
  }

  if (source === "googlebooks") {
    if (!sourceId) throw new Error("sourceId (Volume ID) is required for Google Books import.");
    const volume = await fetchGoogleBookVolume(sourceId);
    if (!volume) throw new Error(`Could not fetch Google Books volume ${sourceId}`);

    const normalized = normalizeGoogleBook(volume);
    const result = await saveNormalizedBook(normalized);

    return {
      success: true,
      novelId: result.novelId,
      slug: result.slug,
      title: normalized.title,
      chapterCount: 0,
      wordCount: normalized.wordCount,
      source: "googlebooks",
      isReadable: normalized.isReadable,
      message: `Successfully imported Google Books record for "${normalized.title}".`,
    };
  }

  if (source === "manual") {
    if (!payload.title || !payload.rawText) {
      throw new Error("Title and rawText are required for manual manuscript ingestion.");
    }

    const normalized = normalizeManualBook({
      title: payload.title,
      author: payload.author || "NovelVerse Author",
      genre: payload.genre,
      synopsis: payload.synopsis,
      coverUrl: payload.coverUrl,
      rawText: payload.rawText,
      isPublicDomain: payload.isPublicDomain,
    });

    const result = await saveNormalizedBook(normalized);

    return {
      success: true,
      novelId: result.novelId,
      slug: result.slug,
      title: normalized.title,
      chapterCount: result.chapterCount,
      wordCount: normalized.wordCount,
      source: "manual",
      isReadable: true,
      message: `Successfully saved custom novel "${normalized.title}" with ${result.chapterCount} chapters.`,
    };
  }

  throw new Error(`Unsupported source: ${source}`);
}

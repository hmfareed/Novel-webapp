import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { importBookByPayload } from "@/services/books/book-import.service";
import { SEED_NOVELS } from "@/lib/seed-data";
import { Novel, Chapter, Genre } from "@/models";

// Iconic Gutenberg IDs to seed
const SEED_GUTENBERG_IDS = [
  "84",    // Frankenstein (Mary Shelley)
  "345",   // Dracula (Bram Stoker)
  "1661",  // The Adventures of Sherlock Holmes (Arthur Conan Doyle)
  "35",    // The Time Machine (H.G. Wells)
  "1342",  // Pride and Prejudice (Jane Austen)
  "11",    // Alice's Adventures in Wonderland (Lewis Carroll)
  "2701",  // Moby Dick (Herman Melville)
  "98",    // A Tale of Two Cities (Charles Dickens)
  "74",    // The Adventures of Tom Sawyer (Mark Twain)
];

// Curated Open Library works to seed
const SEED_OPENLIBRARY_WORKS = [
  "OL45804W", // Dune (Frank Herbert)
  "OL262758W", // The Hobbit (J.R.R. Tolkien)
  "OL82563W", // 1984 (George Orwell)
  "OL17860744W", // Things Fall Apart (Chinua Achebe)
];

// Curated Google Books volume IDs to seed
const SEED_GOOGLEBOOKS_VOLUMES = [
  "f280CwAAQBAJ", // The Name of the Wind
  "u_YdEAAAQBAJ", // The Way of Kings
  "haC7DwAAQBAJ", // Children of Blood and Bone (Tomi Adeyemi)
];

export async function POST() {
  try {
    await connectToDatabase();

    const results: Array<{
      title: string;
      source: string;
      status: "success" | "skipped" | "error";
      chapterCount?: number;
      error?: string;
    }> = [];

    // 1. Seed Original & African Epics from SEED_NOVELS
    for (const seedNovel of SEED_NOVELS) {
      try {
        const { chapters, ...novelFields } = seedNovel;
        
        // Ensure genres exist
        for (const g of seedNovel.genres) {
          await Genre.findOneAndUpdate(
            { slug: g.slug },
            {
              $setOnInsert: {
                name: g.name,
                slug: g.slug,
                color: "#8b5cf6",
                description: `${g.name} novels`,
                novelCount: 0,
              },
              $inc: { novelCount: 1 },
            },
            { upsert: true }
          );
        }

        const isGutenberg =
          seedNovel.slug === "dracula" ||
          seedNovel.slug === "the-adventures-of-sherlock-holmes" ||
          seedNovel.slug === "the-time-machine" ||
          seedNovel.slug === "pride-and-prejudice";

        const savedNovel = await Novel.findOneAndUpdate(
          { slug: seedNovel.slug },
          {
            $set: {
              ...novelFields,
              source: isGutenberg ? "gutenberg" : "manual",
              sourceId: isGutenberg ? seedNovel.slug : `manual-${seedNovel.slug}`,
              isPublicDomain: isGutenberg,
              isReadable: true,
              contentType: "full_text",
              readingUrl: `/read/${seedNovel.slug}/1`,
              chapterCount: chapters ? chapters.length : 0,
            },
          },
          { upsert: true, new: true }
        );

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

        results.push({
          title: seedNovel.title,
          source: isGutenberg ? "gutenberg" : "manual",
          status: "success",
          chapterCount: chapters.length,
        });
      } catch (err: unknown) {
        const error = err as Error;
        results.push({
          title: seedNovel.title,
          source: "seed",
          status: "error",
          error: error.message,
        });
      }
    }

    // 2. Seed Gutenberg Classics
    for (const gid of SEED_GUTENBERG_IDS.slice(0, 4)) {
      try {
        const res = await importBookByPayload({
          source: "gutenberg",
          sourceId: gid,
        });
        results.push({
          title: res.title,
          source: "gutenberg",
          status: "success",
          chapterCount: res.chapterCount,
        });
      } catch (err: unknown) {
        const error = err as Error;
        results.push({
          title: `Gutenberg ID ${gid}`,
          source: "gutenberg",
          status: "error",
          error: error.message,
        });
      }
    }

    // 3. Seed Open Library Works
    for (const olid of SEED_OPENLIBRARY_WORKS.slice(0, 2)) {
      try {
        const res = await importBookByPayload({
          source: "openlibrary",
          sourceId: olid,
        });
        results.push({
          title: res.title,
          source: "openlibrary",
          status: "success",
          chapterCount: 0,
        });
      } catch (err: unknown) {
        const error = err as Error;
        results.push({
          title: `Open Library ID ${olid}`,
          source: "openlibrary",
          status: "error",
          error: error.message,
        });
      }
    }

    // 4. Seed Google Books Volumes
    for (const gbid of SEED_GOOGLEBOOKS_VOLUMES.slice(0, 2)) {
      try {
        const res = await importBookByPayload({
          source: "googlebooks",
          sourceId: gbid,
        });
        results.push({
          title: res.title,
          source: "googlebooks",
          status: "success",
          chapterCount: 0,
        });
      } catch (err: unknown) {
        const error = err as Error;
        results.push({
          title: `Google Books ID ${gbid}`,
          source: "googlebooks",
          status: "error",
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${results.filter((r) => r.status === "success").length} novels from Gutenberg, Open Library, Google Books, and Original stories.`,
      results,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[Seed Library API Error]", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to seed catalog." },
      { status: 500 }
    );
  }
}

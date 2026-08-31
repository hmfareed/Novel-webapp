/**
 * NovelVerse — Standalone Library Seeder Script
 * Seeds iconic novels from Project Gutenberg, Open Library, Google Books,
 * and Original African Folklore / Manuscripts into MongoDB.
 *
 * Usage:
 *   npx tsx scripts/seed-library.ts
 */

import { connectToDatabase } from "../src/lib/db";
import { importBookByPayload } from "../src/services/books/book-import.service";
import { SEED_NOVELS } from "../src/lib/seed-data";
import { Novel, Chapter, Genre } from "../src/models";

const GUTENBERG_CLASSICS = [
  "84",   // Frankenstein
  "345",  // Dracula
  "1661", // Sherlock Holmes
  "35",   // The Time Machine
  "1342", // Pride and Prejudice
];

const OPENLIBRARY_WORKS = [
  "OL45804W",   // Dune
  "OL262758W",  // The Hobbit
  "OL82563W",   // 1984
];

const GOOGLEBOOKS_VOLUMES = [
  "f280CwAAQBAJ", // The Name of the Wind
  "haC7DwAAQBAJ", // Children of Blood and Bone
];

async function seedLibrary() {
  console.log("🌟 [NovelVerse Seeder] Connecting to MongoDB...");
  await connectToDatabase();
  console.log(" Connected to MongoDB successfully.");

  // 1. Seed Original & African Epics
  console.log("\n📚 Seeding Original & African Epic Manuscripts...");
  for (const novel of SEED_NOVELS) {
    try {
      const { chapters, ...novelFields } = novel;
      
      for (const g of novel.genres) {
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
        novel.slug === "dracula" ||
        novel.slug === "the-adventures-of-sherlock-holmes" ||
        novel.slug === "the-time-machine" ||
        novel.slug === "pride-and-prejudice";

      const saved = await Novel.findOneAndUpdate(
        { slug: novel.slug },
        {
          $set: {
            ...novelFields,
            source: isGutenberg ? "gutenberg" : "manual",
            sourceId: isGutenberg ? novel.slug : `manual-${novel.slug}`,
            isPublicDomain: isGutenberg,
            isReadable: true,
            contentType: "full_text",
            readingUrl: `/read/${novel.slug}/1`,
            chapterCount: chapters ? chapters.length : 0,
          },
        },
        { upsert: true, new: true }
      );

      if (chapters && chapters.length > 0) {
        for (const ch of chapters) {
          await Chapter.findOneAndUpdate(
            { novelId: saved._id, chapterNumber: ch.chapterNumber },
            {
              $set: {
                novelId: saved._id,
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

      console.log(`  ✅ Seeded "${novel.title}" (${chapters?.length || 0} chapters)`);
    } catch (err: any) {
      console.warn(`  ❌ Failed to seed "${novel.title}":`, err.message);
    }
  }

  // 2. Seed Project Gutenberg Classics
  console.log("\n📖 Seeding Project Gutenberg Unabridged Classics...");
  for (const gid of GUTENBERG_CLASSICS) {
    try {
      const res = await importBookByPayload({ source: "gutenberg", sourceId: gid });
      console.log(`  ✅ Gutenberg: "${res.title}" (${res.chapterCount} chapters)`);
    } catch (err: any) {
      console.warn(`  ⚠️ Gutenberg ID ${gid} skipped:`, err.message);
    }
  }

  // 3. Seed Open Library Works
  console.log("\n🏛️ Seeding Open Library Works...");
  for (const olid of OPENLIBRARY_WORKS) {
    try {
      const res = await importBookByPayload({ source: "openlibrary", sourceId: olid });
      console.log(`  ✅ Open Library: "${res.title}"`);
    } catch (err: any) {
      console.warn(`  ⚠️ Open Library ID ${olid} skipped:`, err.message);
    }
  }

  // 4. Seed Google Books Volumes
  console.log("\n🌐 Seeding Google Books Records...");
  for (const gbid of GOOGLEBOOKS_VOLUMES) {
    try {
      const res = await importBookByPayload({ source: "googlebooks", sourceId: gbid });
      console.log(`  ✅ Google Books: "${res.title}"`);
    } catch (err: any) {
      console.warn(`  ⚠️ Google Books ID ${gbid} skipped:`, err.message);
    }
  }

  console.log("\n🎉 [NovelVerse Seeder] All sources successfully seeded into catalog!");
  process.exit(0);
}

seedLibrary().catch((err) => {
  console.error("Fatal Seeder Error:", err);
  process.exit(1);
});

import mongoose, { Schema, Document, Model } from "mongoose";
import type { NovelStatus } from "@/types";

export interface IStoryDNA {
  romance: number;
  politics: number;
  action: number;
  drama: number;
  magic: number;
}

export interface INovelAuthor {
  authorId?: string;
  name: string;
  username: string;
  avatar?: string;
  verified?: boolean;
}

export interface INovelGenre {
  id: string;
  name: string;
  slug: string;
}

export interface ICopyrightDeclaration {
  confirmed: boolean;              // author checked the declaration checkbox
  confirmedAt?: Date;
  license: "ALL_RIGHTS_RESERVED" | "CC_BY" | "CC_BY_SA" | "CC0_PUBLIC_DOMAIN";
  statementText?: string;          // optional personal statement
}

export interface INovel extends Document {
  slug: string;
  title: string;
  subtitle?: string;
  synopsis: string;
  description?: string;
  coverUrl?: string;
  bannerUrl?: string;
  author: INovelAuthor;
  genres: INovelGenre[];

  // Multi-dimensional taxonomy (second-plan §12)
  subgenres: string[];             // e.g. ["Epic Fantasy", "Dark Fantasy"]
  themes: string[];                // e.g. ["Revenge", "Found Family", "Chosen One"]
  tropes: string[];                // e.g. ["Enemies to Lovers", "Slow Burn"]
  moods: string[];                 // e.g. ["Dark", "Comforting", "Suspenseful"]
  contentWarnings: string[];       // e.g. ["Violence", "Strong Language"]

  tags: string[];
  status: NovelStatus;
  rating: number;
  reviewCount: number;
  readCount: number;
  followersCount: number;          // users following this novel for updates
  chapterCount: number;
  wordCount: number;
  estimatedReadingMinutes: number; // derived: wordCount / 200 avg reading speed

  isPremium: boolean;
  isCompleted: boolean;
  featured: boolean;

  // Content classification (second-plan §29)
  contentClass: "COMMUNITY" | "STUDIO_ORIGINAL" | "PUBLIC_DOMAIN" | "LICENSED";
  // Novel format (second-plan §8)
  novelFormat: "STANDARD" | "ENHANCED" | "CINEMATIC" | "AUDIO";
  // AI disclosure (second-plan §28)
  aiAssisted: boolean;
  aiAssistedLabel?: string;        // e.g. "AI-assisted · Written by Mohammed Fareed"

  mood?: string;
  category?: "african_stories" | "dark_fantasy" | "trending" | "popular" | "new_releases";
  storyDna: IStoryDNA;
  ageRating: string;
  language: string;
  languages: string[];             // multi-language support

  // Copyright (second-plan §17)
  copyright: ICopyrightDeclaration;

  publisher?: string;
  publishedDate?: string;
  isbn10?: string;
  isbn13?: string;
  pageCount?: number;
  source?: "gutenberg" | "openlibrary" | "googlebooks" | "manual";
  sourceId?: string;
  sourceUrl?: string;
  previewUrl?: string;
  readingUrl?: string;
  contentType?: "full_text" | "metadata_only" | "preview_only";
  isPublicDomain?: boolean;
  isReadable?: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NovelSchema = new Schema<INovel>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, index: "text" },
    subtitle: { type: String, default: "" },
    synopsis: { type: String, required: true },
    description: { type: String, default: "" },
    coverUrl: { type: String, default: "" },
    bannerUrl: { type: String, default: "" },
    author: {
      authorId: { type: String },
      name: { type: String, required: true },
      username: { type: String, required: true },
      avatar: { type: String, default: "" },
      verified: { type: Boolean, default: false },
    },
    genres: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        slug: { type: String, required: true },
      },
    ],

    // Multi-dimensional taxonomy
    subgenres: [{ type: String }],
    themes: [{ type: String }],
    tropes: [{ type: String }],
    moods: [{ type: String }],
    contentWarnings: [{ type: String }],

    tags: [{ type: String }],
    status: {
      type: String,
      enum: [
        "DRAFT",
        "SUBMITTED",
        "UNDER_REVIEW",
        "APPROVED",
        "SCHEDULED",
        "PUBLISHED",
        "ONGOING",
        "REJECTED",
        "SUSPENDED",
        "COMPLETED",
        "HIATUS",
        "CANCELLED",
      ],
      default: "PUBLISHED",
      index: true,
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    readCount: { type: Number, default: 0 },
    followersCount: { type: Number, default: 0 },
    chapterCount: { type: Number, default: 0 },
    wordCount: { type: Number, default: 0 },
    estimatedReadingMinutes: { type: Number, default: 0 },
    isPremium: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    featured: { type: Boolean, default: false, index: true },

    // Content classification
    contentClass: {
      type: String,
      enum: ["COMMUNITY", "STUDIO_ORIGINAL", "PUBLIC_DOMAIN", "LICENSED"],
      default: "COMMUNITY",
      index: true,
    },
    novelFormat: {
      type: String,
      enum: ["STANDARD", "ENHANCED", "CINEMATIC", "AUDIO"],
      default: "STANDARD",
    },
    aiAssisted: { type: Boolean, default: false, index: true },
    aiAssistedLabel: { type: String, default: "" },

    mood: { type: String, default: "" },
    category: { type: String, default: "popular" },
    storyDna: {
      romance: { type: Number, default: 50 },
      politics: { type: Number, default: 50 },
      action: { type: Number, default: 50 },
      drama: { type: Number, default: 50 },
      magic: { type: Number, default: 50 },
    },
    ageRating: { type: String, default: "16+" },
    language: { type: String, default: "English" },
    languages: [{ type: String }],

    // Copyright declaration
    copyright: {
      confirmed: { type: Boolean, default: false },
      confirmedAt: { type: Date },
      license: {
        type: String,
        enum: ["ALL_RIGHTS_RESERVED", "CC_BY", "CC_BY_SA", "CC0_PUBLIC_DOMAIN"],
        default: "ALL_RIGHTS_RESERVED",
      },
      statementText: { type: String, default: "" },
    },

    publisher: { type: String, default: "" },
    publishedDate: { type: String, default: "" },
    isbn10: { type: String, default: "" },
    isbn13: { type: String, default: "" },
    pageCount: { type: Number, default: 0 },
    source: {
      type: String,
      enum: ["gutenberg", "openlibrary", "googlebooks", "manual"],
      default: "manual",
      index: true,
    },
    sourceId: { type: String, default: "", index: true },
    sourceUrl: { type: String, default: "" },
    previewUrl: { type: String, default: "" },
    readingUrl: { type: String, default: "" },
    contentType: {
      type: String,
      enum: ["full_text", "metadata_only", "preview_only"],
      default: "full_text",
    },
    isPublicDomain: { type: Boolean, default: false },
    isReadable: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

NovelSchema.index({ "genres.slug": 1 });
NovelSchema.index({ rating: -1, readCount: -1 });
NovelSchema.index({ source: 1, sourceId: 1 }, { sparse: true });
NovelSchema.index({ contentClass: 1, status: 1 });
NovelSchema.index({ moods: 1, subgenres: 1 });
NovelSchema.index({ themes: 1 });

export const Novel: Model<INovel> =
  mongoose.models.Novel || mongoose.model<INovel>("Novel", NovelSchema);

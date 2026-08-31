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
  tags: string[];
  status: NovelStatus;
  rating: number;
  reviewCount: number;
  readCount: number;
  chapterCount: number;
  wordCount: number;
  isPremium: boolean;
  isCompleted: boolean;
  featured: boolean;
  mood?: string;
  category?: "african_stories" | "dark_fantasy" | "trending" | "popular" | "new_releases";
  storyDna: IStoryDNA;
  ageRating: string;
  language: string;
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
    chapterCount: { type: Number, default: 0 },
    wordCount: { type: Number, default: 0 },
    isPremium: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    featured: { type: Boolean, default: false, index: true },
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

export const Novel: Model<INovel> =
  mongoose.models.Novel || mongoose.model<INovel>("Novel", NovelSchema);

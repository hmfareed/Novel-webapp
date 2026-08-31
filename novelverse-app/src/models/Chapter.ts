import mongoose, { Schema, Document, Model } from "mongoose";
import type { ChapterStatus } from "@/types";

export interface IChapter extends Document {
  novelId: mongoose.Types.ObjectId;
  chapterNumber: number;
  title: string;
  content: string;
  wordCount: number;
  status: ChapterStatus;
  isPremium: boolean;
  price?: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ChapterSchema = new Schema<IChapter>(
  {
    novelId: {
      type: Schema.Types.ObjectId,
      ref: "Novel",
      required: true,
      index: true,
    },
    chapterNumber: { type: Number, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    wordCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "PUBLISHED", "REJECTED"],
      default: "PUBLISHED",
      index: true,
    },
    isPremium: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
    publishedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

ChapterSchema.index({ novelId: 1, chapterNumber: 1 }, { unique: true });

export const Chapter: Model<IChapter> =
  mongoose.models.Chapter || mongoose.model<IChapter>("Chapter", ChapterSchema);

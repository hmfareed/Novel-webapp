import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReadingProgress extends Document {
  userId: string;
  novelId?: mongoose.Types.ObjectId;
  novelSlug: string;
  novelTitle?: string;
  novelCoverUrl?: string;
  authorName?: string;
  totalChapters?: number;
  chapterId?: mongoose.Types.ObjectId;
  chapterNumber: number;
  position: number; // 0 to 100 percentage scroll in chapter
  percentage: number; // 0 to 100 overall novel read percentage
  completed: boolean;
  timeSpentSeconds: number;
  lastReadAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReadingProgressSchema = new Schema<IReadingProgress>(
  {
    userId: { type: String, required: true, index: true },
    novelId: {
      type: Schema.Types.ObjectId,
      ref: "Novel",
      required: false,
      index: true,
    },
    novelSlug: { type: String, required: true, index: true },
    novelTitle: { type: String, default: "" },
    novelCoverUrl: { type: String, default: "" },
    authorName: { type: String, default: "" },
    totalChapters: { type: Number, default: 1 },
    chapterId: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
      required: false,
    },
    chapterNumber: { type: Number, required: true, default: 1 },
    position: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    timeSpentSeconds: { type: Number, default: 0 },
    lastReadAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

ReadingProgressSchema.index({ userId: 1, novelSlug: 1 }, { unique: true });

export const ReadingProgress: Model<IReadingProgress> =
  mongoose.models.ReadingProgress ||
  mongoose.model<IReadingProgress>("ReadingProgress", ReadingProgressSchema);


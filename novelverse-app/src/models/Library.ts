import mongoose, { Schema, Document, Model } from "mongoose";

export type LibraryStatus = "READING" | "WANT_TO_READ" | "COMPLETED" | "DOWNLOADED" | "BOOKMARKED";

export interface ILibrary extends Document {
  userId: string;
  novelId?: mongoose.Types.ObjectId;
  novelSlug: string;
  novelTitle?: string;
  novelCoverUrl?: string;
  authorName?: string;
  rating?: number;
  chapterCount?: number;
  status: LibraryStatus;
  isFavorite: boolean;
  addedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LibrarySchema = new Schema<ILibrary>(
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
    rating: { type: Number, default: 4.8 },
    chapterCount: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["READING", "WANT_TO_READ", "COMPLETED", "DOWNLOADED", "BOOKMARKED"],
      default: "READING",
      index: true,
    },
    isFavorite: { type: Boolean, default: false, index: true },
    addedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

LibrarySchema.index({ userId: 1, novelSlug: 1 }, { unique: true });

export const Library: Model<ILibrary> =
  mongoose.models.Library || mongoose.model<ILibrary>("Library", LibrarySchema);


import mongoose, { Schema, Document, Model } from "mongoose";
import type { ChapterStatus } from "@/types";

/* ── Scene sub-document ───────────────────────────────────────── */
export interface IScene {
  _id?: mongoose.Types.ObjectId;
  order: number;                       // 1-based within the chapter
  text: string;                        // main scene text / prose
  illustrationUrl?: string;            // optional scene artwork (CDN URL)
  ambientAudioUrl?: string;            // optional ambient sound (CDN URL)
  narrationAudioUrl?: string;          // optional TTS narration (CDN URL)
  musicTrackUrl?: string;              // optional music
  transitionType?: "NONE" | "FADE" | "SCROLL" | "CUT"; // scene transition
}

/* ── Chapter Document ─────────────────────────────────────────── */
export interface IChapter extends Document {
  novelId: mongoose.Types.ObjectId;
  chapterNumber: number;
  title: string;

  // Content — either flat string OR scene-based (not both)
  content: string;                     // flat text (STANDARD format)
  scenes: IScene[];                    // structured scenes (ENHANCED / CINEMATIC)

  wordCount: number;
  status: ChapterStatus;
  isPremium: boolean;
  price?: number;

  // Arc / story structure (second-plan §10)
  arcName?: string;                    // e.g. "Arc I — The Gathering Storm"
  arcNumber?: number;

  // Schedule (second-plan §15 & Author Studio)
  scheduledAt?: Date;                  // if set, publish automatically at this time
  publishedAt?: Date;

  // Author notes shown below the chapter
  authorNote?: string;

  // Chapter opening artwork
  openingIllustrationUrl?: string;

  // Engagement counters (denormalized for fast display)
  likeCount: number;
  commentCount: number;
  viewCount: number;

  createdAt: Date;
  updatedAt: Date;
}

/* ── Schema ───────────────────────────────────────────────────── */
const SceneSchema = new Schema<IScene>({
  order: { type: Number, required: true },
  text: { type: String, required: true },
  illustrationUrl: { type: String },
  ambientAudioUrl: { type: String },
  narrationAudioUrl: { type: String },
  musicTrackUrl: { type: String },
  transitionType: {
    type: String,
    enum: ["NONE", "FADE", "SCROLL", "CUT"],
    default: "NONE",
  },
});

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

    content: { type: String, default: "" },
    scenes: [SceneSchema],

    wordCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "SCHEDULED", "PUBLISHED", "REJECTED"],
      default: "PUBLISHED",
      index: true,
    },
    isPremium: { type: Boolean, default: false },
    price: { type: Number, default: 0 },

    arcName: { type: String, default: "" },
    arcNumber: { type: Number },

    scheduledAt: { type: Date },
    publishedAt: { type: Date, default: Date.now },

    authorNote: { type: String, default: "" },
    openingIllustrationUrl: { type: String, default: "" },

    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

ChapterSchema.index({ novelId: 1, chapterNumber: 1 }, { unique: true });
ChapterSchema.index({ novelId: 1, status: 1 });
ChapterSchema.index({ scheduledAt: 1 }, { sparse: true }); // for scheduled publish job

export const Chapter: Model<IChapter> =
  mongoose.models.Chapter || mongoose.model<IChapter>("Chapter", ChapterSchema);

import mongoose, { Schema, Document, Model } from "mongoose";

/* ── Social link ──────────────────────────────────────────────── */
export interface ISocialLink {
  platform: "twitter" | "instagram" | "youtube" | "tiktok" | "website" | "patreon" | "other";
  url: string;
  label?: string;
}

/* ── Author Profile Document ──────────────────────────────────── */
export interface IAuthorProfile extends Document {
  userId: mongoose.Types.ObjectId;      // ref → User
  displayName: string;                  // e.g. "A.R. Mensah" (can differ from username)
  bio: string;
  tagline?: string;                     // short one-liner e.g. "Dark fantasy, epic journeys"
  avatarUrl?: string;
  bannerUrl?: string;
  location?: string;
  socialLinks: ISocialLink[];
  genres: string[];                     // preferred writing genres

  // Verification & status
  isVerified: boolean;
  verifiedAt?: Date;
  isPlatformOriginalAuthor: boolean;    // platform staff / AI studio account

  // Metrics (denormalized for fast display)
  totalNovels: number;
  totalFollowers: number;
  totalChaptersPublished: number;
  totalWordCount: number;
  totalReads: number;

  // Revenue & monetization
  revenueSharePercentage: number;       // 0–100 (platform default: 70%)
  stripeAccountId?: string;            // connected Stripe Express account
  paypalEmail?: string;

  // Earned stats (lifetime)
  totalEarnedCoins: number;            // platform coins
  totalPayoutUSD: number;             // real-money payouts (cents)

  // Author program tier
  tier: "STARTER" | "RISING" | "ESTABLISHED" | "ELITE";

  // Settings
  enableComments: boolean;
  enableFanart: boolean;
  acceptingCollaborations: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/* ── Schema ───────────────────────────────────────────────────── */
const AuthorProfileSchema = new Schema<IAuthorProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    displayName: { type: String, required: true, trim: true },
    bio: { type: String, default: "" },
    tagline: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    bannerUrl: { type: String, default: "" },
    location: { type: String, default: "" },
    socialLinks: [
      {
        platform: {
          type: String,
          enum: ["twitter", "instagram", "youtube", "tiktok", "website", "patreon", "other"],
          required: true,
        },
        url: { type: String, required: true },
        label: { type: String, default: "" },
      },
    ],
    genres: [{ type: String }],

    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    isPlatformOriginalAuthor: { type: Boolean, default: false, index: true },

    totalNovels: { type: Number, default: 0 },
    totalFollowers: { type: Number, default: 0 },
    totalChaptersPublished: { type: Number, default: 0 },
    totalWordCount: { type: Number, default: 0 },
    totalReads: { type: Number, default: 0 },

    revenueSharePercentage: { type: Number, default: 70, min: 0, max: 100 },
    stripeAccountId: { type: String, default: "", sparse: true },
    paypalEmail: { type: String, default: "" },

    totalEarnedCoins: { type: Number, default: 0 },
    totalPayoutUSD: { type: Number, default: 0 },

    tier: {
      type: String,
      enum: ["STARTER", "RISING", "ESTABLISHED", "ELITE"],
      default: "STARTER",
      index: true,
    },

    enableComments: { type: Boolean, default: true },
    enableFanart: { type: Boolean, default: true },
    acceptingCollaborations: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

/* ── Compound index for fast author discovery ──────────────────── */
AuthorProfileSchema.index({ totalFollowers: -1, tier: 1 });

export const AuthorProfile: Model<IAuthorProfile> =
  mongoose.models.AuthorProfile ||
  mongoose.model<IAuthorProfile>("AuthorProfile", AuthorProfileSchema);

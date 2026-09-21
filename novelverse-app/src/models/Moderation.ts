import mongoose, { Schema, Document, Model } from "mongoose";

/* ================================================================
   MODERATION.TS  —  NovelVerse Trust & Safety Models
   Covers:
     • Report (user-submitted content reports)
     • ModerationCase (admin review of flagged content)
     • AutomatedFlag (AI/automated content screening result)
     • CopyrightClaim (DMCA-style copyright dispute process)
   ================================================================ */

/* ── Report ────────────────────────────────────────────────────── */
export type ReportReason =
  | "COPYRIGHT"
  | "HARASSMENT"
  | "HATE_SPEECH"
  | "SEXUAL_CONTENT"
  | "GRAPHIC_VIOLENCE"
  | "SPAM"
  | "MISINFORMATION"
  | "AI_ABUSE"            // using AI to flood platform with low-quality content
  | "UNDERAGE_CONTENT"
  | "OTHER";

export type ReportTargetType =
  | "NOVEL"
  | "CHAPTER"
  | "COMMENT"
  | "REVIEW"
  | "USER"
  | "GROUP_POST";

export interface IReport extends Document {
  reporterId: mongoose.Types.ObjectId;
  targetId: mongoose.Types.ObjectId;
  targetType: ReportTargetType;
  reason: ReportReason;
  details?: string;
  evidence?: string[];              // URLs to screenshots or other evidence
  status: "PENDING" | "UNDER_REVIEW" | "RESOLVED" | "DISMISSED";
  resolvedBy?: mongoose.Types.ObjectId;
  resolvedAt?: Date;
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reporterId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
    targetType: {
      type: String,
      enum: ["NOVEL", "CHAPTER", "COMMENT", "REVIEW", "USER", "GROUP_POST"],
      required: true,
    },
    reason: {
      type: String,
      enum: [
        "COPYRIGHT",
        "HARASSMENT",
        "HATE_SPEECH",
        "SEXUAL_CONTENT",
        "GRAPHIC_VIOLENCE",
        "SPAM",
        "MISINFORMATION",
        "AI_ABUSE",
        "UNDERAGE_CONTENT",
        "OTHER",
      ],
      required: true,
    },
    details: { type: String },
    evidence: [{ type: String }],
    status: {
      type: String,
      enum: ["PENDING", "UNDER_REVIEW", "RESOLVED", "DISMISSED"],
      default: "PENDING",
      index: true,
    },
    resolvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    resolvedAt: { type: Date },
    resolution: { type: String },
  },
  { timestamps: true }
);
ReportSchema.index({ status: 1, createdAt: -1 });

export const Report: Model<IReport> =
  mongoose.models.Report || mongoose.model<IReport>("Report", ReportSchema);

/* ── Moderation Case ───────────────────────────────────────────── */
export type ModerationAction =
  | "NO_ACTION"
  | "WARNING_ISSUED"
  | "CONTENT_EDITED"
  | "CONTENT_REMOVED"
  | "CONTENT_SUSPENDED"
  | "USER_WARNED"
  | "USER_SUSPENDED"
  | "USER_BANNED"
  | "REFERRED_TO_LEGAL";

export interface IModerationCase extends Document {
  reportIds: mongoose.Types.ObjectId[];  // one or more merged reports
  assignedTo?: mongoose.Types.ObjectId;  // moderator user ID
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "APPEALED" | "ESCALATED";
  action?: ModerationAction;
  actionNotes?: string;
  actionTakenAt?: Date;

  // Appeal
  appealedBy?: mongoose.Types.ObjectId;
  appealReason?: string;
  appealResolution?: string;

  // Audit trail
  timeline: Array<{
    actorId: mongoose.Types.ObjectId;
    action: string;
    note?: string;
    at: Date;
  }>;

  createdAt: Date;
  updatedAt: Date;
}

const ModerationCaseSchema = new Schema<IModerationCase>(
  {
    reportIds: [{ type: Schema.Types.ObjectId, ref: "Report" }],
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    priority: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], default: "MEDIUM" },
    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "APPEALED", "ESCALATED"],
      default: "OPEN",
      index: true,
    },
    action: {
      type: String,
      enum: [
        "NO_ACTION",
        "WARNING_ISSUED",
        "CONTENT_EDITED",
        "CONTENT_REMOVED",
        "CONTENT_SUSPENDED",
        "USER_WARNED",
        "USER_SUSPENDED",
        "USER_BANNED",
        "REFERRED_TO_LEGAL",
      ],
    },
    actionNotes: { type: String },
    actionTakenAt: { type: Date },
    appealedBy: { type: Schema.Types.ObjectId, ref: "User" },
    appealReason: { type: String },
    appealResolution: { type: String },
    timeline: [
      {
        actorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        action: { type: String, required: true },
        note: { type: String },
        at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const ModerationCase: Model<IModerationCase> =
  mongoose.models.ModerationCase ||
  mongoose.model<IModerationCase>("ModerationCase", ModerationCaseSchema);

/* ── Automated Flag (AI/content screening) ─────────────────────── */
export interface IAutomatedFlag extends Document {
  targetId: mongoose.Types.ObjectId;
  targetType: ReportTargetType;
  flagType: "HATE" | "SEXUAL" | "VIOLENCE" | "SPAM" | "COPYRIGHT" | "PROFANITY";
  confidence: number;            // 0–1 confidence score from the screening model
  rawResult?: string;            // raw JSON from the screening API (truncated)
  isReviewed: boolean;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  wasAccurate?: boolean;         // human verdict on whether flag was accurate
  createdAt: Date;
}

const AutomatedFlagSchema = new Schema<IAutomatedFlag>(
  {
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
    targetType: {
      type: String,
      enum: ["NOVEL", "CHAPTER", "COMMENT", "REVIEW", "USER", "GROUP_POST"],
      required: true,
    },
    flagType: {
      type: String,
      enum: ["HATE", "SEXUAL", "VIOLENCE", "SPAM", "COPYRIGHT", "PROFANITY"],
      required: true,
    },
    confidence: { type: Number, required: true, min: 0, max: 1 },
    rawResult: { type: String },
    isReviewed: { type: Boolean, default: false, index: true },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    wasAccurate: { type: Boolean },
  },
  { timestamps: true }
);

export const AutomatedFlag: Model<IAutomatedFlag> =
  mongoose.models.AutomatedFlag ||
  mongoose.model<IAutomatedFlag>("AutomatedFlag", AutomatedFlagSchema);

/* ── Copyright Claim ───────────────────────────────────────────── */
export interface ICopyrightClaim extends Document {
  claimantName: string;
  claimantEmail: string;
  claimantUserId?: mongoose.Types.ObjectId;

  targetNovelId: mongoose.Types.ObjectId;
  targetChapterIds?: mongoose.Types.ObjectId[];

  claimDescription: string;
  originalWorkUrl?: string;
  declarationOfGoodFaith: boolean;   // DMCA good-faith declaration

  status: "RECEIVED" | "UNDER_REVIEW" | "CONTENT_REMOVED" | "COUNTER_CLAIMED" | "RESOLVED" | "REJECTED";
  handledBy?: mongoose.Types.ObjectId;
  handledAt?: Date;
  handlerNotes?: string;

  counterClaimText?: string;
  counterClaimAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const CopyrightClaimSchema = new Schema<ICopyrightClaim>(
  {
    claimantName: { type: String, required: true },
    claimantEmail: { type: String, required: true },
    claimantUserId: { type: Schema.Types.ObjectId, ref: "User" },
    targetNovelId: { type: Schema.Types.ObjectId, ref: "Novel", required: true, index: true },
    targetChapterIds: [{ type: Schema.Types.ObjectId, ref: "Chapter" }],
    claimDescription: { type: String, required: true },
    originalWorkUrl: { type: String },
    declarationOfGoodFaith: { type: Boolean, required: true },
    status: {
      type: String,
      enum: [
        "RECEIVED",
        "UNDER_REVIEW",
        "CONTENT_REMOVED",
        "COUNTER_CLAIMED",
        "RESOLVED",
        "REJECTED",
      ],
      default: "RECEIVED",
      index: true,
    },
    handledBy: { type: Schema.Types.ObjectId, ref: "User" },
    handledAt: { type: Date },
    handlerNotes: { type: String },
    counterClaimText: { type: String },
    counterClaimAt: { type: Date },
  },
  { timestamps: true }
);

export const CopyrightClaim: Model<ICopyrightClaim> =
  mongoose.models.CopyrightClaim ||
  mongoose.model<ICopyrightClaim>("CopyrightClaim", CopyrightClaimSchema);

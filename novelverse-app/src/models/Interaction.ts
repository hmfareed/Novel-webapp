import mongoose, { Schema, Document, Model } from "mongoose";

/* ================================================================
   INTERACTION.TS  —  NovelVerse Reader Interaction Models
   Covers:
     • Comment (chapter-level, paragraph-level, novel discussion)
     • Review (structured multi-axis, with spoiler support)
     • Reaction (emoji reactions on chapters)
     • Highlight + Note (inline reading annotations)
     • ReadingList (user-created custom reading lists)
     • Notification (real-time activity events)
   ================================================================ */

/* ── Comment ───────────────────────────────────────────────────── */
export interface IComment extends Document {
  authorId: mongoose.Types.ObjectId;
  novelId: mongoose.Types.ObjectId;

  // Where is this comment anchored?
  scope: "CHAPTER" | "PARAGRAPH" | "NOVEL_DISCUSSION" | "GROUP_POST";
  chapterId?: mongoose.Types.ObjectId;
  chapterNumber?: number;
  paragraphIndex?: number;          // index of the paragraph (for inline comments)
  groupPostId?: mongoose.Types.ObjectId;

  body: string;
  isSpoiler: boolean;
  spoilerChapter?: number;

  // Threading
  parentId?: mongoose.Types.ObjectId;   // null = top-level comment
  replyCount: number;

  likeCount: number;
  isEdited: boolean;
  isPinned: boolean;                   // author can pin top comment
  isDeleted: boolean;                  // soft delete

  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    novelId: { type: Schema.Types.ObjectId, ref: "Novel", required: true, index: true },
    scope: {
      type: String,
      enum: ["CHAPTER", "PARAGRAPH", "NOVEL_DISCUSSION", "GROUP_POST"],
      required: true,
    },
    chapterId: { type: Schema.Types.ObjectId, ref: "Chapter" },
    chapterNumber: { type: Number },
    paragraphIndex: { type: Number },
    groupPostId: { type: Schema.Types.ObjectId, ref: "GroupPost" },
    body: { type: String, required: true },
    isSpoiler: { type: Boolean, default: false },
    spoilerChapter: { type: Number },
    parentId: { type: Schema.Types.ObjectId, ref: "Comment" },
    replyCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    isEdited: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
CommentSchema.index({ novelId: 1, chapterNumber: 1 });
CommentSchema.index({ parentId: 1 });

export const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);

/* ── Review ────────────────────────────────────────────────────── */
export interface IReview extends Document {
  authorId: mongoose.Types.ObjectId;
  novelId: mongoose.Types.ObjectId;

  // Overall + dimension ratings (0–5 half-stars, stored as 0–10 integers × 0.5)
  overallRating: number;         // 0–5
  storyRating?: number;
  characterRating?: number;
  worldbuildingRating?: number;
  writingRating?: number;
  pacingRating?: number;

  title?: string;
  body: string;
  isSpoiler: boolean;
  recommendsNovel: boolean;

  helpfulCount: number;
  unhelpfulCount: number;

  isEdited: boolean;
  isDeleted: boolean;

  // Moderation
  isFlagged: boolean;
  isApproved: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    novelId: { type: Schema.Types.ObjectId, ref: "Novel", required: true, index: true },
    overallRating: { type: Number, required: true, min: 0, max: 5 },
    storyRating: { type: Number, min: 0, max: 5 },
    characterRating: { type: Number, min: 0, max: 5 },
    worldbuildingRating: { type: Number, min: 0, max: 5 },
    writingRating: { type: Number, min: 0, max: 5 },
    pacingRating: { type: Number, min: 0, max: 5 },
    title: { type: String, default: "" },
    body: { type: String, required: true },
    isSpoiler: { type: Boolean, default: false },
    recommendsNovel: { type: Boolean, default: true },
    helpfulCount: { type: Number, default: 0 },
    unhelpfulCount: { type: Number, default: 0 },
    isEdited: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isFlagged: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);
ReviewSchema.index({ novelId: 1, overallRating: -1 });
// One review per user per novel
ReviewSchema.index({ authorId: 1, novelId: 1 }, { unique: true });

export const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

/* ── Reaction ──────────────────────────────────────────────────── */
export interface IReaction extends Document {
  userId: mongoose.Types.ObjectId;
  targetId: mongoose.Types.ObjectId;
  targetType: "CHAPTER" | "COMMENT" | "GROUP_POST";
  emoji: "❤️" | "😂" | "😮" | "😭" | "🔥" | "👏" | "😡";
  createdAt: Date;
}

const ReactionSchema = new Schema<IReaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    targetType: { type: String, enum: ["CHAPTER", "COMMENT", "GROUP_POST"], required: true },
    emoji: {
      type: String,
      enum: ["❤️", "😂", "😮", "😭", "🔥", "👏", "😡"],
      required: true,
    },
  },
  { timestamps: true }
);
ReactionSchema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true });

export const Reaction: Model<IReaction> =
  mongoose.models.Reaction || mongoose.model<IReaction>("Reaction", ReactionSchema);

/* ── Highlight & Note ──────────────────────────────────────────── */
export interface IHighlight extends Document {
  userId: mongoose.Types.ObjectId;
  novelId: mongoose.Types.ObjectId;
  chapterNumber: number;
  // The highlighted text selection
  selectedText: string;
  startOffset: number;            // character offset in chapter content
  endOffset: number;
  note?: string;                   // optional personal note on the highlight
  color: "YELLOW" | "GREEN" | "BLUE" | "PINK";
  isShared: boolean;               // share as a quote card
  createdAt: Date;
  updatedAt: Date;
}

const HighlightSchema = new Schema<IHighlight>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    novelId: { type: Schema.Types.ObjectId, ref: "Novel", required: true, index: true },
    chapterNumber: { type: Number, required: true },
    selectedText: { type: String, required: true },
    startOffset: { type: Number, required: true },
    endOffset: { type: Number, required: true },
    note: { type: String },
    color: { type: String, enum: ["YELLOW", "GREEN", "BLUE", "PINK"], default: "YELLOW" },
    isShared: { type: Boolean, default: false },
  },
  { timestamps: true }
);
HighlightSchema.index({ userId: 1, novelId: 1, chapterNumber: 1 });

export const Highlight: Model<IHighlight> =
  mongoose.models.Highlight || mongoose.model<IHighlight>("Highlight", HighlightSchema);

/* ── Reading List ──────────────────────────────────────────────── */
export interface IReadingList extends Document {
  ownerId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  isPublic: boolean;
  novelIds: mongoose.Types.ObjectId[];
  coverUrl?: string;
  sortOrder: number;           // user-defined display order
  createdAt: Date;
  updatedAt: Date;
}

const ReadingListSchema = new Schema<IReadingList>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    isPublic: { type: Boolean, default: false },
    novelIds: [{ type: Schema.Types.ObjectId, ref: "Novel" }],
    coverUrl: { type: String },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ReadingList: Model<IReadingList> =
  mongoose.models.ReadingList || mongoose.model<IReadingList>("ReadingList", ReadingListSchema);

/* ── Notification ──────────────────────────────────────────────── */
export type NotificationType =
  | "NEW_CHAPTER"
  | "NEW_FOLLOWER"
  | "FRIEND_REQUEST"
  | "FRIEND_ACCEPTED"
  | "COMMENT_REPLY"
  | "COMMENT_LIKE"
  | "REVIEW_POSTED"
  | "REVIEW_LIKE"
  | "NOVEL_APPROVED"
  | "NOVEL_REJECTED"
  | "ACHIEVEMENT_UNLOCKED"
  | "BOOK_CLUB_INVITE"
  | "BOOK_CLUB_POST"
  | "READING_ROOM_INVITE"
  | "SCHEDULED_CHAPTER_LIVE"
  | "AUTHOR_NEW_NOVEL";

export interface INotification extends Document {
  recipientId: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  imageUrl?: string;
  // Optional meta references for deep linking
  relatedUserId?: mongoose.Types.ObjectId;
  relatedNovelId?: mongoose.Types.ObjectId;
  relatedChapterId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipientId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false, index: true },
    actionUrl: { type: String },
    imageUrl: { type: String },
    relatedUserId: { type: Schema.Types.ObjectId, ref: "User" },
    relatedNovelId: { type: Schema.Types.ObjectId, ref: "Novel" },
    relatedChapterId: { type: Schema.Types.ObjectId, ref: "Chapter" },
  },
  { timestamps: true }
);
NotificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

export const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);

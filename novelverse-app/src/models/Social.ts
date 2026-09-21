import mongoose, { Schema, Document, Model } from "mongoose";

/* ================================================================
   SOCIAL.TS  —  NovelVerse Social Graph Models
   Covers:
     • Friendship (friend requests, accepted, blocked)
     • Follow (user→user, user→novel, user→author)
     • BookClub (community reading groups)
     • GroupPost (posts within a book club)
     • ReadingRoom (live synchronized reading session)
   ================================================================ */

/* ── Friendship ────────────────────────────────────────────────── */
export interface IFriendship extends Document {
  requesterId: mongoose.Types.ObjectId;   // User who sent the request
  recipientId: mongoose.Types.ObjectId;   // User who received the request
  status: "PENDING" | "ACCEPTED" | "BLOCKED" | "DECLINED";
  shareReadingActivity: boolean;           // recipient's privacy setting
  requestedAt: Date;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FriendshipSchema = new Schema<IFriendship>(
  {
    requesterId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    recipientId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "BLOCKED", "DECLINED"],
      default: "PENDING",
      index: true,
    },
    shareReadingActivity: { type: Boolean, default: true },
    requestedAt: { type: Date, default: Date.now },
    respondedAt: { type: Date },
  },
  { timestamps: true }
);
FriendshipSchema.index({ requesterId: 1, recipientId: 1 }, { unique: true });

export const Friendship: Model<IFriendship> =
  mongoose.models.Friendship || mongoose.model<IFriendship>("Friendship", FriendshipSchema);

/* ── Follow (polymorphic: user follows a user, novel, or author profile) ── */
export interface IFollow extends Document {
  followerId: mongoose.Types.ObjectId;
  targetId: mongoose.Types.ObjectId;
  targetType: "USER" | "NOVEL" | "AUTHOR_PROFILE";
  notificationsEnabled: boolean;
  createdAt: Date;
}

const FollowSchema = new Schema<IFollow>(
  {
    followerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
    targetType: {
      type: String,
      enum: ["USER", "NOVEL", "AUTHOR_PROFILE"],
      required: true,
    },
    notificationsEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);
FollowSchema.index({ followerId: 1, targetType: 1, targetId: 1 }, { unique: true });

export const Follow: Model<IFollow> =
  mongoose.models.Follow || mongoose.model<IFollow>("Follow", FollowSchema);

/* ── BookClub / Group ──────────────────────────────────────────── */
export interface IBookClub extends Document {
  name: string;
  slug: string;
  description: string;
  coverUrl?: string;
  ownerId: mongoose.Types.ObjectId;
  isPrivate: boolean;
  genre?: string;

  // Currently reading
  currentNovelId?: mongoose.Types.ObjectId;
  currentChapterNumber?: number;

  // Upcoming schedule
  nextEventAt?: Date;
  nextEventTitle?: string;

  memberCount: number;
  postCount: number;

  rules?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BookClubSchema = new Schema<IBookClub>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    coverUrl: { type: String },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    isPrivate: { type: Boolean, default: false },
    genre: { type: String },
    currentNovelId: { type: Schema.Types.ObjectId, ref: "Novel" },
    currentChapterNumber: { type: Number },
    nextEventAt: { type: Date },
    nextEventTitle: { type: String },
    memberCount: { type: Number, default: 0 },
    postCount: { type: Number, default: 0 },
    rules: { type: String },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export const BookClub: Model<IBookClub> =
  mongoose.models.BookClub || mongoose.model<IBookClub>("BookClub", BookClubSchema);

/* ── BookClub Member ───────────────────────────────────────────── */
export interface IBookClubMember extends Document {
  clubId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: "OWNER" | "MODERATOR" | "MEMBER";
  joinedAt: Date;
  isMuted: boolean;
}

const BookClubMemberSchema = new Schema<IBookClubMember>(
  {
    clubId: { type: Schema.Types.ObjectId, ref: "BookClub", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    role: { type: String, enum: ["OWNER", "MODERATOR", "MEMBER"], default: "MEMBER" },
    joinedAt: { type: Date, default: Date.now },
    isMuted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
BookClubMemberSchema.index({ clubId: 1, userId: 1 }, { unique: true });

export const BookClubMember: Model<IBookClubMember> =
  mongoose.models.BookClubMember ||
  mongoose.model<IBookClubMember>("BookClubMember", BookClubMemberSchema);

/* ── BookClub Post (Discussions, Polls, Announcements) ─────────── */
export interface IGroupPost extends Document {
  clubId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  type: "DISCUSSION" | "ANNOUNCEMENT" | "POLL" | "CHAPTER_REACTION" | "GENERAL";
  title?: string;
  body: string;
  isSpoiler: boolean;
  spoilerChapter?: number;           // spoiler up to this chapter number

  // Poll fields
  pollOptions?: Array<{ text: string; voteCount: number }>;
  pollClosesAt?: Date;

  // References
  linkedNovelId?: mongoose.Types.ObjectId;
  linkedChapterNumber?: number;

  likeCount: number;
  replyCount: number;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GroupPostSchema = new Schema<IGroupPost>(
  {
    clubId: { type: Schema.Types.ObjectId, ref: "BookClub", required: true, index: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["DISCUSSION", "ANNOUNCEMENT", "POLL", "CHAPTER_REACTION", "GENERAL"],
      default: "GENERAL",
    },
    title: { type: String },
    body: { type: String, required: true },
    isSpoiler: { type: Boolean, default: false },
    spoilerChapter: { type: Number },
    pollOptions: [{ text: String, voteCount: { type: Number, default: 0 } }],
    pollClosesAt: { type: Date },
    linkedNovelId: { type: Schema.Types.ObjectId, ref: "Novel" },
    linkedChapterNumber: { type: Number },
    likeCount: { type: Number, default: 0 },
    replyCount: { type: Number, default: 0 },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const GroupPost: Model<IGroupPost> =
  mongoose.models.GroupPost || mongoose.model<IGroupPost>("GroupPost", GroupPostSchema);

/* ── Reading Room (Live synchronized reading session) ───────────── */
export interface IReadingRoom extends Document {
  novelId: mongoose.Types.ObjectId;
  chapterNumber: number;
  hostId: mongoose.Types.ObjectId;
  title?: string;
  isActive: boolean;
  participantIds: mongoose.Types.ObjectId[];
  maxParticipants: number;
  chatEnabled: boolean;
  spoilerProtectedUntilChapter?: number;
  startedAt: Date;
  endedAt?: Date;
  createdAt: Date;
}

const ReadingRoomSchema = new Schema<IReadingRoom>(
  {
    novelId: { type: Schema.Types.ObjectId, ref: "Novel", required: true, index: true },
    chapterNumber: { type: Number, required: true },
    hostId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String },
    isActive: { type: Boolean, default: true, index: true },
    participantIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    maxParticipants: { type: Number, default: 50 },
    chatEnabled: { type: Boolean, default: true },
    spoilerProtectedUntilChapter: { type: Number },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
  },
  { timestamps: true }
);

export const ReadingRoom: Model<IReadingRoom> =
  mongoose.models.ReadingRoom || mongoose.model<IReadingRoom>("ReadingRoom", ReadingRoomSchema);

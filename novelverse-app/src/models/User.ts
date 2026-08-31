import mongoose, { Schema, Document, Model } from "mongoose";
import type { UserRole } from "@/types";

export interface IReadingActivityDay {
  date: string; // YYYY-MM-DD
  seconds: number;
  chaptersRead: number;
  lastReadAt: Date;
}

export interface IUserBadge {
  badgeId: string;
  unlockedAt: Date;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  role: UserRole;
  bio?: string;
  favoriteGenres: string[];
  followersCount: number;
  followingCount: number;
  novelsReadCount: number;
  chaptersReadCount: number;
  readingStreakDays: number;
  longestStreakDays: number;
  totalReadingTimeSeconds: number;
  readingActivity: IReadingActivityDay[];
  unlockedBadges: IUserBadge[];
  lastActiveAt: Date;
  clerkId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SafeUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  role: UserRole;
  bio?: string;
  favoriteGenres: string[];
  followersCount: number;
  followingCount: number;
  novelsReadCount: number;
  chaptersReadCount: number;
  readingStreakDays: number;
  longestStreakDays: number;
  totalReadingTimeSeconds: number;
  readingActivity?: IReadingActivityDay[];
  unlockedBadges?: IUserBadge[];
  lastActiveAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export function toSafeUser(user: IUser | Document): SafeUser {
  const plain = (typeof user.toObject === "function" ? user.toObject() : user) as Record<string, unknown>;
  return {
    id: plain._id ? String(plain._id) : String(plain.id || ""),
    name: String(plain.name || ""),
    username: String(plain.username || ""),
    email: String(plain.email || ""),
    avatar: String(plain.avatar || ""),
    role: (plain.role as UserRole) || "READER",
    bio: String(plain.bio || ""),
    favoriteGenres: Array.isArray(plain.favoriteGenres) ? (plain.favoriteGenres as string[]) : [],
    followersCount: typeof plain.followersCount === "number" ? plain.followersCount : 0,
    followingCount: typeof plain.followingCount === "number" ? plain.followingCount : 0,
    novelsReadCount: typeof plain.novelsReadCount === "number" ? plain.novelsReadCount : 0,
    chaptersReadCount: typeof plain.chaptersReadCount === "number" ? plain.chaptersReadCount : 0,
    readingStreakDays: typeof plain.readingStreakDays === "number" ? plain.readingStreakDays : 0,
    longestStreakDays: typeof plain.longestStreakDays === "number" ? plain.longestStreakDays : 0,
    totalReadingTimeSeconds: typeof plain.totalReadingTimeSeconds === "number" ? plain.totalReadingTimeSeconds : 0,
    readingActivity: Array.isArray(plain.readingActivity)
      ? (plain.readingActivity as IReadingActivityDay[]).map((a) => ({
          date: String(a.date),
          seconds: Number(a.seconds || 0),
          chaptersRead: Number(a.chaptersRead || 0),
          lastReadAt: a.lastReadAt instanceof Date ? a.lastReadAt : new Date(a.lastReadAt || Date.now()),
        }))
      : [],
    unlockedBadges: Array.isArray(plain.unlockedBadges)
      ? (plain.unlockedBadges as IUserBadge[]).map((b) => ({
          badgeId: String(b.badgeId),
          unlockedAt: b.unlockedAt instanceof Date ? b.unlockedAt : new Date(b.unlockedAt || Date.now()),
        }))
      : [],
    lastActiveAt: plain.lastActiveAt instanceof Date ? plain.lastActiveAt : new Date(),
    createdAt: plain.createdAt instanceof Date ? plain.createdAt : undefined,
    updatedAt: plain.updatedAt instanceof Date ? plain.updatedAt : undefined,
  };
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    avatar: { type: String, default: "" },
    role: {
      type: String,
      enum: ["READER", "AUTHOR", "MODERATOR", "ADMIN", "SUPER_ADMIN"],
      default: "READER",
      index: true,
    },
    bio: { type: String, default: "" },
    favoriteGenres: [{ type: String }],
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    novelsReadCount: { type: Number, default: 0 },
    chaptersReadCount: { type: Number, default: 0 },
    readingStreakDays: { type: Number, default: 0 },
    longestStreakDays: { type: Number, default: 0 },
    totalReadingTimeSeconds: { type: Number, default: 0 },
    readingActivity: [
      {
        date: { type: String, required: true }, // YYYY-MM-DD
        seconds: { type: Number, default: 0 },
        chaptersRead: { type: Number, default: 0 },
        lastReadAt: { type: Date, default: Date.now },
      },
    ],
    unlockedBadges: [
      {
        badgeId: { type: String, required: true },
        unlockedAt: { type: Date, default: Date.now },
      },
    ],
    lastActiveAt: { type: Date, default: Date.now },
    clerkId: { type: String, index: true, sparse: true },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

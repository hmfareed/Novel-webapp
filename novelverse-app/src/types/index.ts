/* ============================================================
   NovelVerse — Shared TypeScript Types & Enums
   These are UI-layer types used by components and pages.
   Mongoose models will have their own type definitions.
   ============================================================ */

/* ── User Roles ──────────────────────────────────────────── */
export type UserRole =
  | "READER"
  | "AUTHOR"
  | "MODERATOR"
  | "ADMIN"
  | "SUPER_ADMIN";

/* ── Novel Status ────────────────────────────────────────── */
export type NovelStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "SCHEDULED"
  | "PUBLISHED"
  | "ONGOING"
  | "REJECTED"
  | "SUSPENDED"
  | "COMPLETED"
  | "HIATUS"
  | "CANCELLED";

/* ── Chapter Status ──────────────────────────────────────── */
export type ChapterStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "PUBLISHED"
  | "REJECTED";

/* ── Subscription Plan ───────────────────────────────────── */
export type SubscriptionPlan = "FREE" | "PREMIUM" | "PREMIUM_PLUS";

/* ── Genre ───────────────────────────────────────────────── */
export interface Genre {
  id: string;
  name: string;
  slug: string;
  color?: string;
  icon?: string;
}

/* ── Author (display) ────────────────────────────────────── */
export interface AuthorDisplay {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  verified?: boolean;
  followersCount?: number;
}

/* ── Novel Card (display) ────────────────────────────────── */
export interface NovelCardData {
  id: string;
  slug: string;
  title: string;
  coverUrl?: string;
  author: AuthorDisplay;
  genres: Genre[];
  status: NovelStatus;
  rating: number;          // 0–5
  reviewCount: number;
  readCount: number;
  chapterCount: number;
  wordCount?: number;
  isPremium?: boolean;
  isCompleted?: boolean;
  updatedAt: string;       // ISO date string
  synopsis?: string;
}

/* ── Chapter (list item) ─────────────────────────────────── */
export interface ChapterListItem {
  id: string;
  novelId: string;
  chapterNumber: number;
  title: string;
  wordCount: number;
  status: ChapterStatus;
  isPremium: boolean;
  price?: number;
  publishedAt?: string;
}

/* ── Reading Progress ────────────────────────────────────── */
export interface ReadingProgress {
  userId: string;
  novelId: string;
  chapterId: string;
  chapterNumber: number;
  position: number;        // scroll position (0–100)
  percentage: number;      // overall novel completion
  lastReadAt: string;
  completed: boolean;
}

/* ── Library Entry ───────────────────────────────────────── */
export interface LibraryEntry {
  id: string;
  novel: NovelCardData;
  addedAt: string;
  progress?: ReadingProgress;
}

/* ── Review ──────────────────────────────────────────────── */
export interface ReviewData {
  id: string;
  author: AuthorDisplay;
  rating: number;
  body: string;
  helpfulCount: number;
  createdAt: string;
}

/* ── Notification ────────────────────────────────────────── */
export type NotificationType =
  | "NEW_CHAPTER"
  | "NEW_FOLLOWER"
  | "COMMENT_REPLY"
  | "REVIEW_POSTED"
  | "NOVEL_APPROVED"
  | "NOVEL_REJECTED"
  | "ACHIEVEMENT_UNLOCKED";

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  imageUrl?: string;
}

/* ── Pagination ──────────────────────────────────────────── */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/* ── API Response wrapper ────────────────────────────────── */
export type ApiResponse<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; code?: string };

/* ── Filter / Sort ───────────────────────────────────────── */
export type SortOption =
  | "popular"
  | "newest"
  | "top-rated"
  | "most-read"
  | "completed"
  | "updated";

export interface NovelFilters {
  genre?: string;
  status?: NovelStatus;
  sort?: SortOption;
  search?: string;
  page?: number;
  limit?: number;
}

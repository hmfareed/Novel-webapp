import * as React from "react";
import { cn } from "@/lib/utils";

/* ============================================================
   NovelVerse — Loading Skeletons
   AMOLED shimmer skeletons for every major content shape.
   ============================================================ */

/* ── Base Skeleton ─────────────────────────────────────── */
interface SkeletonProps {
  className?: string;
  "aria-hidden"?: boolean;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("nv-shimmer rounded-[var(--nv-radius-md)]", className)}
      aria-hidden={props["aria-hidden"] ?? true}
    />
  );
}

/* ── Novel Card Skeleton (vertical) ─────────────────────── */
export function NovelCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-[var(--nv-radius-xl)] overflow-hidden",
        "bg-[var(--nv-surface-1)] border border-[var(--nv-border-subtle)]",
        className
      )}
      aria-hidden="true"
    >
      {/* Cover */}
      <Skeleton className="aspect-[2/3] w-full rounded-none" />
      {/* Content */}
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-20" />
        <div className="flex justify-between pt-1">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </div>
  );
}

/* ── Novel Card Grid Skeleton ────────────────────────────── */
export function NovelCardGridSkeleton({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4",
        className
      )}
      aria-busy="true"
      aria-label="Loading novels…"
    >
      {Array.from({ length: count }, (_, i) => (
        <NovelCardSkeleton key={i} />
      ))}
    </div>
  );
}

/* ── Novel Card Horizontal Skeleton ─────────────────────── */
export function NovelCardHorizontalSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex gap-4 p-4 rounded-[var(--nv-radius-xl)]",
        "bg-[var(--nv-surface-1)] border border-[var(--nv-border-subtle)]",
        className
      )}
      aria-hidden="true"
    >
      <Skeleton className="w-16 h-24 rounded-[var(--nv-radius-md)] shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

/* ── Hero Skeleton ───────────────────────────────────────── */
export function HeroSkeleton() {
  return (
    <div
      className="relative w-full h-[480px] rounded-[var(--nv-radius-2xl)] overflow-hidden bg-[var(--nv-surface-1)] border border-[var(--nv-border-subtle)]"
      aria-hidden="true"
    >
      <Skeleton className="absolute inset-0 rounded-none" />
      <div className="absolute bottom-8 left-8 space-y-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-80" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-10 w-32 rounded-[var(--nv-radius-full)]" />
          <Skeleton className="h-10 w-28 rounded-[var(--nv-radius-full)]" />
        </div>
      </div>
    </div>
  );
}

/* ── Section Skeleton (header + grid) ────────────────────── */
export function SectionSkeleton({
  cardCount = 6,
  className,
}: {
  cardCount?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)} aria-hidden="true">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-16" />
      </div>
      {/* Grid */}
      <NovelCardGridSkeleton count={cardCount} />
    </div>
  );
}

/* ── Profile Skeleton ────────────────────────────────────── */
export function ProfileSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="flex items-end gap-6">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="flex gap-6">
        {[80, 100, 60, 80].map((w, i) => (
          <div key={i} className="space-y-1 text-center">
            <Skeleton className={`h-6 w-${w / 4} mx-auto`} />
            <Skeleton className="h-3 w-12 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

import * as React from "react";
import { cn, clamp } from "@/lib/utils";

/* ============================================================
   NovelVerse — ReadingProgressBar
   Thin violet progress bar for reading position.
   Used in novel cards, chapter reader header, and library.
   ============================================================ */

interface ReadingProgressBarProps {
  /** Progress value 0–100 */
  value: number;
  /** Visual size */
  size?: "xs" | "sm" | "md";
  /** Show percentage text label */
  showLabel?: boolean;
  /** Label position */
  labelPosition?: "right" | "below";
  /** Animate on mount */
  animate?: boolean;
  className?: string;
}

const heightMap = {
  xs: "h-0.5",
  sm: "h-1",
  md: "h-1.5",
};

export function ReadingProgressBar({
  value,
  size = "sm",
  showLabel = false,
  labelPosition = "right",
  animate = true,
  className,
}: ReadingProgressBarProps) {
  const clamped = clamp(value, 0, 100);

  const bar = (
    <div
      className={cn(
        "relative w-full rounded-full overflow-hidden",
        "bg-[var(--nv-surface-4)]",
        heightMap[size],
        className
      )}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Reading progress: ${clamped}%`}
    >
      <div
        className={cn(
          "h-full rounded-full",
          "bg-gradient-to-r from-[var(--nv-violet-600)] to-[var(--nv-violet-400)]",
          animate && "transition-[width] duration-700 ease-out"
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );

  if (!showLabel) return bar;

  if (labelPosition === "right") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="flex-1">{bar}</div>
        <span className="text-[10px] font-medium tabular-nums text-[var(--nv-violet-400)] shrink-0">
          {clamped}%
        </span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      {bar}
      <span className="text-[10px] font-medium tabular-nums text-[var(--nv-text-muted)]">
        {clamped}% read
      </span>
    </div>
  );
}

/* ── Full-page reading progress (top of chapter reader) ── */
export function ChapterReaderProgress({ value }: { value: number }) {
  const clamped = clamp(value, 0, 100);
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[var(--nv-z-nav)] h-0.5 bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-[var(--nv-violet-700)] to-[var(--nv-violet-400)] transition-[width] duration-300 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

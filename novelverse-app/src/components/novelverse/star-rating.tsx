import * as React from "react";
import { Star } from "lucide-react";
import { cn, clamp } from "@/lib/utils";

/* ============================================================
   NovelVerse — StarRating
   Read-only and interactive star rating display.
   ============================================================ */

interface StarRatingProps {
  rating: number;           // 0–5 (supports decimals for display)
  maxStars?: number;
  size?: "xs" | "sm" | "md" | "lg";
  showValue?: boolean;
  showCount?: boolean;
  reviewCount?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  className?: string;
}

const sizeMap = {
  xs: { star: "w-2.5 h-2.5", text: "text-[10px]", gap: "gap-0.5" },
  sm: { star: "w-3.5 h-3.5", text: "text-xs",     gap: "gap-0.5" },
  md: { star: "w-4 h-4",     text: "text-sm",      gap: "gap-1"   },
  lg: { star: "w-5 h-5",     text: "text-base",    gap: "gap-1"   },
};

export function StarRating({
  rating,
  maxStars = 5,
  size = "sm",
  showValue = false,
  showCount = false,
  reviewCount,
  interactive = false,
  onRate,
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const displayRating = clamp(rating, 0, maxStars);
  const activeRating = hovered ?? displayRating;
  const { star, text, gap } = sizeMap[size];

  return (
    <div
      className={cn("flex items-center", gap, className)}
      role={interactive ? "radiogroup" : undefined}
      aria-label={interactive ? "Rating selector" : `Rating: ${displayRating} out of ${maxStars}`}
    >
      {/* Stars */}
      <div className={cn("flex items-center", gap)}>
        {Array.from({ length: maxStars }, (_, i) => {
          const starIndex = i + 1;
          const filled = interactive
            ? starIndex <= activeRating
            : starIndex <= Math.round(displayRating);
          const halfFilled =
            !interactive &&
            !filled &&
            starIndex - 0.5 <= displayRating;

          return (
            <button
              key={i}
              type={interactive ? "button" : undefined}
              disabled={!interactive}
              onClick={interactive ? () => onRate?.(starIndex) : undefined}
              onMouseEnter={interactive ? () => setHovered(starIndex) : undefined}
              onMouseLeave={interactive ? () => setHovered(null) : undefined}
              className={cn(
                "relative transition-transform",
                interactive
                  ? "cursor-pointer hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nv-violet-500)]"
                  : "cursor-default pointer-events-none"
              )}
              aria-label={interactive ? `Rate ${starIndex} stars` : undefined}
            >
              {halfFilled ? (
                <HalfStar className={cn(star)} />
              ) : (
                <Star
                  className={cn(
                    star,
                    "transition-colors",
                    filled
                      ? "fill-amber-400 text-amber-400"
                      : "fill-transparent text-[var(--nv-surface-5)]"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Value */}
      {showValue && (
        <span className={cn(text, "font-medium text-[var(--nv-text-primary)] tabular-nums")}>
          {displayRating.toFixed(1)}
        </span>
      )}

      {/* Review count */}
      {showCount && reviewCount !== undefined && (
        <span className={cn(text, "text-[var(--nv-text-muted)]")}>
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}

/* ── Half Star SVG ─────────────────────────────────────── */
function HalfStar({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Right half (empty) */}
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77V2z"
        fill="transparent"
        stroke="var(--nv-surface-5)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left half (filled) */}
      <path
        d="M12 2L8.91 8.26 2 9.27l5 4.87L5.82 21 12 17.77V2z"
        fill="#fbbf24"
        stroke="#fbbf24"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

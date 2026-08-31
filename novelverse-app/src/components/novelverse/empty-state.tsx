import * as React from "react";
import { cn } from "@/lib/utils";

/* ============================================================
   NovelVerse — EmptyState
   Empty/no-results state with icon, title, message, and action.
   ============================================================ */

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: { wrapper: "py-8",   icon: "w-10 h-10", title: "text-base", desc: "text-sm" },
  md: { wrapper: "py-16",  icon: "w-14 h-14", title: "text-xl",   desc: "text-sm" },
  lg: { wrapper: "py-24",  icon: "w-20 h-20", title: "text-2xl",  desc: "text-base" },
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  size = "md",
  className,
}: EmptyStateProps) {
  const { wrapper, icon: iconSize, title: titleSize, desc: descSize } = sizeStyles[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        wrapper,
        className
      )}
      aria-live="polite"
    >
      {/* Icon container */}
      {icon && (
        <div
          className={cn(
            "mb-4 flex items-center justify-center rounded-full",
            "bg-[var(--nv-surface-2)] border border-[var(--nv-border-subtle)]",
            iconSize
          )}
        >
          <div className="text-[var(--nv-text-muted)] w-1/2 h-1/2 flex items-center justify-center">
            {icon}
          </div>
        </div>
      )}

      {/* Title */}
      <h3 className={cn("font-semibold text-[var(--nv-text-primary)] mb-2", titleSize)}>
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className={cn("text-[var(--nv-text-muted)] max-w-sm leading-relaxed mb-6", descSize)}>
          {description}
        </p>
      )}

      {/* Action */}
      {action && <div>{action}</div>}
    </div>
  );
}

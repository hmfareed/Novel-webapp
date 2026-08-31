import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   NovelVerse — SectionHeader
   Editorial section header with optional "View all" link.
   ============================================================ */

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "View all",
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      {/* Left: title + subtitle */}
      <div className="space-y-0.5 min-w-0">
        <h2 className="text-lg font-bold tracking-tight text-[var(--nv-text-primary)] leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-[var(--nv-text-muted)] nv-clamp-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right: custom action or view-all link */}
      {action ? (
        <div className="shrink-0">{action}</div>
      ) : viewAllHref ? (
        <Link
          href={viewAllHref}
          className={cn(
            "inline-flex items-center gap-1 shrink-0",
            "text-xs font-medium text-[var(--nv-violet-400)]",
            "hover:text-[var(--nv-violet-300)] transition-colors",
            "group"
          )}
        >
          {viewAllLabel}
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
}

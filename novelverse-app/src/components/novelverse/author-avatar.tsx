import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/* ============================================================
   NovelVerse — AuthorAvatar
   Avatar with optional online status ring and verification badge.
   ============================================================ */

interface AuthorAvatarProps {
  src?: string;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  isOnline?: boolean;
  isVerified?: boolean;
  className?: string;
}

const sizeMap = {
  xs: { container: "w-6 h-6",   text: "text-[9px]",  indicator: "w-1.5 h-1.5 border",  badge: "w-3 h-3" },
  sm: { container: "w-8 h-8",   text: "text-xs",      indicator: "w-2 h-2 border",       badge: "w-3.5 h-3.5" },
  md: { container: "w-10 h-10", text: "text-sm",      indicator: "w-2.5 h-2.5 border-2", badge: "w-4 h-4" },
  lg: { container: "w-14 h-14", text: "text-base",    indicator: "w-3 h-3 border-2",     badge: "w-5 h-5" },
  xl: { container: "w-20 h-20", text: "text-xl",      indicator: "w-3.5 h-3.5 border-2", badge: "w-6 h-6" },
};

export function AuthorAvatar({
  src,
  name,
  size = "md",
  isOnline,
  isVerified,
  className,
}: AuthorAvatarProps) {
  const initials = getInitials(name);
  const { container, text, indicator, badge } = sizeMap[size];

  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      {/* Avatar circle */}
      <div
        className={cn(
          "relative rounded-full overflow-hidden",
          "bg-gradient-to-br from-[var(--nv-violet-800)] to-[var(--nv-violet-950)]",
          "border border-[var(--nv-border-subtle)]",
          container
        )}
        aria-label={`${name}'s avatar`}
      >
        {src ? (
          <Image
            src={src}
            alt={name}
            fill
            sizes="80px"
            className="object-cover"
            unoptimized={src.includes("dicebear") || src.endsWith(".svg")}
          />
        ) : (
          <span
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              "font-semibold text-[var(--nv-violet-300)] select-none",
              text
            )}
          >
            {initials}
          </span>
        )}
      </div>

      {/* Online indicator */}
      {isOnline !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full",
            "border-[var(--nv-bg)]",
            indicator,
            isOnline
              ? "bg-emerald-500"
              : "bg-[var(--nv-surface-4)]"
          )}
          aria-label={isOnline ? "Online" : "Offline"}
        />
      )}

      {/* Verified badge */}
      {isVerified && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 rounded-full",
            "bg-[var(--nv-violet-500)] text-white",
            "flex items-center justify-center",
            badge
          )}
          aria-label="Verified author"
        >
          <svg viewBox="0 0 12 12" fill="none" className="w-full h-full p-0.5" aria-hidden="true">
            <path
              d="M2.5 6L5 8.5L9.5 3.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </div>
  );
}

/* ── Avatar Group (friends, reading rooms) ──────────────── */
interface AvatarGroupProps {
  users: Array<{ name: string; avatar?: string }>;
  max?: number;
  size?: AuthorAvatarProps["size"];
  className?: string;
}

export function AvatarGroup({
  users,
  max = 4,
  size = "sm",
  className,
}: AvatarGroupProps) {
  const visible = users.slice(0, max);
  const overflow = users.length - max;

  return (
    <div className={cn("flex items-center", className)}>
      {visible.map((user, i) => (
        <div
          key={i}
          className="ring-2 ring-[var(--nv-bg)] rounded-full -ml-2 first:ml-0"
        >
          <AuthorAvatar src={user.avatar} name={user.name} size={size} />
        </div>
      ))}
      {overflow > 0 && (
        <div
          className={cn(
            "ring-2 ring-[var(--nv-bg)] -ml-2 rounded-full",
            "flex items-center justify-center",
            "bg-[var(--nv-surface-3)] border border-[var(--nv-border-subtle)]",
            sizeMap[size].container
          )}
        >
          <span className={cn("font-medium text-[var(--nv-text-muted)]", sizeMap[size].text)}>
            +{overflow}
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────── */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

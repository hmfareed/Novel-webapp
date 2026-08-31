import * as React from "react";
import {
  Sparkles,
  Heart,
  Search,
  Compass,
  Atom,
  Zap,
  Landmark,
  Skull,
  Theater,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Genre } from "@/types";

/* ============================================================
   NovelVerse — GenreBadge
   Styled genre/mood chip. Uses NovelVerse design tokens.
   ============================================================ */

export function renderGenreIcon(iconOrSlug?: string, className = "w-3 h-3") {
  if (!iconOrSlug) return null;
  const key = iconOrSlug.toLowerCase();
  if (key === "sparkles" || key === "fantasy") return <Sparkles className={cn(className, "text-violet-400")} />;
  if (key === "heart" || key === "romance") return <Heart className={cn(className, "text-rose-400")} />;
  if (key === "search" || key === "mystery") return <Search className={cn(className, "text-cyan-400")} />;
  if (key === "compass" || key === "adventure") return <Compass className={cn(className, "text-emerald-400")} />;
  if (key === "atom" || key === "sci-fi") return <Atom className={cn(className, "text-blue-400")} />;
  if (key === "zap" || key === "thriller") return <Zap className={cn(className, "text-amber-400")} />;
  if (key === "landmark" || key === "historical") return <Landmark className={cn(className, "text-yellow-500")} />;
  if (key === "skull" || key === "horror") return <Skull className={cn(className, "text-red-500")} />;
  if (key === "theater" || key === "drama") return <Theater className={cn(className, "text-purple-400")} />;
  return <BookOpen className={cn(className, "text-violet-400")} />;
}

interface GenreBadgeProps {
  genre: Genre;
  size?: "xs" | "sm" | "md";
  interactive?: boolean;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

const sizeStyles = {
  xs: "px-1.5 py-0.5 text-[10px] rounded-[var(--nv-radius-xs)]",
  sm: "px-2 py-0.5 text-xs rounded-[var(--nv-radius-sm)]",
  md: "px-3 py-1 text-sm rounded-[var(--nv-radius-md)]",
};

export function GenreBadge({
  genre,
  size = "sm",
  interactive = false,
  selected = false,
  onClick,
  className,
}: GenreBadgeProps) {
  const Comp = onClick ? "button" : "span";
  const iconClass = size === "xs" ? "w-2.5 h-2.5" : size === "md" ? "w-3.5 h-3.5" : "w-3 h-3";

  return (
    <Comp
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 font-medium leading-none select-none",
        "border transition-colors duration-[var(--nv-transition-fast)]",
        sizeStyles[size],
        selected
          ? "bg-[var(--nv-violet-600)] border-[var(--nv-violet-500)] text-white"
          : "bg-[var(--nv-surface-3)] border-[var(--nv-border-subtle)] text-[var(--nv-text-secondary)]",
        interactive &&
          "cursor-pointer hover:bg-[var(--nv-violet-800)] hover:border-[var(--nv-violet-600)] hover:text-white",
        className
      )}
      type={onClick ? "button" : undefined}
    >
      {renderGenreIcon(genre.icon || genre.slug, iconClass)}
      {genre.name}
    </Comp>
  );
}

/* ── Genre Filter Row ────────────────────────────────────── */
interface GenreFilterRowProps {
  genres: Genre[];
  selected?: string[];
  onToggle?: (genreSlug: string) => void;
  className?: string;
}

export function GenreFilterRow({
  genres,
  selected = [],
  onToggle,
  className,
}: GenreFilterRowProps) {
  return (
    <div className={cn("flex gap-2 flex-wrap", className)}>
      {genres.map((genre) => (
        <GenreBadge
          key={genre.id}
          genre={genre}
          size="sm"
          interactive
          selected={selected.includes(genre.slug)}
          onClick={() => onToggle?.(genre.slug)}
        />
      ))}
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Eye } from "lucide-react";
import { cn, formatCount } from "@/lib/utils";
import type { NovelCardData } from "@/types";
import { GenreBadge } from "./genre-badge";
import { StarRating } from "./star-rating";

/* ============================================================
   NovelVerse — NovelCard
   Premium novel card used throughout the platform.
   Supports vertical (default) and horizontal layouts.
   ============================================================ */

interface NovelCardProps {
  novel: NovelCardData;
  variant?: "vertical" | "horizontal" | "compact";
  showSynopsis?: boolean;
  className?: string;
}

export function NovelCard({
  novel,
  variant = "vertical",
  showSynopsis = false,
  className,
}: NovelCardProps) {
  if (variant === "horizontal") {
    return <NovelCardHorizontal novel={novel} showSynopsis={showSynopsis} className={className} />;
  }

  if (variant === "compact") {
    return <NovelCardCompact novel={novel} className={className} />;
  }

  return <NovelCardVertical novel={novel} showSynopsis={showSynopsis} className={className} />;
}

/* ── Fallback Safe Novel Cover ─────────────────────────── */
function NovelCover({
  src,
  title,
  sizes,
  className,
}: {
  src?: string;
  title: string;
  sizes: string;
  className?: string;
}) {
  const [imgSrc, setImgSrc] = React.useState(src || "/assets/mood-epic-adventure.jpg");
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setImgSrc(src || "/assets/mood-epic-adventure.jpg");
    setHasError(false);
  }, [src]);

  if (hasError || !imgSrc) {
    return <NovelCoverPlaceholder title={title} />;
  }

  return (
    <Image
      src={imgSrc}
      alt={title}
      fill
      sizes={sizes}
      className={className || "object-cover transition-transform duration-500 group-hover:scale-105"}
      onError={() => {
        if (imgSrc !== "/assets/mood-epic-adventure.jpg") {
          setImgSrc("/assets/mood-epic-adventure.jpg");
        } else {
          setHasError(true);
        }
      }}
    />
  );
}

/* ── Vertical Card (default — grid layout) ─────────────── */
function NovelCardVertical({
  novel,
  showSynopsis,
  className,
}: {
  novel: NovelCardData;
  showSynopsis: boolean;
  className?: string;
}) {
  return (
    <Link
      href={`/novels/${novel.slug}`}
      className={cn(
        "group block relative",
        "rounded-[var(--nv-radius-xl)] overflow-hidden",
        "bg-[var(--nv-surface-1)] border border-[var(--nv-border-subtle)]",
        "transition-all duration-[var(--nv-transition-base)]",
        "hover:border-[var(--nv-border-accent)] hover:shadow-[var(--nv-shadow-glow)]",
        "hover:-translate-y-1",
        className
      )}
    >
      {/* Cover Image */}
      <div className="relative aspect-[2/3] overflow-hidden bg-[var(--nv-surface-3)]">
        <NovelCover
          src={novel.coverUrl}
          title={novel.title}
          sizes="(min-width: 1280px) 200px, (min-width: 768px) 160px, 140px"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status badge */}
        {novel.isCompleted && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/90 text-white backdrop-blur-sm">
            Completed
          </span>
        )}

        {/* Premium badge */}
        {novel.isPremium && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--nv-violet-600)]/90 text-white backdrop-blur-sm">
            Premium
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-1.5">
        {/* Genres */}
        {novel.genres.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {novel.genres.slice(0, 2).map((genre) => (
              <GenreBadge key={genre.id} genre={genre} size="xs" />
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="font-semibold text-sm text-[var(--nv-text-primary)] nv-clamp-2 leading-snug group-hover:text-[var(--nv-violet-400)] transition-colors">
          {novel.title}
        </h3>

        {/* Author */}
        <p className="text-xs text-[var(--nv-text-muted)] nv-clamp-1">
          {novel.author.name}
        </p>

        {/* Synopsis */}
        {showSynopsis && novel.synopsis && (
          <p className="text-xs text-[var(--nv-text-muted)] nv-clamp-3 leading-relaxed">
            {novel.synopsis}
          </p>
        )}

        {/* Stats footer */}
        <div className="flex items-center justify-between pt-1 border-t border-[var(--nv-border-subtle)] text-[11px] text-[var(--nv-text-muted)]">
          <StarRating rating={novel.rating} size="xs" />
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-0.5">
              <Eye className="w-3 h-3" />
              {formatCount(novel.readCount)}
            </span>
            <span className="flex items-center gap-0.5">
              <BookOpen className="w-3 h-3" />
              {novel.chapterCount} ch
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ── Horizontal Card (list layout) ─────────────────────── */
function NovelCardHorizontal({
  novel,
  showSynopsis,
  className,
}: {
  novel: NovelCardData;
  showSynopsis: boolean;
  className?: string;
}) {
  return (
    <Link
      href={`/novels/${novel.slug}`}
      className={cn(
        "group flex gap-4 p-3 rounded-[var(--nv-radius-xl)]",
        "bg-[var(--nv-surface-1)] border border-[var(--nv-border-subtle)]",
        "transition-all duration-[var(--nv-transition-base)]",
        "hover:border-[var(--nv-border-accent)] hover:shadow-[var(--nv-shadow-card)]",
        className
      )}
    >
      {/* Cover Image */}
      <div className="relative w-20 aspect-[2/3] shrink-0 rounded-[var(--nv-radius-md)] overflow-hidden bg-[var(--nv-surface-3)]">
        <NovelCover
          src={novel.coverUrl}
          title={novel.title}
          sizes="80px"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          {/* Genres */}
          {novel.genres.length > 0 && (
            <div className="flex gap-1 mb-1 flex-wrap">
              {novel.genres.slice(0, 2).map((genre) => (
                <GenreBadge key={genre.id} genre={genre} size="xs" />
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="font-semibold text-sm text-[var(--nv-text-primary)] nv-clamp-1 group-hover:text-[var(--nv-violet-400)] transition-colors">
            {novel.title}
          </h3>

          {/* Author */}
          <p className="text-xs text-[var(--nv-text-muted)] mt-0.5">
            {novel.author.name}
          </p>

          {/* Synopsis */}
          {showSynopsis && novel.synopsis && (
            <p className="text-xs text-[var(--nv-text-muted)] nv-clamp-2 mt-1 leading-relaxed">
              {novel.synopsis}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-[var(--nv-text-muted)] pt-2 border-t border-[var(--nv-border-subtle)]">
          <StarRating rating={novel.rating} size="xs" />
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {formatCount(novel.readCount)}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {novel.chapterCount} ch
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Compact Card (minimal sidebar / widget style) ──────── */
function NovelCardCompact({
  novel,
  className,
}: {
  novel: NovelCardData;
  className?: string;
}) {
  return (
    <Link
      href={`/novels/${novel.slug}`}
      className={cn(
        "group flex gap-3 items-center",
        "py-2 transition-opacity hover:opacity-80",
        className
      )}
    >
      <div className="relative w-10 h-14 shrink-0 rounded-[var(--nv-radius-sm)] overflow-hidden bg-[var(--nv-surface-3)]">
        <NovelCover
          src={novel.coverUrl}
          title={novel.title}
          sizes="40px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-[var(--nv-text-primary)] nv-clamp-1">{novel.title}</p>
        <p className="text-[10px] text-[var(--nv-text-muted)]">{novel.author.name}</p>
        <StarRating rating={novel.rating} size="xs" className="mt-0.5" />
      </div>
    </Link>
  );
}

/* ── Cover Placeholder ─────────────────────────────────── */
function NovelCoverPlaceholder({ title }: { title: string }) {
  const letter = title.charAt(0).toUpperCase();
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet-900 via-purple-950 to-zinc-950 p-2 text-center">
      <div className="space-y-1">
        <span className="font-serif text-3xl font-extrabold text-violet-300 drop-shadow-md select-none block">
          {letter}
        </span>
        <span className="text-[9px] font-semibold text-zinc-300 line-clamp-2 leading-tight">
          {title}
        </span>
      </div>
    </div>
  );
}

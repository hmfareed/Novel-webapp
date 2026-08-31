import * as React from "react"
import { cn } from "@/lib/utils"

/* ── Card ─────────────────────────────────────────────────── */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "elevated" | "ghost" }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-[var(--nv-radius-xl)] transition-all duration-[var(--nv-transition-base)]",
      variant === "default" &&
        "bg-[var(--nv-surface-1)] border border-[var(--nv-border-subtle)] shadow-[var(--nv-shadow-card)]",
      variant === "elevated" &&
        "bg-[var(--nv-surface-2)] border border-[var(--nv-border-default)] shadow-[var(--nv-shadow-elevated)]",
      variant === "ghost" &&
        "bg-transparent border border-[var(--nv-border-subtle)]",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

/* ── CardHeader ───────────────────────────────────────────── */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1.5 p-5 pb-0", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

/* ── CardTitle ─────────────────────────────────────────────── */
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-base font-semibold leading-tight tracking-tight text-[var(--nv-text-primary)]",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

/* ── CardDescription ──────────────────────────────────────── */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-[var(--nv-text-muted)] leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

/* ── CardContent ──────────────────────────────────────────── */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5 pt-4", className)} {...props} />
))
CardContent.displayName = "CardContent"

/* ── CardFooter ───────────────────────────────────────────── */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center p-5 pt-0",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }

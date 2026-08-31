import * as React from "react"
import { cn } from "@/lib/utils"

/* ── Input ────────────────────────────────────────────────── */
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }
>(({ className, type, error, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-[var(--nv-radius-lg)] px-3 py-2",
        "bg-[var(--nv-surface-2)] border text-sm",
        "text-[var(--nv-text-primary)] placeholder:text-[var(--nv-text-disabled)]",
        "transition-colors duration-[var(--nv-transition-fast)]",
        "focus-visible:outline-none focus-visible:shadow-[var(--nv-focus-ring)]",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--nv-text-secondary)]",
        error
          ? "border-red-800 focus-visible:ring-red-500"
          : "border-[var(--nv-border-default)] hover:border-[var(--nv-border-emphasis)] focus-visible:border-[var(--nv-violet-500)]",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

/* ── Textarea ─────────────────────────────────────────────── */
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }
>(({ className, error, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-[var(--nv-radius-lg)] px-3 py-2.5",
        "bg-[var(--nv-surface-2)] border text-sm",
        "text-[var(--nv-text-primary)] placeholder:text-[var(--nv-text-disabled)]",
        "transition-colors duration-[var(--nv-transition-fast)]",
        "focus-visible:outline-none focus-visible:shadow-[var(--nv-focus-ring)]",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "resize-none",
        error
          ? "border-red-800 focus-visible:ring-red-500"
          : "border-[var(--nv-border-default)] hover:border-[var(--nv-border-emphasis)] focus-visible:border-[var(--nv-violet-500)]",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Input, Textarea }

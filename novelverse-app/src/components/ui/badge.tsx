import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1 rounded-[var(--nv-radius-full)]",
    "border font-medium leading-none transition-colors",
    "focus:outline-none focus:shadow-[var(--nv-focus-ring)]",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-[var(--nv-violet-900)]/60 border-[var(--nv-violet-700)]/50 text-[var(--nv-violet-300)]",
        secondary:
          "bg-[var(--nv-surface-3)] border-[var(--nv-border-subtle)] text-[var(--nv-text-muted)]",
        outline:
          "bg-transparent border-[var(--nv-border-default)] text-[var(--nv-text-secondary)]",
        destructive:
          "bg-red-950/40 border-red-900/50 text-red-400",
        success:
          "bg-emerald-950/40 border-emerald-900/50 text-emerald-400",
        warning:
          "bg-amber-950/40 border-amber-900/50 text-amber-400",
        premium:
          "bg-gradient-to-r from-[var(--nv-violet-900)] to-purple-900/60 " +
          "border-[var(--nv-violet-700)]/60 text-[var(--nv-violet-300)]",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-medium transition-all duration-[var(--nv-transition-fast)]",
    "focus-visible:outline-none focus-visible:shadow-[var(--nv-focus-ring)]",
    "disabled:pointer-events-none disabled:opacity-40",
    "cursor-pointer select-none",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        /* Violet filled — primary CTA */
        default:
          "bg-[var(--nv-violet-600)] text-white border border-[var(--nv-violet-500)] " +
          "hover:bg-[var(--nv-violet-500)] hover:shadow-[var(--nv-shadow-glow)] " +
          "active:bg-[var(--nv-violet-700)]",
        /* Subtle surface */
        secondary:
          "bg-[var(--nv-surface-2)] text-[var(--nv-text-secondary)] border border-[var(--nv-border-default)] " +
          "hover:bg-[var(--nv-surface-3)] hover:border-[var(--nv-border-emphasis)] hover:text-[var(--nv-text-primary)]",
        /* Transparent with border */
        outline:
          "bg-transparent text-[var(--nv-text-secondary)] border border-[var(--nv-border-default)] " +
          "hover:bg-[var(--nv-surface-2)] hover:text-[var(--nv-text-primary)] hover:border-[var(--nv-border-emphasis)]",
        /* No border, no background */
        ghost:
          "bg-transparent text-[var(--nv-text-muted)] border border-transparent " +
          "hover:bg-[var(--nv-surface-2)] hover:text-[var(--nv-text-primary)]",
        /* Destructive action */
        destructive:
          "bg-red-900/30 text-red-400 border border-red-900/50 " +
          "hover:bg-red-900/50 hover:text-red-300",
        /* Violet text link */
        link:
          "bg-transparent text-[var(--nv-violet-400)] border-transparent underline-offset-4 " +
          "hover:text-[var(--nv-violet-300)] hover:underline p-0 h-auto",
        /* Bright violet gradient — hero CTA */
        premium:
          "bg-gradient-to-r from-[var(--nv-violet-700)] to-[var(--nv-violet-500)] text-white border-0 " +
          "hover:from-[var(--nv-violet-600)] hover:to-[var(--nv-violet-400)] " +
          "hover:shadow-[var(--nv-shadow-glow-lg)] active:scale-[0.98]",
      },
      size: {
        xs: "h-7 px-3 text-xs rounded-[var(--nv-radius-md)] [&_svg]:size-3",
        sm: "h-8 px-3.5 text-xs rounded-[var(--nv-radius-md)] [&_svg]:size-3.5",
        default: "h-10 px-5 text-sm rounded-[var(--nv-radius-lg)] [&_svg]:size-4",
        lg: "h-12 px-6 text-base rounded-[var(--nv-radius-xl)] [&_svg]:size-5",
        xl: "h-14 px-8 text-lg rounded-[var(--nv-radius-xl)] [&_svg]:size-5",
        icon: "h-9 w-9 rounded-[var(--nv-radius-lg)] [&_svg]:size-4",
        "icon-sm": "h-7 w-7 rounded-[var(--nv-radius-md)] [&_svg]:size-3.5",
        "icon-lg": "h-11 w-11 rounded-[var(--nv-radius-xl)] [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

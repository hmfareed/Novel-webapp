import * as React from "react";
import { cn } from "@/lib/utils";

/* ============================================================
   NovelVerse — PageContainer
   Wraps every page with the correct max-width, centering,
   and horizontal padding. Use this as the outermost wrapper
   inside every page component.
   ============================================================ */

interface PageContainerProps {
  /** Horizontal padding and max-width constraints */
  variant?: "default" | "wide" | "narrow" | "full";
  /** Additional top padding for pages without a hero */
  padded?: boolean;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<NonNullable<PageContainerProps["variant"]>, string> = {
  default: "max-w-[1280px]",
  wide:    "max-w-[1440px]",
  narrow:  "max-w-[960px]",
  full:    "max-w-none",
};

export function PageContainer({
  variant = "default",
  padded = false,
  className,
  children,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "w-full mx-auto px-6 lg:px-8 xl:px-12",
        variantStyles[variant],
        padded && "pt-8 lg:pt-12",
        className
      )}
    >
      {children}
    </div>
  );
}

"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-[var(--nv-surface-2)] border border-[var(--nv-border-default)] " +
            "text-[var(--nv-text-primary)] shadow-[var(--nv-shadow-elevated)] rounded-[var(--nv-radius-xl)]",
          description: "text-[var(--nv-text-muted)]",
          actionButton:
            "bg-[var(--nv-violet-600)] text-white rounded-[var(--nv-radius-md)] text-xs font-medium",
          cancelButton:
            "bg-[var(--nv-surface-3)] text-[var(--nv-text-muted)] rounded-[var(--nv-radius-md)] text-xs",
          error:
            "bg-red-950/40 border-red-900/50 text-red-300",
          success:
            "bg-emerald-950/30 border-emerald-900/40 text-emerald-300",
          warning:
            "bg-amber-950/30 border-amber-900/40 text-amber-300",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

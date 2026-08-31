import * as React from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   NovelVerse — ErrorState
   Error boundary fallback and inline error display.
   ============================================================ */

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again.",
  onRetry,
  retryLabel = "Try again",
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16",
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      {/* Icon */}
      <div className="mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-red-950/30 border border-red-900/30">
        <AlertTriangle className="w-6 h-6 text-red-400" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-[var(--nv-text-primary)] mb-2">{title}</h3>

      {/* Description */}
      <p className="text-sm text-[var(--nv-text-muted)] max-w-sm leading-relaxed mb-6">
        {description}
      </p>

      {/* Retry */}
      {onRetry && (
        <button
          onClick={onRetry}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2",
            "rounded-[var(--nv-radius-md)] text-sm font-medium",
            "bg-[var(--nv-surface-2)] border border-[var(--nv-border-default)]",
            "text-[var(--nv-text-secondary)]",
            "hover:bg-[var(--nv-surface-3)] hover:border-[var(--nv-border-emphasis)]",
            "transition-colors duration-[var(--nv-transition-fast)]",
            "focus-visible:outline-none focus-visible:shadow-[var(--nv-focus-ring)]"
          )}
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          {retryLabel}
        </button>
      )}
    </div>
  );
}

/* ── Error Boundary (class component wrapper) ────────────── */
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class NovelVerseErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // TODO: send to error tracking (Sentry, etc.)
    console.error("[NovelVerse ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <ErrorState
          onRetry={() => this.setState({ hasError: false, error: undefined })}
        />
      );
    }
    return this.props.children;
  }
}

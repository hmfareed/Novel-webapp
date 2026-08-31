"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  User,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/explore";
  const { signIn } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await signIn(identifier.trim(), password);

      if (res.success) {
        router.push(redirect);
        router.refresh();
      } else {
        setError(res.error || "Invalid credentials");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="z-10 w-full max-w-md">
      <div className="bg-[#050505] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Welcome back</h2>
          <p className="text-xs text-zinc-400 mt-1">Log in to continue your reading journey.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email or Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Email or Username</label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                required
                placeholder="Enter your email or username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder:text-zinc-500 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-zinc-300">Password</label>
              <Link href="#" className="text-[11px] text-violet-400 hover:text-violet-300 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4 w-4 text-zinc-500" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-10 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder:text-zinc-500 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-zinc-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-violet-600/30 border border-violet-400/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <span>Log in</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        {/* Footer link */}
        <div className="pt-2 text-center text-xs text-zinc-400 border-t border-white/5">
          Don&apos;t have an account?{" "}
          <Link
            href={`/sign-up?redirect=${encodeURIComponent(redirect)}`}
            className="text-violet-400 hover:text-violet-300 font-semibold hover:underline"
          >
            Sign up &gt;
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black relative overflow-hidden px-4 py-12 selection:bg-violet-600/30 selection:text-white">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Brand Header */}
      <div className="flex flex-col items-center gap-2 mb-6 z-10 text-center">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-9 w-9 items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9 text-violet-400 group-hover:scale-105 transition-transform drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
              <path d="M12 2L15 8L21 9L16.5 14L18 20L12 16.5L6 20L7.5 14L3 9L9 8L12 2Z" fill="url(#nv-signin-grad)" stroke="#a855f7" strokeWidth="1" />
              <defs>
                <linearGradient id="nv-signin-grad" x1="3" y1="2" x2="21" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#c084fc" />
                  <stop offset="0.5" stopColor="#9333ea" />
                  <stop offset="1" stopColor="#6b21a8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white flex items-center gap-1">
            Novel<span className="text-white">Verse</span>
            <Sparkles className="w-4 h-4 text-violet-400 ml-1" />
          </span>
        </Link>
        <p className="text-xs text-zinc-400 max-w-sm">
          Welcome back! Read your favorite web novels and stories.
        </p>
      </div>

      <Suspense fallback={<div className="text-xs text-zinc-500">Loading form...</div>}>
        <SignInForm />
      </Suspense>
    </div>
  );
}

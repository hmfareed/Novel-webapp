import Link from "next/link";
import { BookOpen, Sparkles, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-black text-zinc-400 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/5">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-800 shadow-md shadow-violet-600/30">
                <BookOpen className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Novel<span className="text-violet-400">Verse</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              NovelVerse is the next-generation digital storytelling platform. Read original web novels, immerse in deep lore, and connect with passionate writers worldwide.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-violet-950/60 border border-violet-800/40 text-violet-300">
                <Sparkles className="w-3 h-3 text-violet-400" />
                AMOLED Cinematic Experience
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/explore" className="hover:text-violet-400 transition-colors">
                  All Novels
                </Link>
              </li>
              <li>
                <Link href="/explore?filter=trending" className="hover:text-violet-400 transition-colors">
                  Trending Stories
                </Link>
              </li>
              <li>
                <Link href="/explore?filter=new" className="hover:text-violet-400 transition-colors">
                  New Releases
                </Link>
              </li>
              <li>
                <Link href="/explore?genre=fantasy" className="hover:text-violet-400 transition-colors">
                  Dark Fantasy
                </Link>
              </li>
              <li>
                <Link href="/explore?genre=african_stories" className="hover:text-violet-400 transition-colors">
                  African Mythology
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Writers */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Creators
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/author" className="hover:text-violet-400 transition-colors">
                  Author Studio
                </Link>
              </li>
              <li>
                <Link href="/author/novels/new" className="hover:text-violet-400 transition-colors">
                  Publish a Story
                </Link>
              </li>
              <li>
                <Link href="/#guidelines" className="hover:text-violet-400 transition-colors">
                  Author Guidelines
                </Link>
              </li>
              <li>
                <Link href="/#monetization" className="hover:text-violet-400 transition-colors">
                  Royalties & Earnings
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/#terms" className="hover:text-violet-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/#privacy" className="hover:text-violet-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/#copyright" className="hover:text-violet-400 transition-colors">
                  DMCA & Copyright
                </Link>
              </li>
              <li>
                <Link href="/#support" className="hover:text-violet-400 transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} NovelVerse Inc. All rights reserved.</p>
          <p className="flex items-center gap-1 text-zinc-400">
            Crafted with <Heart className="w-3.5 h-3.5 text-violet-500 fill-violet-500" /> for web fiction lovers
          </p>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/use-auth";
import "./globals.css";

/* ── Metadata ────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: "NovelVerse — Stories That Stay With You",
    template: "%s | NovelVerse",
  },
  description:
    "Read unlimited novels, discover new worlds, and connect with passionate readers and authors on NovelVerse.",
  keywords: [
    "novels",
    "reading",
    "web novels",
    "fiction",
    "fantasy",
    "romance",
    "NovelVerse",
  ],
  authors: [{ name: "NovelVerse" }],
  creator: "NovelVerse",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "NovelVerse",
    title: "NovelVerse — Stories That Stay With You",
    description:
      "Read unlimited novels, discover new worlds, and connect with passionate readers and authors.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NovelVerse — Stories That Stay With You",
    description:
      "Read unlimited novels, discover new worlds, and connect with passionate readers and authors.",
    creator: "@novelverse",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

/* ── Types ───────────────────────────────────────────────── */
interface RootLayoutProps {
  children: React.ReactNode;
}

/* ── Layout ──────────────────────────────────────────────── */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className="dark antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-nv-bg text-nv-text-primary font-sans antialiased">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

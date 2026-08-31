import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/jwt";

// Protected routes that strictly require authentication
const PROTECTED_PATHS = [
  "/admin",
  "/library",
  "/author",
  "/settings",
  "/profile",
  "/reading-room",
  "/challenges",
  "/clubs",
  "/wallet",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  let session = null;
  if (sessionCookie) {
    session = await verifySessionToken(sessionCookie);
  }

  const isAuthenticated = !!session?.userId;

  // If unauthenticated user visits a protected path, redirect to sign-in
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  if (!isAuthenticated && isProtected) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (e.g. /assets/...)
     */
    "/((?!_next/static|_next/image|favicon.ico|assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

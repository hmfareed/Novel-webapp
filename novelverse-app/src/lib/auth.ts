/**
 * NovelVerse — Authentication Helpers
 * Server-side utilities for authentication and authorization using JWT & MongoDB.
 */

import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME, SessionPayload } from "./jwt";
import { User, IUser } from "@/models/User";
import { connectToDatabase } from "./db";
import type { UserRole } from "@/types";

/* ── Get current session payload from cookies ─────────────── */
export async function getCurrentSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

/* ── Get current user ID (server-side) ───────────────────── */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getCurrentSession();
  return session?.userId ?? null;
}

/* ── Get current full User document from DB ──────────────── */
export async function getCurrentUser(): Promise<IUser | null> {
  const session = await getCurrentSession();
  if (!session?.userId) return null;

  try {
    await connectToDatabase();
    const user = await User.findById(session.userId).select("-passwordHash");
    return user;
  } catch {
    return null;
  }
}

/* ── Require authenticated user (throws if not) ─────────── */
export async function requireAuth(): Promise<SessionPayload> {
  const session = await getCurrentSession();
  if (!session?.userId) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

/* ── Check user role ─────────────────────────────────────── */
export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  const session = await getCurrentSession();
  if (!session) return false;
  return session.role === requiredRole;
}

/* ── Require specific role ───────────────────────────────── */
export async function requireRole(role: UserRole): Promise<void> {
  const hasIt = await hasRole(role);
  if (!hasIt) {
    throw new Error("FORBIDDEN");
  }
}

/** Role hierarchy for permission checks */
const ROLE_WEIGHT: Record<UserRole, number> = {
  READER: 1,
  AUTHOR: 2,
  MODERATOR: 3,
  ADMIN: 4,
  SUPER_ADMIN: 5,
};

/* ── Require minimum role in hierarchy ───────────────────── */
export async function requireMinRole(minRole: UserRole): Promise<void> {
  const session = await getCurrentSession();
  if (!session) throw new Error("UNAUTHORIZED");
  const role = session.role as UserRole;
  if (!role || ROLE_WEIGHT[role] < ROLE_WEIGHT[minRole]) {
    throw new Error("FORBIDDEN");
  }
}

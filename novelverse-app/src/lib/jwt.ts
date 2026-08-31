import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE_NAME = "nv_session";

export interface SessionPayload {
  userId: string;
  email: string;
  username: string;
  role: string;
  name: string;
  avatar?: string;
  [key: string]: unknown;
}

const getJwtSecret = () => {
  const secret =
    process.env.JWT_SECRET ||
    process.env.CLERK_SECRET_KEY ||
    "novelverse-super-secret-key-32-chars-long-2026!";
  return new TextEncoder().encode(secret);
};

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  const secret = getJwtSecret();
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
};

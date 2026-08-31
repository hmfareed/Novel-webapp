import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import { User, toSafeUser } from "@/models/User";
import { signSessionToken, SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "@/lib/jwt";

const SignUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(60),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = SignUpSchema.safeParse(body);

    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || "Invalid input";
      return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
    }

    const { name, username, email, password } = result.data;

    await connectToDatabase();

    // Check if email or username already taken
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() },
      ],
    });

    if (existingUser) {
      if (existingUser.email.toLowerCase() === email.toLowerCase()) {
        return NextResponse.json(
          { success: false, error: "An account with this email already exists" },
          { status: 409 }
        );
      }
      if (existingUser.username.toLowerCase() === username.toLowerCase()) {
        return NextResponse.json(
          { success: false, error: "This username is already taken" },
          { status: 409 }
        );
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Default avatar generator based on name
    const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

    // Create user
    const newUser = await User.create({
      name: name.trim(),
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      avatar: defaultAvatar,
      role: "READER",
      favoriteGenres: [],
      followersCount: 0,
      followingCount: 0,
      novelsReadCount: 0,
      readingStreakDays: 1,
    });

    const safeUser = toSafeUser(newUser);

    // Sign session token
    const token = await signSessionToken({
      userId: safeUser.id,
      email: safeUser.email,
      username: safeUser.username,
      name: safeUser.name,
      role: safeUser.role,
      avatar: safeUser.avatar,
    });

    const response = NextResponse.json(
      {
        success: true,
        user: safeUser,
        message: "Account created successfully",
      },
      { status: 201 }
    );

    // Set HTTP-only session cookie
    response.cookies.set(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);

    return response;
  } catch (error: unknown) {
    console.error("[Sign Up Error]", error);
    const err = error as Error;
    let message = "Internal server error. Please try again.";

    if (err?.message?.includes("authentication failed") || err?.message?.includes("bad auth")) {
      message = "Database authentication failed. Please verify your MongoDB credentials in .env.local.";
    } else if (err?.message?.includes("ECONNREFUSED") || err?.message?.includes("whitelisted") || err?.message?.includes("ETIMEDOUT")) {
      message = "Database connection error. Please ensure your IP address is whitelisted (0.0.0.0/0) in MongoDB Atlas Network Access.";
    }

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

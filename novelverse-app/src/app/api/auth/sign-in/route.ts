import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import { User, toSafeUser } from "@/models/User";
import { signSessionToken, SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "@/lib/jwt";

const SignInSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = SignInSchema.safeParse(body);

    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || "Invalid input";
      return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
    }

    const { identifier, password } = result.data;
    const cleanIdentifier = identifier.trim().toLowerCase();

    await connectToDatabase();

    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { email: cleanIdentifier },
        { username: cleanIdentifier },
      ],
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { success: false, error: "Invalid email/username or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email/username or password" },
        { status: 401 }
      );
    }

    // Update lastActiveAt
    user.lastActiveAt = new Date();
    await user.save();

    const safeUser = toSafeUser(user);

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
        message: "Signed in successfully",
      },
      { status: 200 }
    );

    // Set HTTP-only session cookie
    response.cookies.set(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);

    return response;
  } catch (error: unknown) {
    console.error("[Sign In Error]", error);
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

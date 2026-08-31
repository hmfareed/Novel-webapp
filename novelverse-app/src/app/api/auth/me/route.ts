import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User, toSafeUser } from "@/models/User";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/jwt";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ success: false, user: null }, { status: 200 });
    }

    const payload = await verifySessionToken(token);
    if (!payload?.userId) {
      return NextResponse.json({ success: false, user: null }, { status: 200 });
    }

    await connectToDatabase();
    const user = await User.findById(payload.userId);

    if (!user) {
      return NextResponse.json({ success: false, user: null }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      user: toSafeUser(user),
    });
  } catch (error) {
    console.error("[Auth /me Error]", error);
    return NextResponse.json({ success: false, user: null }, { status: 200 });
  }
}

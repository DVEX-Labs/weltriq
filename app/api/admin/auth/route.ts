import { NextRequest, NextResponse } from "next/server";
import {
  validateAdminCredentials,
  setAdminSessionCookie,
  clearAdminSessionCookie,
  isAuthenticatedAdmin,
} from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const isValid = validateAdminCredentials(username, password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    await setAdminSessionCookie(username);
    return NextResponse.json({ success: true, message: "Logged in successfully." });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  await clearAdminSessionCookie();
  return NextResponse.json({ success: true, message: "Logged out successfully." });
}

export async function GET() {
  const isAuth = await isAuthenticatedAdmin();
  return NextResponse.json({ authenticated: isAuth });
}

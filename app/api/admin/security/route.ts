import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/auth/session";
import { updateAdminPassword, getStoredSecurityRecord } from "@/lib/auth/security";

export async function GET() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const record = getStoredSecurityRecord();
  const username = record?.username || process.env.ADMIN_USERNAME || "admin";
  const lastUpdated = record?.updatedAt || null;

  return NextResponse.json({
    username,
    lastUpdated,
    status: "active",
  });
}

export async function POST(request: NextRequest) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword) {
      return NextResponse.json(
        { error: "Current password is required to authorize this change." },
        { status: 400 }
      );
    }

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "New password and confirmation do not match." },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: "New password must be different from current password." },
        { status: 400 }
      );
    }

    const result = await updateAdminPassword(currentPassword, newPassword);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to update password." }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Admin password updated successfully. Use your new password on future logins.",
    });
  } catch (error) {
    console.error("Security update error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while updating security settings." },
      { status: 500 }
    );
  }
}


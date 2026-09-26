import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "../../issues/_db";

function getAuthenticatedUser(request: NextRequest) {
  const sessionCookie = request.cookies.get("social_x_session")?.value;
  if (sessionCookie) {
    try {
      const parts = sessionCookie.split(".");
      const payload = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf-8"));
      return payload;
    } catch {
      // Fallback
    }
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.substring(7);
      const parts = token.split(".");
      if (parts.length >= 2) {
        return JSON.parse(Buffer.from(parts[0], "base64url").toString("utf-8"));
      }
    } catch {
      // Fallback
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    const userId = user?.sub || undefined;

    const notifs = centralIssuesDb.getNotifications(userId);

    return NextResponse.json({
      success: true,
      data: notifs,
      items: notifs,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load notifications." },
      { status: 500 }
    );
  }
}

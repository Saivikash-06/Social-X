import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "@/app/api/issues/_db";

export async function GET() {
  try {
    const data = centralIssuesDb.getAdminUniversityAuditData();
    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error: any) {
    console.error("GET /api/admin/university-collaborations error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load admin university audit data." },
      { status: 500 }
    );
  }
}

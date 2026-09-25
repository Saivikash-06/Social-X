import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "@/app/api/issues/_db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const recipientId = searchParams.get("recipientId") || undefined;

    const certificates = centralIssuesDb.getUniversityCertificates(recipientId);

    return NextResponse.json({
      success: true,
      certificates,
      total: certificates.length,
    });
  } catch (error: any) {
    console.error("GET /api/university/certificates error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load certificates." },
      { status: 500 }
    );
  }
}

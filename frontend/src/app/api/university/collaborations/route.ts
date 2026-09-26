import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "@/app/api/issues/_db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const universityId = searchParams.get("universityId") || undefined;
    const facultyId = searchParams.get("facultyId") || undefined;
    const studentTeamId = searchParams.get("studentTeamId") || undefined;
    const industryId = searchParams.get("industryId") || undefined;
    const workOrderId = searchParams.get("workOrderId") || undefined;
    const status = searchParams.get("status") || undefined;

    const items = centralIssuesDb.getUniversityCollaborations({
      universityId,
      facultyId,
      studentTeamId,
      industryId,
      workOrderId,
      status,
    });

    return NextResponse.json({
      success: true,
      items,
      collaborations: items,
      total: items.length,
    });
  } catch (error: any) {
    console.error("GET /api/university/collaborations error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load collaborations." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "@/app/api/issues/_db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.studentTeamId) {
      return NextResponse.json(
        { success: false, error: "studentTeamId is required." },
        { status: 400 }
      );
    }

    const facultyId = body.facultyId || "fac-001";
    const studentTeamId = body.studentTeamId;
    const milestones = Array.isArray(body.milestones) ? body.milestones : undefined;

    const collaboration = centralIssuesDb.assignStudentTeamToCollaboration(id, {
      facultyId,
      studentTeamId,
      milestones,
    });

    return NextResponse.json({
      success: true,
      collaboration,
      message: `Project #${id} assigned to student team ${collaboration.studentTeamName}.`,
    });
  } catch (error: any) {
    console.error("POST /api/university/collaborations/[id]/assign-team error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to assign student team." },
      { status: 500 }
    );
  }
}

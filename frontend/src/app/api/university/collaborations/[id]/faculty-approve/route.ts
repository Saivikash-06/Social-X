import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "@/app/api/issues/_db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const facultyId = body.facultyId || "fac-001";
    const approved = body.approved !== false;
    const feedback =
      body.feedback ||
      "Laboratory validation confirmed that prototype complies with municipal accuracy and structural integrity standards.";
    const mentorRating = Number(body.mentorRating) || 5;

    const collaboration = centralIssuesDb.facultyApproveSolution(id, {
      facultyId,
      approved,
      feedback,
      mentorRating,
    });

    return NextResponse.json({
      success: true,
      collaboration,
      message: approved
        ? "Solution endorsed by Faculty Mentor and forwarded to Industry Partner for field validation."
        : "Revisions requested by Faculty Mentor. Returned to student team.",
    });
  } catch (error: any) {
    console.error("POST /api/university/collaborations/[id]/faculty-approve error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to endorse solution." },
      { status: 500 }
    );
  }
}

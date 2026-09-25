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
    const decision = body.decision === "reject" ? "reject" : "accept";
    const rejectionReason = body.rejectionReason;
    const notes = body.notes;

    const collaboration = centralIssuesDb.facultyDecisionOnCollaboration(id, {
      facultyId,
      decision,
      rejectionReason,
      notes,
    });

    return NextResponse.json({
      success: true,
      collaboration,
      message:
        decision === "accept"
          ? `Collaboration #${id} accepted. Proceed to student team assignment.`
          : `Collaboration #${id} declined. Returned to industry partner.`,
    });
  } catch (error: any) {
    console.error("POST /api/university/collaborations/[id]/faculty-decision error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process faculty decision." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "@/app/api/issues/_db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const officerId = body.officerId || "off-tn-001";
    const officerName = body.officerName || "Thiru S. Sivakumar, IAS";
    const notes = body.notes || "Case reviewed. Handled internally by municipal division.";
    const targetStatus = body.targetStatus || "in_progress";

    const issue = centralIssuesDb.handleInternally(id, {
      officerId,
      officerName,
      notes,
      targetStatus,
    });

    return NextResponse.json({
      success: true,
      issue,
      message: `Issue #${id} assigned for internal government resolution.`,
    });
  } catch (error: any) {
    console.error("POST /api/government/issues/[id]/handle-internal error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to handle internally." },
      { status: 500 }
    );
  }
}

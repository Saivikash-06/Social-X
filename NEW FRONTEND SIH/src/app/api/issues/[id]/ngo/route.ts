import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "../../_db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const ngoId = body.ngoId || "ngo-che-01";
    const ngoName = body.ngoName || "Clean Chennai Green Action Foundation";
    const needsVolunteers = body.needsVolunteers !== false;
    const societyCoordinator = body.societyCoordinator;
    const volunteerCount = body.volunteerCount;
    const actionSummary = body.actionSummary;
    const completionEvidenceUrl = body.completionEvidenceUrl;

    const updatedIssue = centralIssuesDb.submitNgoAction(id, {
      ngoId,
      ngoName,
      needsVolunteers,
      societyCoordinator,
      volunteerCount,
      actionSummary,
      completionEvidenceUrl,
    });

    return NextResponse.json({
      success: true,
      issue: updatedIssue,
      message: "NGO action recorded successfully.",
    });
  } catch (error: any) {
    console.error("POST /api/issues/[id]/ngo error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to record NGO action." },
      { status: 500 }
    );
  }
}

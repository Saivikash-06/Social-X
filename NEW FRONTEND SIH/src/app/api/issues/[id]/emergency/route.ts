import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "../../_db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const responseStatus = body.responseStatus || "on_scene";
    const agencyNotes = body.agencyNotes || "Units deployed on scene; active perimeter established.";
    const updatedBy = body.updatedBy || "District Emergency Control Center (112)";

    const updatedIssue = centralIssuesDb.updateEmergencyDispatch(id, {
      responseStatus,
      agencyNotes,
      updatedBy,
    });

    return NextResponse.json({
      success: true,
      issue: updatedIssue,
      message: `Emergency response status updated to ${responseStatus}.`,
    });
  } catch (error: any) {
    console.error("POST /api/issues/[id]/emergency error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update emergency dispatch." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "../../_db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { status, officerName, details, reason } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: "New status is required." },
        { status: 400 }
      );
    }

    const noteDetails = details || reason || "";
    const updated = centralIssuesDb.updateStatus(
      id,
      status,
      officerName || "Authorized Government Official",
      noteDetails
    );

    return NextResponse.json({
      success: true,
      issue: updated,
      message: `Issue #${id} status updated to ${status}. Citizen notified.`,
    });
  } catch (error: any) {
    console.error("POST /api/issues/[id]/status error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update issue status." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return POST(request, context);
}

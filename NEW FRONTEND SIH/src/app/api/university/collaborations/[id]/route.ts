import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "@/app/api/issues/_db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collaboration = centralIssuesDb.getCollaborationById(id);

    if (!collaboration) {
      return NextResponse.json(
        { success: false, error: `Collaboration #${id} not found.` },
        { status: 404 }
      );
    }

    const issue = centralIssuesDb.getById(collaboration.issueId);
    const workOrder = centralIssuesDb.getWorkOrderById(collaboration.workOrderId);

    return NextResponse.json({
      success: true,
      collaboration,
      issue,
      workOrder,
    });
  } catch (error: any) {
    console.error("GET /api/university/collaborations/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load collaboration." },
      { status: 500 }
    );
  }
}

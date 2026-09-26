import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "../../../issues/_db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const workOrder = centralIssuesDb.getWorkOrderById(id);
    if (!workOrder) {
      return NextResponse.json(
        { success: false, error: `Work Order #${id} not found.` },
        { status: 404 }
      );
    }

    const issue = centralIssuesDb.getById(workOrder.issueId);

    return NextResponse.json({
      success: true,
      workOrder,
      issue,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load work order." },
      { status: 500 }
    );
  }
}

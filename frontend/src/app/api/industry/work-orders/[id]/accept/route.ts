import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "../../../../issues/_db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const workOrder = centralIssuesDb.acceptWorkOrder(id, body.notes);
    return NextResponse.json({
      success: true,
      workOrder,
      message: `Work Order #${id} accepted. Mobilization underway.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to accept work order." },
      { status: 500 }
    );
  }
}

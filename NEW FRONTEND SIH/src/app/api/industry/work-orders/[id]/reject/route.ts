import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "../../../../issues/_db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const reason = body.reason || "Resource bandwidth constraints.";
    const workOrder = centralIssuesDb.rejectWorkOrder(id, reason);
    return NextResponse.json({
      success: true,
      workOrder,
      message: `Work Order #${id} declined and returned to Government.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to decline work order." },
      { status: 500 }
    );
  }
}

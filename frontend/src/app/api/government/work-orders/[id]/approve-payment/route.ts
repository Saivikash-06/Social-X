import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "@/app/api/issues/_db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const officerName = body.officerName || "Thiru S. Sivakumar, IAS";
    const notes = body.notes || "Treasury payment voucher authorized post-inspection.";

    const workOrder = centralIssuesDb.approvePayment(id, {
      officerName,
      notes,
    });

    return NextResponse.json({
      success: true,
      workOrder,
      payment: workOrder.payment,
      message: `Municipal Treasury payment authorized and released for Work Order #${id}.`,
    });
  } catch (error: any) {
    console.error("POST /api/government/work-orders/[id]/approve-payment error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to authorize payment." },
      { status: 500 }
    );
  }
}

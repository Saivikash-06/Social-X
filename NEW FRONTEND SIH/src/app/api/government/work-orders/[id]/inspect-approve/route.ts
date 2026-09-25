import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "@/app/api/issues/_db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const inspectionRemarks =
      body.inspectionRemarks || "Site inspection conducted. Technical work verified and compliant with safety specifications.";
    const officerName = body.officerName || "Thiru S. Sivakumar, IAS";

    const workOrder = centralIssuesDb.inspectAndApproveWork(id, {
      inspectionRemarks,
      officerName,
    });

    return NextResponse.json({
      success: true,
      workOrder,
      message: `Work Order #${id} successfully inspected and approved. Issue marked resolved.`,
    });
  } catch (error: any) {
    console.error("POST /api/government/work-orders/[id]/inspect-approve error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to inspect and approve work." },
      { status: 500 }
    );
  }
}

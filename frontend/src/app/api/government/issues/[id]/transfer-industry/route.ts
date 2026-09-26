import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "@/app/api/issues/_db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const recommendations = centralIssuesDb.recommendCompaniesForIssue(id);
    return NextResponse.json({
      success: true,
      recommendations,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to recommend industry partners." },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.companyId) {
      return NextResponse.json(
        { success: false, error: "Target companyId is required to generate Work Order." },
        { status: 400 }
      );
    }

    const scopeOfWork =
      body.scopeOfWork || "Execute technical repairs, site mitigation, and deliver completion report under SLA.";
    const budget = Number(body.budget) || 250000;
    const deadline = body.deadline || new Date(Date.now() + 72 * 3600 * 1000).toISOString();
    const officerRemarks = body.officerRemarks || "Strict compliance with safety standards and milestone timeline.";
    const officerName = body.officerName || "Thiru S. Sivakumar, IAS";
    const officerId = body.officerId || "off-tn-001";

    const result = centralIssuesDb.transferToIndustry(id, {
      companyId: body.companyId,
      scopeOfWork,
      budget,
      deadline,
      officerRemarks,
      officerName,
      officerId,
    });

    return NextResponse.json({
      success: true,
      issue: result.issue,
      workOrder: result.workOrder,
      message: `Work Order #${result.workOrder.id} successfully generated and transferred to ${result.workOrder.companyName}.`,
    });
  } catch (error: any) {
    console.error("POST /api/government/issues/[id]/transfer-industry error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to transfer issue to industry." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "../../../../issues/_db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const completionSummary =
      body.completionSummary || "All work order milestones completed, tested, and ready for site inspection.";
    const evidenceUrls = Array.isArray(body.evidenceUrls) ? body.evidenceUrls : [];
    const testResults = body.testResults || "Hydrostatic/Load tests passed within allowable parameters.";

    const workOrder = centralIssuesDb.submitCompletionReport(id, {
      completionSummary,
      evidenceUrls,
      testResults,
    });

    return NextResponse.json({
      success: true,
      workOrder,
      message: "Final completion report submitted. Government site inspection scheduled.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit completion report." },
      { status: 500 }
    );
  }
}

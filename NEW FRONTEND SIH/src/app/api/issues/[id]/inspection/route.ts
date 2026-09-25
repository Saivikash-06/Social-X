import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "../../_db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const inspectionOfficer = body.inspectionOfficer || "Er. M. Ramanathan (Chief Municipal Inspector)";
    const qualityScore = typeof body.qualityScore === "number" ? body.qualityScore : 95;
    const safetyCompliant = body.safetyCompliant !== false;
    const completionVerified = body.completionVerified !== false;
    const remarks = body.remarks || "All repair benchmarks and safety standards verified on site.";
    const approvePayment = body.approvePayment !== false;
    const invoiceRef = body.invoiceRef;
    const paymentAmount = body.paymentAmount;

    const updatedIssue = centralIssuesDb.conductGovernmentInspection(id, {
      inspectionOfficer,
      officerId: body.officerId,
      qualityScore,
      safetyCompliant,
      completionVerified,
      remarks,
      approvePayment,
      invoiceRef,
      paymentAmount,
    });

    return NextResponse.json({
      success: true,
      issue: updatedIssue,
      message: "Government inspection conducted successfully.",
    });
  } catch (error: any) {
    console.error("POST /api/issues/[id]/inspection error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to conduct inspection." },
      { status: 500 }
    );
  }
}

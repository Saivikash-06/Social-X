import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "../../../../issues/_db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const progressPercentage = Number(body.progressPercentage) || 50;
    const description = body.description || "Field work milestone executed as per specification.";
    const evidenceUrls = Array.isArray(body.evidenceUrls) ? body.evidenceUrls : [];

    const workOrder = centralIssuesDb.submitProgressReport(id, {
      progressPercentage,
      description,
      evidenceUrls,
    });

    return NextResponse.json({
      success: true,
      workOrder,
      message: `Progress report (${progressPercentage}%) logged successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit progress report." },
      { status: 500 }
    );
  }
}

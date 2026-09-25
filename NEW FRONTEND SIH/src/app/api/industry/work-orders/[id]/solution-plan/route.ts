import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "../../../../issues/_db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const technicalApproach = body.technicalApproach || "Standard municipal engineering procedure.";
    const milestones = Array.isArray(body.milestones) ? body.milestones : [];
    const equipmentDeployed = Array.isArray(body.equipmentDeployed) ? body.equipmentDeployed : [];

    const workOrder = centralIssuesDb.submitSolutionPlan(id, {
      technicalApproach,
      milestones,
      equipmentDeployed,
    });

    return NextResponse.json({
      success: true,
      workOrder,
      message: "Solution plan successfully lodged with Government monitoring authority.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit solution plan." },
      { status: 500 }
    );
  }
}

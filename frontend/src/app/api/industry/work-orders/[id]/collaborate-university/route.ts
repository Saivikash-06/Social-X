import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "@/app/api/issues/_db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const recommendationResult = centralIssuesDb.recommendUniversitiesForWorkOrder(id);
    return NextResponse.json({
      success: true,
      ...recommendationResult,
    });
  } catch (error: any) {
    console.error("GET /api/industry/work-orders/[id]/collaborate-university error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to recommend universities." },
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

    if (!body.universityId || !body.facultyId) {
      return NextResponse.json(
        { success: false, error: "universityId and facultyId are required." },
        { status: 400 }
      );
    }

    const result = centralIssuesDb.requestUniversityCollaboration(id, {
      universityId: body.universityId,
      department: body.department || "Artificial Intelligence",
      facultyId: body.facultyId,
      researchGrant: Number(body.researchGrant) || 100000,
      objectives: body.objectives || "Conduct specialized R&D and construct laboratory prototype for civic mitigation.",
      requiredDeliverables: Array.isArray(body.requiredDeliverables)
        ? body.requiredDeliverables
        : ["Technical Proposal", "Working Prototype", "Lab Calibration Report"],
      deadline: body.deadline || new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString(),
    });

    return NextResponse.json({
      success: true,
      collaboration: result.collaboration,
      workOrder: result.workOrder,
      issue: result.issue,
      message: `Collaboration Request #${result.collaboration.id} submitted to ${result.collaboration.facultyName} (${result.collaboration.universityName}).`,
    });
  } catch (error: any) {
    console.error("POST /api/industry/work-orders/[id]/collaborate-university error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to initiate university collaboration." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "../../_db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedIssue = centralIssuesDb.submitImpactAssessment(id, {
      beforePhotoUrls: body.beforePhotoUrls,
      afterPhotoUrls: body.afterPhotoUrls,
      completionEvidenceUrls: body.completionEvidenceUrls,
      citizenSatisfactionScore: body.citizenSatisfactionScore,
      governmentRating: body.governmentRating,
      industryPerformanceScore: body.industryPerformanceScore,
      universityContributionScore: body.universityContributionScore,
      studentInnovationScore: body.studentInnovationScore,
      assessedBy: body.assessedBy,
    });

    return NextResponse.json({
      success: true,
      issue: updatedIssue,
      impactAssessment: updatedIssue.impactAssessment,
      message: "Impact assessment successfully evaluated and recorded.",
    });
  } catch (error: any) {
    console.error("POST /api/issues/[id]/impact error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to record impact assessment." },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const issue = centralIssuesDb.getById(id);

    if (!issue) {
      return NextResponse.json(
        { success: false, error: `Issue #${id} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      impactAssessment: issue.impactAssessment || null,
      issue,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch impact assessment." },
      { status: 500 }
    );
  }
}

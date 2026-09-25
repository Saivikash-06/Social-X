import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "../../_db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (typeof body.rating !== "number" || body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { success: false, error: "A valid star rating from 1 to 5 is required." },
        { status: 400 }
      );
    }

    if (!body.feedback || typeof body.feedback !== "string" || body.feedback.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Citizen feedback comment is required." },
        { status: 400 }
      );
    }

    const updatedIssue = centralIssuesDb.submitCitizenFeedback(id, {
      rating: body.rating,
      feedback: body.feedback,
      comments: body.comments,
      citizenId: body.citizenId,
    });

    return NextResponse.json({
      success: true,
      issue: updatedIssue,
      citizenFeedback: updatedIssue.citizenFeedback,
      status: updatedIssue.status,
      message: "Citizen feedback received. Case officially closed and archived.",
    });
  } catch (error: any) {
    console.error("POST /api/issues/[id]/feedback error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit citizen feedback." },
      { status: 500 }
    );
  }
}

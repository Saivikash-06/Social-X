import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "../../../../issues/_db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (!body.question) {
      return NextResponse.json(
        { success: false, error: "Question/clarification text is required." },
        { status: 400 }
      );
    }
    const workOrder = centralIssuesDb.requestClarification(id, body.question);
    return NextResponse.json({
      success: true,
      workOrder,
      message: "Clarification request submitted to Government department.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit clarification." },
      { status: 500 }
    );
  }
}

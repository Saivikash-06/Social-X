import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "../../_db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { officerId, officerName, department } = body;

    if (!officerName) {
      return NextResponse.json(
        { success: false, error: "Officer name is required for reassignment." },
        { status: 400 }
      );
    }

    const updated = centralIssuesDb.reassignOfficer(
      id,
      officerId || `off-${Date.now()}`,
      officerName,
      department
    );

    return NextResponse.json({
      success: true,
      issue: updated,
      message: `Issue #${id} reassigned to Officer ${officerName}. Citizen notified.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to reassign officer." },
      { status: 500 }
    );
  }
}

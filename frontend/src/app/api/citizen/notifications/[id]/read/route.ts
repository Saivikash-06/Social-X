import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "../../../../issues/_db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = centralIssuesDb.markNotificationRead(id);
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

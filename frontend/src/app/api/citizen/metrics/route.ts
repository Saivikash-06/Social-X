import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "../../issues/_db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || undefined;
    const metrics = centralIssuesDb.getCitizenMetrics(userId);
    return NextResponse.json({ success: true, data: metrics });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

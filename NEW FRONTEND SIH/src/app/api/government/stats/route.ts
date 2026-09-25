import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "../../issues/_db";

export async function GET() {
  try {
    const stats = centralIssuesDb.getGovernmentStats();
    return NextResponse.json({ success: true, stats, data: stats });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

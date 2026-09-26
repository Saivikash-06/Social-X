import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "../../issues/_db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId") || undefined;
    const issueId = searchParams.get("issueId") || undefined;
    const status = searchParams.get("status") || undefined;

    const items = centralIssuesDb.getWorkOrders({ companyId, issueId, status });
    return NextResponse.json({
      success: true,
      items,
      data: items,
      workOrders: items,
      total: items.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve work orders." },
      { status: 500 }
    );
  }
}

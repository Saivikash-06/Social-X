import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "../../issues/_db";

export async function GET() {
  try {
    const data = centralIssuesDb.getAdminAuditData();
    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load audit data." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, companyId, verified, companyData } = body;

    if (action === "verify" && companyId) {
      const updated = centralIssuesDb.verifyCompany(companyId, Boolean(verified));
      return NextResponse.json({
        success: true,
        company: updated,
        message: `Company #${companyId} verification updated to ${verified}.`,
      });
    }

    if (action === "register" && companyData) {
      const created = centralIssuesDb.registerCompany(companyData);
      return NextResponse.json({
        success: true,
        company: created,
        message: `Registered new industry partner: ${created.name}.`,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action or parameters." },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process admin action." },
      { status: 500 }
    );
  }
}

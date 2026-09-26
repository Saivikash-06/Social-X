import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "@/app/api/issues/_db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const industryId = body.industryId || "comp-ind-001";
    const decision =
      body.decision === "modifications_requested"
        ? "modifications_requested"
        : body.decision === "rejected"
        ? "rejected"
        : "accepted";

    const feedback =
      body.feedback ||
      "Prototype successfully integrated with municipal field equipment. Sensor telemetry confirmed operational. Research grant disbursed.";
    const deploymentEvidenceUrl =
      body.deploymentEvidenceUrl ||
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80";

    const collaboration = centralIssuesDb.industryValidateSolution(id, {
      industryId,
      decision,
      feedback,
      deploymentEvidenceUrl,
    });

    return NextResponse.json({
      success: true,
      collaboration,
      certificates: collaboration.certificates,
      message:
        decision === "accepted"
          ? "University prototype validated and deployed. Certificates and academic credits awarded. Government notified for site inspection."
          : `Decision logged: ${decision}.`,
    });
  } catch (error: any) {
    console.error("POST /api/industry/collaborations/[id]/validate error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to validate university solution." },
      { status: 500 }
    );
  }
}

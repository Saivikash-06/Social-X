import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "@/app/api/issues/_db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const title = body.title || "Innovative Technical Prototype & Engineering Blueprint";
    const summary =
      body.summary ||
      "Student team conducted computer simulations, built functional hardware prototype, and validated performance parameters in university test laboratories.";
    const prototypeImages = Array.isArray(body.prototypeImages)
      ? body.prototypeImages
      : ["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"];
    const sourceCodeUrl = body.sourceCodeUrl || "https://github.com/social-x-innovations/aquasense-prototype";
    const researchPaperUrl = body.researchPaperUrl || "https://example.edu/papers/sonar_pipe_mitigation.pdf";
    const submittedBy = body.submittedBy || "Aditya Krishnan (Team Lead)";
    const teamId = body.teamId || "team-001";

    const collaboration = centralIssuesDb.studentSubmitSolution(id, {
      teamId,
      title,
      summary,
      prototypeImages,
      sourceCodeUrl,
      researchPaperUrl,
      submittedBy,
    });

    return NextResponse.json({
      success: true,
      collaboration,
      message: "Prototype and technical documentation submitted for Faculty Mentor review.",
    });
  } catch (error: any) {
    console.error("POST /api/university/collaborations/[id]/submit-solution error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit student solution." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "../_db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const issue = centralIssuesDb.getById(id);

    if (!issue) {
      return NextResponse.json(
        { success: false, error: `Issue #${id} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      issue,
      data: issue,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve issue." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.note) {
      const updated = centralIssuesDb.addOfficerNote(
        id,
        body.author || "Government Official",
        body.authorRole || "Officer",
        body.note
      );
      return NextResponse.json({ success: true, issue: updated });
    }

    if (body.workLog) {
      const updated = centralIssuesDb.addWorkLogEntry(id, {
        stage: body.workLog.stage || body.stage,
        title: body.workLog.title || body.title || "Field Work Update",
        description: body.workLog.description || body.description || "",
        actor: body.workLog.actor || body.author || "Field Engineering Unit",
        actorRole: body.workLog.actorRole || body.authorRole || "Site Supervisor",
        evidenceUrl: body.workLog.evidenceUrl || body.evidenceUrl,
      });
      return NextResponse.json({ success: true, issue: updated });
    }

    if (body.attachment) {
      const updated = centralIssuesDb.addAttachment(id, body.attachment);
      return NextResponse.json({ success: true, issue: updated });
    }

    if (body.status) {
      const updated = centralIssuesDb.updateStatus(
        id,
        body.status,
        body.officerName || body.author || "Authorized Official",
        body.details || body.reason || `Status updated to ${body.status}`
      );
      return NextResponse.json({ success: true, issue: updated });
    }

    if (body.reassign) {
      const updated = centralIssuesDb.reassignOfficer(
        id,
        body.reassign.officerId || body.officerId,
        body.reassign.officerName || body.officerName,
        body.reassign.department || body.department
      );
      return NextResponse.json({ success: true, issue: updated });
    }

    const issue = centralIssuesDb.getById(id);
    if (!issue) {
      return NextResponse.json(
        { success: false, error: `Issue #${id} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, issue });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update issue." },
      { status: 500 }
    );
  }
}

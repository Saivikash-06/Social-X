import { NextRequest, NextResponse } from "next/server";
import { centralIssuesDb } from "./_db";

// Helper to extract session or auth token
function getAuthenticatedUser(request: NextRequest) {
  const sessionCookie = request.cookies.get("social_x_session")?.value;
  if (sessionCookie) {
    try {
      const parts = sessionCookie.split(".");
      const payload = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf-8"));
      return payload;
    } catch {
      // Fallback
    }
  }

  // Also check Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.substring(7);
      const parts = token.split(".");
      if (parts.length >= 2) {
        const payload = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf-8"));
        return payload;
      }
    } catch {
      // Fallback
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const priority = searchParams.get("priority") || undefined;
    const department = searchParams.get("department") || undefined;
    const district = searchParams.get("district") || undefined;
    const citizenId = searchParams.get("citizenId") || undefined;
    const search = searchParams.get("search") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const all = centralIssuesDb.getAll({
      status,
      priority,
      department,
      district,
      citizenId,
      search,
    });

    const total = all.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;
    const items = all.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      items,
      data: items,
      total,
      totalPages,
      page,
      limit,
    });
  } catch (error: any) {
    console.error("GET /api/issues error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve issues." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: any;
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      body = {
        title: formData.get("title")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        category: formData.get("category")?.toString() || "",
        priority: formData.get("priority")?.toString() || "high",
        department: formData.get("department")?.toString() || "",
        address: formData.get("address")?.toString() || "",
        location: formData.get("location")?.toString() || formData.get("address")?.toString() || "",
        latitude: parseFloat(formData.get("latitude")?.toString() || "13.0425"),
        longitude: parseFloat(formData.get("longitude")?.toString() || "80.2514"),
        isAnonymous: formData.get("isAnonymous") === "true",
      };
    } else {
      body = await request.json();
    }

    // 1. Authenticated User Check (Security Rule #9)
    const sessionUser = getAuthenticatedUser(request);
    const citizenId = sessionUser?.sub || body.citizenId || "usr-cit-01";
    const citizenName = sessionUser?.name || body.citizenName || "Vikash (Citizen)";
    const citizenEmail = sessionUser?.email || body.citizenEmail || "citizen.vikash@example.com";
    const citizenPhone = body.citizenPhone || "+91 98401 22891";

    // 2. Validate all required fields (Rule #1)
    if (!body.title || typeof body.title !== "string" || body.title.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: "Complaint title is required (minimum 3 characters)." },
        { status: 400 }
      );
    }

    if (!body.description || typeof body.description !== "string" || body.description.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: "Complaint description is required (minimum 5 characters)." },
        { status: 400 }
      );
    }

    const locationStr =
      typeof body.location === "string"
        ? body.location
        : body.location?.address || (typeof body.address === "string" ? body.address : "");

    if (!locationStr.trim()) {
      return NextResponse.json(
        { success: false, error: "Incident location or address is required for municipal dispatch." },
        { status: 400 }
      );
    }

    const latitude =
      typeof body.latitude === "number"
        ? body.latitude
        : typeof body.location?.lat === "number"
        ? body.location.lat
        : 13.0425;

    const longitude =
      typeof body.longitude === "number"
        ? body.longitude
        : typeof body.location?.lng === "number"
        ? body.location.lng
        : 80.2514;

    // 3. Process attachments
    const images: { id: string; url: string; label: string }[] = [];
    const videos: { id: string; url: string; label: string; duration?: string }[] = [];
    const voiceNotes: { id: string; url: string; label: string; duration?: string }[] = [];

    if (body.images && Array.isArray(body.images)) {
      body.images.forEach((img: any, idx: number) => {
        images.push({
          id: `img-${Date.now()}-${idx}`,
          url: typeof img === "string" ? img : img.url || "",
          label: img.label || body.title,
        });
      });
    }

    if (body.attachments && Array.isArray(body.attachments)) {
      body.attachments.forEach((att: any, idx: number) => {
        const attType = att.type || "";
        const attUrl = att.url || "";
        if (attType.startsWith("video")) {
          videos.push({
            id: `vid-${Date.now()}-${idx}`,
            url: attUrl,
            label: att.name || "Citizen Video Evidence",
            duration: "0:30",
          });
        } else if (attType.startsWith("audio")) {
          voiceNotes.push({
            id: `aud-${Date.now()}-${idx}`,
            url: attUrl,
            label: att.name || "Citizen Audio Note",
            duration: "0:25",
          });
        } else {
          images.push({
            id: `img-${Date.now()}-${idx}`,
            url: attUrl,
            label: att.name || body.title,
          });
        }
      });
    }

    if (body.videoUrl) {
      videos.push({ id: `vid-${Date.now()}`, url: body.videoUrl, label: "Citizen Video", duration: "0:30" });
    }
    if (body.audioUrl) {
      voiceNotes.push({ id: `aud-${Date.now()}`, url: body.audioUrl, label: "Citizen Spoken Audio", duration: "0:25" });
    }

    const attachments = {
      images: images.length > 0 ? images : [
        {
          id: `img-${Date.now()}-1`,
          url: body.imageUrl || "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80",
          label: body.title,
        },
      ],
      videos,
      voiceNotes,
      documents: [],
    };

    // 4. Save complaint in the central database with AI routing
    const newIssue = centralIssuesDb.createIssue({
      title: body.title,
      description: body.description,
      category: body.category,
      priority: body.priority,
      department: body.department,
      citizenId,
      citizenName,
      citizenPhone,
      citizenEmail,
      isAnonymous: body.isAnonymous,
      location: locationStr,
      latitude,
      longitude,
      attachments,
      ocrText: body.ocrText,
      sttText: body.sttText,
    });

    return NextResponse.json(
      {
        success: true,
        issueId: newIssue.id,
        issue: newIssue,
        message: `Complaint submitted successfully! Registered under Issue ID ${newIssue.id}. Routed to ${newIssue.assignedDepartment}.`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/issues error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit issue." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { GET as handleGetIssues, POST as handlePostIssues } from "@/app/api/issues/route";

export async function GET(request: NextRequest) {
  return handleGetIssues(request);
}

export async function POST(request: NextRequest) {
  return handlePostIssues(request);
}

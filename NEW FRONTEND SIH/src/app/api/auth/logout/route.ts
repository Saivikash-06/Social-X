import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });

  const cookiesToClear = [
    "social_x_session",
    "social_x_admin_role",
    "social_x_government_role",
    "social_x_university_role",
    "social_x_industry_role",
    "social_x_ngo_role",
    "social_x_research_role",
    "social_x_user_role",
  ];

  for (const cookieName of cookiesToClear) {
    response.cookies.set(cookieName, "", {
      maxAge: 0,
      path: "/",
    });
  }

  return response;
}

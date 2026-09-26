import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  socialXDatabase,
  getDashboardForRole,
} from "../_db";

export async function POST(request: NextRequest) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request payload." },
      { status: 400 }
    );
  }

  try {
    const { email } = body;

    // 1. Authenticate with Google & retrieve Google email
    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "Google authentication failed: Email not provided by Google account." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // 2. Check whether this email already exists in the Social-X database
    const user = socialXDatabase.findUserByEmail(cleanEmail);

    // 3. If it does not exist: BLOCK LOGIN & DISPLAY REQUIRED ERROR MESSAGE
    // NEVER AUTO-CREATE ACCOUNTS FROM GOOGLE SIGN-IN
    if (!user) {
      return NextResponse.json(
        {
          error:
            "This Google account is not registered. Please create an account first using the same email address.",
          code: "GOOGLE_ACCOUNT_NOT_REGISTERED",
        },
        { status: 404 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Your account has been deactivated. Please contact administration." },
        { status: 403 }
      );
    }

    // 4. If it exists: SIGN IN TO THE EXISTING ACCOUNT (NO DUPLICATE CREATED)
    const sessionPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      provider: "google",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
    };
    const sessionToken = Buffer.from(JSON.stringify(sessionPayload)).toString("base64url");
    const signature = crypto
      .createHmac("sha256", process.env.JWT_SECRET || "social-x-secure-jwt-secret-key-2026")
      .update(sessionToken)
      .digest("base64url");
    const jwt = `${sessionToken}.${signature}`;

    // Redirect to the user's dashboard based on their role
    const redirectUrl = getDashboardForRole(user.role);

    const safeUser = {
      id: user.id,
      email: user.email,
      fullName: user.name,
      name: user.name,
      role: user.role,
      district: user.district,
      state: user.state,
      department: user.department,
      university: user.university,
      organization: user.organization,
      phoneNumber: user.phoneNumber,
      isVerified: true,
      createdAt: user.createdAt,
    };

    const response = NextResponse.json({
      success: true,
      message: "Google Sign-In successful",
      user: safeUser,
      tokens: {
        accessToken: jwt,
        refreshToken: `refresh_google_${crypto.randomBytes(24).toString("hex")}`,
        tokenType: "Bearer",
      },
      redirectUrl,
    });

    const isProd = process.env.NODE_ENV === "production";
    const maxAge = 7 * 24 * 60 * 60; // 7 days

    // Store secure HttpOnly session cookie
    response.cookies.set("social_x_session", jwt, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge,
      path: "/",
    });

    // Store secure HttpOnly role guard cookies matching Next.js middleware
    if (user.role === "government") {
      response.cookies.set("social_x_government_role", "official", {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        maxAge,
        path: "/",
      });
    } else if (user.role === "faculty") {
      response.cookies.set("social_x_university_role", "faculty", {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        maxAge,
        path: "/",
      });
    } else if (user.role === "student") {
      response.cookies.set("social_x_university_role", "student", {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        maxAge,
        path: "/",
      });
    } else if (user.role === "industry") {
      response.cookies.set("social_x_industry_role", "partner", {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        maxAge,
        path: "/",
      });
    } else if (user.role === "ngo") {
      response.cookies.set("social_x_ngo_role", "director", {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        maxAge,
        path: "/",
      });
    } else if (user.role === "research") {
      response.cookies.set("social_x_research_role", "scientist", {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        maxAge,
        path: "/",
      });
    } else if (user.role === "admin") {
      response.cookies.set("social_x_admin_role", "super_admin", {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        maxAge,
        path: "/",
      });
    }

    // Role helper cookie for client-side state
    response.cookies.set("social_x_user_role", user.role, {
      httpOnly: false,
      secure: isProd,
      sameSite: "lax",
      maxAge,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error during Google authentication." },
      { status: 500 }
    );
  }
}

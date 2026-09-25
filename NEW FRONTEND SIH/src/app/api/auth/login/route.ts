import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  socialXDatabase,
  verifyPassword,
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
    const { email, password } = body;

    // 1. Require Email & Password
    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // 2. Verify that the email exists
    const user = socialXDatabase.findUserByEmail(cleanEmail);
    if (!user) {
      return NextResponse.json(
        { error: "No account found. Please register first." },
        { status: 404 }
      );
    }

    // 3. If the email exists, verify the password hash
    const isPasswordValid = verifyPassword(password, user.hashedPassword, user.salt);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Incorrect password. Please try again." },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Your account has been deactivated. Please contact administration." },
        { status: 403 }
      );
    }

    // 4. Only on successful verification:
    // Create JWT / session token
    const sessionPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
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
      message: "Login successful",
      user: safeUser,
      tokens: {
        accessToken: jwt,
        refreshToken: `refresh_${crypto.randomBytes(24).toString("hex")}`,
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
      { error: error?.message || "Internal server error during authentication." },
      { status: 500 }
    );
  }
}

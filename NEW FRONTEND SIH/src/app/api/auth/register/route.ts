import { NextRequest, NextResponse } from "next/server";
import { socialXDatabase } from "../_db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, fullName, name, role, phoneNumber, state, district } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required for registration." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = socialXDatabase.findUserByEmail(cleanEmail);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please sign in." },
        { status: 400 }
      );
    }

    const newUser = socialXDatabase.createUser({
      email: cleanEmail,
      password,
      name: (fullName || name || cleanEmail.split("@")[0]).trim(),
      role: role || "citizen",
      phoneNumber,
      state,
      district,
    });

    return NextResponse.json({
      success: true,
      message: "Registration successful. You can now log in with your credentials.",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to register account." },
      { status: 500 }
    );
  }
}

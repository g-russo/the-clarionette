import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In production, use a proper database and password hashing
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@clarionette.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"; // Change this!
const ADMIN_SECRET = process.env.ADMIN_SECRET || "default-secret-key";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Generate a simple token (in production, use JWT or proper session management)
      const token = crypto
        .createHmac("sha256", ADMIN_SECRET)
        .update(`${email}:${Date.now()}`)
        .digest("hex");

      return NextResponse.json(
        { success: true, token },
        { status: 200 }
      );
    }

    // Invalid credentials
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}

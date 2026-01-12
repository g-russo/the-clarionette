import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear the admin authentication cookie
  response.cookies.set("admin_auth", "", {
    maxAge: 0,
    path: "/",
  });
  
  return response;
}

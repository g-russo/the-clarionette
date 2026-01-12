import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidRoute } from "./app/config/routes";

// Admin route protection - use environment variable for security
const ADMIN_PATH = process.env.ADMIN_PATH || "/admin";
const ADMIN_SECRET = process.env.ADMIN_SECRET; // Set this in .env.local

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes with authentication
  if (pathname.startsWith(ADMIN_PATH)) {
    const authToken = request.cookies.get("admin_auth")?.value;
    
    // If no auth token and not on login page, redirect to login
    if (!authToken && !pathname.endsWith("/login")) {
      return NextResponse.redirect(new URL(`${ADMIN_PATH}/login`, request.url));
    }
    
    // Allow authenticated users to proceed
    return NextResponse.next();
  }

  // Allow static assets (images, fonts, etc.) to proceed
  if (pathname.startsWith("/images/") || 
      pathname.startsWith("/icons/") || 
      pathname.startsWith("/fonts/") ||
      pathname.includes(".ico") ||
      pathname.includes(".png") ||
      pathname.includes(".jpg") ||
      pathname.includes(".jpeg") ||
      pathname.includes(".gif") ||
      pathname.includes(".webp") ||
      pathname.includes(".svg")) {
    return NextResponse.next();
  }

  // Allow valid routes and Next.js internal routes to proceed
  if (isValidRoute(pathname) || pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Handle 404 for invalid routes by redirecting to home
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

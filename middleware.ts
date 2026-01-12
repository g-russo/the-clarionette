import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidRoute, DEFAULT_MAIN_ROUTE } from "./app/config/routes";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle root path redirect to main
  if (pathname === "/") {
    return NextResponse.redirect(new URL(DEFAULT_MAIN_ROUTE, request.url));
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

  // Allow valid routes to proceed
  if (isValidRoute(pathname)) {
    return NextResponse.next();
  }

  // Handle 404 for invalid routes by redirecting to main
  if (!pathname.startsWith("/_next") && !pathname.startsWith("/api")) {
    return NextResponse.redirect(new URL(DEFAULT_MAIN_ROUTE, request.url));
  }

  return NextResponse.next();
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

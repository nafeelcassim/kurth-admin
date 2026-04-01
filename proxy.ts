import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // 1. Get the actual JWT from the HttpOnly cookie
  const accessToken = req.cookies.get("access_token")?.value;

  // 2. Define Protected Routes and their required roles
  const isProtectedRoute = pathname === "/" || pathname.startsWith("/orders") || pathname.startsWith("/users") || pathname.startsWith("/products");
  const isAuthRoute = pathname === "/login";

  if (isProtectedRoute) {
    if (!accessToken) {
      // Access token missing → let frontend try refresh
      return NextResponse.next();
    }

    // Optional: decode access token for roles here

    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (accessToken) {
      // If already logged in, don't show the login page
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

// 4. Update the matcher to be more inclusive
export const config = {
  matcher: [
    "/",
    "/orders/:path*",
    "/users/:path*",
    "/products/:path*",
    "/login",
  ],
};
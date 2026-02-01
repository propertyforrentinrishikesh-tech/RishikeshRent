import { NextResponse } from "next/server";
import { getToken, decode } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const { pathname } = req.nextUrl;

  // Protect Partner Property Registration form
  if (pathname.startsWith("/partner/property_registration")) {
    const registrationToken = req.cookies.get('partner_registration_token')?.value;

    if (!registrationToken) {
      // No token found, redirect to register/login
      return NextResponse.redirect(new URL("/partner/register", req.url));
    }

    try {
      // Verify the token is valid
      await decode({
        token: registrationToken,
        secret: process.env.NEXTAUTH_SECRET,
      });
      // If decode succeeds, allow access
      return NextResponse.next();
    } catch (error) {
      // Token invalid/expired
      return NextResponse.redirect(new URL("/partner/register", req.url));
    }
  }

  // Protect Partner Hotel Property Updates page
  if (pathname.startsWith("/partner/hotel_property_updates")) {
    const partnerToken = req.cookies.get('partner_token')?.value;

    if (!partnerToken) {
      return NextResponse.redirect(new URL("/partner/login", req.url));
    }

    try {
      await decode({
        token: partnerToken,
        secret: process.env.NEXTAUTH_SECRET,
      });
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL("/partner/login", req.url));
    }
  }

  // Allow access to create-first-admin without authentication
  if (pathname === '/api/admin/create-first-admin') {
    return NextResponse.next();
  }
  // Allow access to public routes (e.g., /sign-in, /admin/login)
  if (pathname.startsWith("/admin/login")) {
    if (token) {
      if (token.isAdmin || token.isSubAdmin) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    if (token && !token.isAdmin && !token.isSubAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Protect /admin/* pages (Allow both Admins & SubAdmins)
  if (pathname.startsWith("/admin")) {
    if (!token || (!token.isAdmin && !token.isSubAdmin)) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Protect /api/admin/* routes (Allow both Admins & SubAdmins)
  if (pathname.startsWith("/api/admin")) {
    if (!token || (!token.isAdmin && !token.isSubAdmin)) {
      return NextResponse.json(
        { message: "Unauthorized access!" },
        { status: 403 }
      );
    }
  }

  // Protect /profile page: Only allow logged-in users (Google Auth or credentials)
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/orders")) {
    if (!token) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  return NextResponse.next();
}

// Apply middleware to protect admin and user routes
export const config = {
  matcher: [
    "/partner/property_registration",
    "/partner/hotel_property_updates",
    "/admin/:path*",
    "/api/admin/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/checkout/orderConfirmed/:path*",
    "/sign-in",
    "/sign-up",
    "/admin/login",
  ],
};

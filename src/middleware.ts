import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** Middleware: WWW redirect only */
export function middleware(req: NextRequest) {
  // Redirect WWW → apex (308)
  const host = (req.headers.get("host") || "").toLowerCase();
  if (host === "www.crsetsolutions.com") {
    const url = new URL(req.url);
    url.hostname = "crsetsolutions.com";
    return NextResponse.redirect(url.toString(), 308);
  }

  return NextResponse.next();
}

// Match all routes except static files and API routes
export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\.(?:png|jpg|jpeg|webp|svg|gif|ico|css|js)).*)',
  ],
};


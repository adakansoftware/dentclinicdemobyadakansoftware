import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { buildIpRateLimitKeyFromHeaders, enforceRateLimitByKey } from "@/lib/security";

function isPrivateOrLocalHostname(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)
  );
}

function buildCsp(request: NextRequest) {
  const isLocalRequest = isPrivateOrLocalHostname(request.nextUrl.hostname);
  const isSecureRequest = request.nextUrl.protocol === "https:";
  const connectSources =
    isLocalRequest || !isSecureRequest
      ? "'self' http: https: ws: wss:"
      : "'self' https: wss:";

  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https:",
    "style-src 'self' 'unsafe-inline' https:",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    `connect-src ${connectSources}`,
    "frame-src 'self' https://www.google.com https://www.google.com.tr",
    "frame-ancestors 'none'",
    "object-src 'none'",
  ];

  if (!isLocalRequest && isSecureRequest) {
    directives.push("upgrade-insecure-requests");
  }

  return directives.join("; ");
}

function getRateLimitPolicy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/cron/reminders")) {
    return { scope: "mw-cron", limit: 12, windowMs: 60 * 1000 };
  }

  if (pathname.startsWith("/api/slots")) {
    return { scope: "mw-slots", limit: 30, windowMs: 60 * 1000 };
  }

  if (pathname.startsWith("/api/")) {
    return { scope: "mw-api", limit: 60, windowMs: 60 * 1000 };
  }

  if (pathname.startsWith("/admin/login")) {
    return { scope: "mw-admin-login", limit: 20, windowMs: 10 * 60 * 1000 };
  }

  if (pathname.startsWith("/admin")) {
    return { scope: "mw-admin", limit: 120, windowMs: 60 * 1000 };
  }

  if (
    pathname.startsWith("/appointment") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/reviews")
  ) {
    return { scope: "mw-sensitive-page", limit: 45, windowMs: 60 * 1000 };
  }

  return { scope: "mw-page", limit: 180, windowMs: 60 * 1000 };
}

export function middleware(request: NextRequest) {
  const isStaticAsset =
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/images") ||
    request.nextUrl.pathname === "/favicon.ico" ||
    request.nextUrl.pathname.startsWith("/robots.txt") ||
    request.nextUrl.pathname.startsWith("/sitemap.xml");

  if (!isStaticAsset) {
    const clientKey = buildIpRateLimitKeyFromHeaders(request.headers);
    const policy = getRateLimitPolicy(request);
    const allowed = enforceRateLimitByKey(policy, clientKey);

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "Cache-Control": "no-store",
          },
        }
      );
    }
  }

  const response = NextResponse.next();

  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  if (!isStaticAsset) {
    response.headers.set("Content-Security-Policy", buildCsp(request));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};

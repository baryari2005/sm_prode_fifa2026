import { NextRequest, NextResponse } from "next/server";

const MOBILE_FRONTEND_ORIGIN = "https://sm-prode-fifa2026-mobile.vercel.app";
const ALLOWED_METHODS = "GET, POST, PUT, PATCH, DELETE, OPTIONS";
const ALLOWED_HEADERS = "Content-Type, Authorization";

function isAllowedOrigin(origin: string | null) {
  return origin === MOBILE_FRONTEND_ORIGIN;
}

function setCorsHeaders(headers: Headers, origin: string) {
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Access-Control-Allow-Methods", ALLOWED_METHODS);
  headers.set("Access-Control-Allow-Headers", ALLOWED_HEADERS);
  headers.set("Vary", "Origin");
}

export function handleCors(req: NextRequest) {
  const origin = req.headers.get("origin");

  if (!isAllowedOrigin(origin)) {
    return undefined;
  }

  if (req.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 });
    setCorsHeaders(response.headers, origin);
    return response;
  }

  const response = NextResponse.next();
  setCorsHeaders(response.headers, origin);
  return response;
}

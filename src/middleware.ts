import { NextRequest } from "next/server";

import { handleCors } from "@/lib/cors";

export function middleware(req: NextRequest) {
  return handleCors(req);
}

export const config = {
  matcher: ["/api/:path*"],
};

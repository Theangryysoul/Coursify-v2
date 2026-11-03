import { successResponse } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export async function GET() {
  return successResponse("Backend is healthy", {
    status: "ok",
    version: "1.0.0",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
}

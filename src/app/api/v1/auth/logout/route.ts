import { clearRefreshCookie } from "@/lib/server/cookies";
import { handleRoute, successResponse } from "@/lib/server/http";

export async function POST() {
  return handleRoute(async () => {
    const response = successResponse("Logged out successfully");

    clearRefreshCookie(response);

    return response;
  });
}

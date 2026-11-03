import type { NextRequest } from "next/server";

import { requireUserId } from "@/lib/server/auth";
import { handleRoute, successResponse } from "@/lib/server/http";
import { getCurrentUserService } from "@/lib/server/services/auth.service";

export async function GET(request: NextRequest) {
  return handleRoute(async () => {
    const userId = requireUserId(request);
    const user = await getCurrentUserService(userId);

    return successResponse("User fetched successfully", user);
  });
}

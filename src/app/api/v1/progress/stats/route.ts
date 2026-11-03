import type { NextRequest } from "next/server";

import { requireUserId } from "@/lib/server/auth";
import { handleRoute, successResponse } from "@/lib/server/http";
import { getLearningStats } from "@/lib/server/services/progress.service";

export async function GET(request: NextRequest) {
  return handleRoute(async () => {
    const userId = requireUserId(request);
    const stats = await getLearningStats(userId);

    return successResponse("Learning statistics fetched successfully", stats);
  });
}

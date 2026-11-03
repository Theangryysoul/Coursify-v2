import type { NextRequest } from "next/server";

import { requireUserId } from "@/lib/server/auth";
import { handleRoute, successResponse } from "@/lib/server/http";
import { getHeatmapData } from "@/lib/server/services/progress.service";

export async function GET(request: NextRequest) {
  return handleRoute(async () => {
    const userId = requireUserId(request);
    const heatmap = await getHeatmapData(userId);

    return successResponse("Heatmap fetched successfully", heatmap);
  });
}

import type { NextRequest } from "next/server";

import { requireUserId } from "@/lib/server/auth";
import { handleRoute, successResponse } from "@/lib/server/http";
import { toggleCompleted } from "@/lib/server/services/progress.service";

type RouteContext = { params: Promise<{ videoId: string }> };

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  return handleRoute(async () => {
    const userId = requireUserId(request);
    const { videoId } = await params;

    const progress = await toggleCompleted(userId, videoId);

    return successResponse(
      "Video completion updated successfully",
      progress
    );
  });
}

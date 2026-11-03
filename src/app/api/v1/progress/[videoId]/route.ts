import type { NextRequest } from "next/server";

import { requireUserId } from "@/lib/server/auth";
import {
  handleRoute,
  parseBody,
  successResponse,
} from "@/lib/server/http";
import {
  getResume,
  updateProgress,
} from "@/lib/server/services/progress.service";
import { updateProgressSchema } from "@/lib/server/validators/progress.validator";

type RouteContext = { params: Promise<{ videoId: string }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  return handleRoute(async () => {
    const userId = requireUserId(request);
    const { videoId } = await params;

    const progress = await getResume(userId, videoId);

    return successResponse("Resume fetched successfully", progress);
  });
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  return handleRoute(async () => {
    const userId = requireUserId(request);
    const { videoId } = await params;
    const body = parseBody(updateProgressSchema, await request.json());

    const progress = await updateProgress(userId, videoId, body);

    return successResponse("Progress updated successfully", progress);
  });
}

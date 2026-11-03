import type { NextRequest } from "next/server";

import { requireUserId } from "@/lib/server/auth";
import {
  handleRoute,
  parseBody,
  successResponse,
} from "@/lib/server/http";
import { isYoutubeRequestAllowed } from "@/lib/server/rate-limit";
import { importCourse } from "@/lib/server/services/youtube.service";
import { BadRequestError } from "@/lib/server/utils/errors";
import { youtubeUrlSchema } from "@/lib/server/validators/youtube.validator";

export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    const userId = requireUserId(request);

    if (!isYoutubeRequestAllowed(userId)) {
      throw new BadRequestError(
        "Too many YouTube requests. Please wait a few minutes and try again."
      );
    }

    const { url } = parseBody(youtubeUrlSchema, await request.json());
    const userCourse = await importCourse(userId, url);

    return successResponse("Course imported successfully", userCourse);
  });
}

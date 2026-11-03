import type { NextRequest } from "next/server";

import { requireUserId } from "@/lib/server/auth";
import { handleRoute, parseBody, successResponse } from "@/lib/server/http";
import { updateProfile } from "@/lib/server/services/user.service";
import { updateProfileSchema } from "@/lib/server/validators/user.validator";

export async function PATCH(request: NextRequest) {
  return handleRoute(async () => {
    const userId = requireUserId(request);
    const body = parseBody(updateProfileSchema, await request.json());
    const user = await updateProfile(userId, body);

    return successResponse("Profile updated successfully", user);
  });
}

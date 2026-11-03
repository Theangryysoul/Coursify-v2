import type { NextRequest } from "next/server";

import { requireUserId } from "@/lib/server/auth";
import { handleRoute, parseBody, successResponse } from "@/lib/server/http";
import { changePassword } from "@/lib/server/services/auth.service";
import { changePasswordSchema } from "@/lib/server/validators/changePassword.validator";

export async function PATCH(request: NextRequest) {
  return handleRoute(async () => {
    const userId = requireUserId(request);
    const body = parseBody(changePasswordSchema, await request.json());

    await changePassword(userId, body);

    return successResponse("Password changed successfully");
  });
}

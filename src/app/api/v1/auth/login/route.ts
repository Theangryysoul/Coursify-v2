import type { NextRequest } from "next/server";

import { setRefreshCookie } from "@/lib/server/cookies";
import { handleRoute, parseBody, successResponse } from "@/lib/server/http";
import { loginUser } from "@/lib/server/services/auth.service";
import { loginSchema } from "@/lib/server/validators/auth.validator";

export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    const body = parseBody(loginSchema, await request.json());
    const data = await loginUser(body);

    const response = successResponse("Login successful", {
      user: data.user,
      accessToken: data.accessToken,
    });

    setRefreshCookie(response, data.refreshToken);

    return response;
  });
}

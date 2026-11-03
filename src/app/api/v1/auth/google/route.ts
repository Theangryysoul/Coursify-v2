import type { NextRequest } from "next/server";

import { setRefreshCookie } from "@/lib/server/cookies";
import { handleRoute, parseBody, successResponse } from "@/lib/server/http";
import { loginWithGoogle } from "@/lib/server/services/auth.service";
import { googleLoginSchema } from "@/lib/server/validators/auth.validator";

export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    const body = parseBody(googleLoginSchema, await request.json());
    const data = await loginWithGoogle(body.idToken);

    const response = successResponse("Login successful", {
      user: data.user,
      accessToken: data.accessToken,
    });

    setRefreshCookie(response, data.refreshToken);

    return response;
  });
}

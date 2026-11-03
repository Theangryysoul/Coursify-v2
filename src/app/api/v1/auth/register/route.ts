import type { NextRequest } from "next/server";

import { setRefreshCookie } from "@/lib/server/cookies";
import { handleRoute, parseBody, successResponse } from "@/lib/server/http";
import { registerUser } from "@/lib/server/services/auth.service";
import { registerSchema } from "@/lib/server/validators/auth.validator";

export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    const body = parseBody(registerSchema, await request.json());
    const data = await registerUser(body);

    const response = successResponse(
      "User registered successfully",
      { user: data.user, accessToken: data.accessToken },
      201
    );

    setRefreshCookie(response, data.refreshToken);

    return response;
  });
}

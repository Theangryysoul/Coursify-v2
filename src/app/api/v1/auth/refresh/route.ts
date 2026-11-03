import type { NextRequest } from "next/server";

import { REFRESH_TOKEN_COOKIE_NAME } from "@/lib/server/constants/auth";
import { handleRoute, successResponse } from "@/lib/server/http";
import { refreshAccessToken } from "@/lib/server/services/auth.service";
import { UnauthorizedError } from "@/lib/server/utils/errors";

export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    const refreshToken = request.cookies.get(
      REFRESH_TOKEN_COOKIE_NAME
    )?.value;

    if (!refreshToken) {
      throw new UnauthorizedError();
    }

    const { user, accessToken } = await refreshAccessToken(refreshToken);

    return successResponse("Access token refreshed", {
      user,
      accessToken,
    });
  });
}

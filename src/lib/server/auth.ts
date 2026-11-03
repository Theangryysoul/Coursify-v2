import type { NextRequest } from "next/server";

import { UnauthorizedError } from "./utils/errors";
import { verifyAccessToken } from "./utils/jwt";

/**
 * Reads and verifies the bearer token, returning the signed-in user's id.
 *
 * Throws an UnauthorizedError so the route wrapper answers 401 with the same
 * JSON shape the client already understands.
 */
export const requireUserId = (request: NextRequest): string => {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError();
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    return verifyAccessToken(token).userId;
  } catch {
    throw new UnauthorizedError("Invalid or expired access token");
  }
};

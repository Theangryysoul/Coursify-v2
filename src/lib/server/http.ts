import { NextResponse } from "next/server";
import type { ZodType } from "zod";

import { connectDB } from "./config/database";
import { configErrors } from "./config/env";
import { BadRequestError } from "./utils/errors";

export type ApiResponseBody<T> = {
  success: true;
  message: string;
  data: T;
};

export const successResponse = <T>(
  message: string,
  data: T = null as T,
  status = 200
) =>
  NextResponse.json<ApiResponseBody<T>>(
    { success: true, message, data },
    { status }
  );

export const errorResponse = (message: string, status = 500) =>
  NextResponse.json({ success: false, message }, { status });

/**
 * Wraps every route handler with the pieces the old Express middleware chain
 * provided: configuration check, database connection, and a JSON error shape.
 */
export const handleRoute = async (
  handler: () => Promise<NextResponse>
): Promise<NextResponse> => {
  if (configErrors.length > 0) {
    return errorResponse(
      `Server is missing required configuration: ${configErrors.join(", ")}`,
      503
    );
  }

  try {
    await connectDB();
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB", error);

    return errorResponse(
      "The server cannot reach its database right now. Please try again in a moment.",
      503
    );
  }

  try {
    return await handler();
  } catch (error) {
    const status =
      typeof error === "object" &&
      error !== null &&
      "statusCode" in error &&
      typeof error.statusCode === "number"
        ? error.statusCode
        : 500;

    // Expected client errors (401/404/400...) are part of normal operation;
    // only unexpected server failures deserve a stack trace in the log.
    if (status >= 500) {
      console.error(error);
    }

    return errorResponse(
      error instanceof Error ? error.message : "Internal Server Error",
      status
    );
  }
};

/** Validates a JSON body and returns the parsed value. */
export const parseBody = <T>(schema: ZodType<T>, body: unknown): T => {
  const result = schema.safeParse(body);

  if (!result.success) {
    throw new BadRequestError(result.error.issues[0].message);
  }

  return result.data;
};

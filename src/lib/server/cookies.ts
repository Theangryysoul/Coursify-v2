import type { NextResponse } from "next/server";

import {
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_MAX_AGE_MS,
} from "./constants/auth";

const baseOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

export const setRefreshCookie = (response: NextResponse, token: string) => {
  response.cookies.set(REFRESH_TOKEN_COOKIE_NAME, token, {
    ...baseOptions,
    maxAge: Math.floor(REFRESH_TOKEN_MAX_AGE_MS / 1000),
  });
};

export const clearRefreshCookie = (response: NextResponse) => {
  response.cookies.set(REFRESH_TOKEN_COOKIE_NAME, "", {
    ...baseOptions,
    maxAge: 0,
  });
};

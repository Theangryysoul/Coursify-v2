"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/store/auth.store";

/**
 * Restores the session on a page load.
 *
 * The access token only lives in memory, so a reload always starts with none.
 * The refresh cookie is the actual proof of identity: it is exchanged here for
 * a new token *and* the profile, and the route guards wait on it before
 * deciding whether the visitor is signed in.
 */
export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (useAuthStore.getState().accessToken) {
      // Already signed in during this page's lifetime (e.g. StrictMode
      // remount, or a login that happened before this ran).
      useAuthStore.getState().setStatus("authenticated");
      return;
    }

    let cancelled = false;

    const restoreSession = async () => {
      try {
        // Imported on demand: the session check is the only reason the public
        // pages would pull in the networking layer, and this keeps that weight
        // off the first paint of the landing page.
        const { refresh } = await import("@/api/auth.api");

        if (cancelled) return;

        const { user, accessToken } = await refresh();

        if (cancelled) return;

        useAuthStore.getState().setSession(user, accessToken);
      } catch {
        // No cookie, or it expired. That is the normal signed-out state.
        if (cancelled) return;

        useAuthStore.getState().clearSession();
      }
    };

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  return <>{children}</>;
}

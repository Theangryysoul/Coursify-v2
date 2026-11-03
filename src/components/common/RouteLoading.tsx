"use client";

import { Logo } from "@/components/common/Logo";

/**
 * Shown while a lazily-loaded route (dashboard, courses, settings...) is being
 * fetched. It mirrors the final layout closely enough that the swap does not
 * feel like a jump.
 */
export function RouteLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="lp-clay-card lp-clay-white flex w-full max-w-sm flex-col items-center gap-5 rounded-3xl px-8 py-10">
        <Logo className="h-8 w-auto animate-pulse" />

        <div className="lp-skeleton h-2 w-40 rounded-full" />

        <p className="text-muted-foreground text-xs">
          Loading your learning space...
        </p>
      </div>
    </div>
  );
}

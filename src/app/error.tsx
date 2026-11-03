"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="lp-bg-blob lp-bg-blob-1" />
      <div className="lp-bg-blob lp-bg-blob-2" />
      <div className="lp-bg-blob lp-bg-blob-3" />

      <div className="relative z-10 max-w-md space-y-5">
        <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          Something went wrong
        </h1>

        <p className="text-muted-foreground text-sm leading-6">
          An unexpected error stopped this page from loading. You can try again.
        </p>

        <Button
          onClick={reset}
          className="lp-clay-btn lp-clay-btn-primary"
        >
          Try again
        </Button>
      </div>
    </main>
  );
}

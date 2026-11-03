import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="lp-bg-blob lp-bg-blob-1" />
      <div className="lp-bg-blob lp-bg-blob-2" />
      <div className="lp-bg-blob lp-bg-blob-3" />

      <div className="relative z-10 max-w-md space-y-5">
        <p className="text-[var(--lp-coral)] text-sm font-semibold tracking-[0.2em] uppercase">
          404
        </p>

        <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          This page went missing
        </h1>

        <p className="text-muted-foreground text-sm leading-6">
          The page you are looking for does not exist, or it may have moved.
        </p>

        <Button asChild className="lp-clay-btn lp-clay-btn-primary">
          <Link href={ROUTES.DASHBOARD}>Back to dashboard</Link>
        </Button>
      </div>
    </main>
  );
}

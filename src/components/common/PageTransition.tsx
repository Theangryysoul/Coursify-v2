import type { ReactNode } from "react";

/** A lightweight route fade; individual sections already provide the rise. */
export function PageTransition({ children }: { children: ReactNode }) {
  return <div className="lp-page-enter">{children}</div>;
}

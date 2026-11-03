import type { ReactNode } from "react";

import PublicRoute from "@/components/auth/PublicRoute";

export default function AuthGroupLayout({ children }: { children: ReactNode }) {
  return <PublicRoute>{children}</PublicRoute>;
}

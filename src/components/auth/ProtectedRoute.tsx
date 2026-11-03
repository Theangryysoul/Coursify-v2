"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { FullPageLoader } from "@/components/common/FullPageLoader";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth.store";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const status = useAuthStore((state) => state.status);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(ROUTES.LOGIN);
    }
  }, [status, router]);

  // The refresh cookie has not been checked yet - anything else here would
  // bounce a signed-in user to /login on every page reload.
  if (status === "loading" || status === "unauthenticated") {
    return <FullPageLoader />;
  }

  return <>{children}</>;
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { FullPageLoader } from "@/components/common/FullPageLoader";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth.store";

/**
 * Keeps the login and register pages out of reach of an already signed-in
 * visitor, and stops them flickering while the session is being restored.
 */
export default function PublicRoute({ children }: { children: ReactNode }) {
  const status = useAuthStore((state) => state.status);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [status, router]);

  if (status === "loading" || status === "authenticated") {
    return <FullPageLoader />;
  }

  return <>{children}</>;
}

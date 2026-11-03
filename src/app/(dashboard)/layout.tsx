import type { ReactNode } from "react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/layout/DashboardLayout";

export default function DashboardGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { MobileNav } from "@/components/dashboard/MobileNav";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { PageTransition } from "@/components/common/PageTransition";
import { PageEffects } from "@/components/common/PageEffects";
import { Logo } from "@/components/common/Logo";
import { UserMenu } from "@/components/dashboard/UserMenu";
import { MotionProvider } from "@/providers/MotionProvider";
import { ROUTES } from "@/constants/routes";

/**
 * The header shown on every page except Settings.
 * Mobile keeps the navigation trigger beside the wordmark.
 */
function TopBar() {
  return (
    <header
      className="
        sticky
        top-0
        z-40
        flex
        h-16
        shrink-0
        items-center
        gap-3
        border-b
        border-white/50
        bg-white/45
        px-4
        backdrop-blur-xl
        dark:border-white/10
        dark:bg-black/25
        sm:px-6
        lg:justify-end
        lg:px-8
      "
    >
      <div className="flex items-center gap-3 lg:hidden">
        <MobileNav />
        <Logo className="h-9 w-auto" />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isSettings = pathname === ROUTES.SETTINGS;

  return (
    <MotionProvider>
      <PageEffects className="relative min-h-screen">
        <div className="lp-bg-blob lp-bg-blob-1" aria-hidden="true" />
        <div className="lp-bg-blob lp-bg-blob-2" aria-hidden="true" />
        <div className="lp-bg-blob lp-bg-blob-3" aria-hidden="true" />

        <div className="relative z-10 flex min-h-screen w-full overflow-x-clip">
          <Sidebar />

          {/* min-w-0 stops a wide child from stretching the flex row. */}
          <main className="flex min-w-0 flex-1 flex-col">
            {isSettings ? (
              <div className="flex h-16 shrink-0 items-center gap-3 px-4 lg:hidden">
                <MobileNav />
                <Logo className="h-9 w-auto" />
              </div>
            ) : (
              <TopBar />
            )}

            <div className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
              <PageTransition key={pathname}>
                {children}
              </PageTransition>
            </div>
          </main>
        </div>
      </PageEffects>
    </MotionProvider>
  );
}

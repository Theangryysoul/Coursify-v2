import type { ReactNode } from "react";
import {
  ChartColumn,
  Clock3,
  LayoutDashboard,
  PlayCircle,
} from "lucide-react";

import { Logo } from "@/components/common/Logo";
import { PageEffects } from "@/components/common/PageEffects";
import { ThemeToggle } from "@/components/common/ThemeToggle";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

const FEATURES = [
  {
    icon: PlayCircle,
    title: "Import playlists",
    description: "Bring complete YouTube playlists in seconds.",
    color: "peach",
  },
  {
    icon: ChartColumn,
    title: "Track progress",
    description: "See your learning journey at a glance.",
    color: "lilac",
  },
  {
    icon: Clock3,
    title: "Continue watching",
    description: "Resume exactly where you left off.",
    color: "mint",
  },
  {
    icon: LayoutDashboard,
    title: "A calmer dashboard",
    description: "Clean, focused and distraction-free.",
    color: "butter",
  },
];

export function AuthLayout({ children, description, title }: AuthLayoutProps) {
  return (
    <PageEffects className="relative min-h-screen overflow-hidden">
      <div className="lp-bg-blob lp-bg-blob-1" aria-hidden="true" />
      <div className="lp-bg-blob lp-bg-blob-2" aria-hidden="true" />
      <div className="lp-bg-blob lp-bg-blob-3" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_minmax(0,0.95fr)] lg:gap-14 lg:px-8">
        {/* Brand / feature panel */}
        <section className="hidden min-w-0 lg:block">
          <div className="flex items-center justify-between gap-4">
            <Logo className="h-10 w-auto" sizes="128px" />
            <ThemeToggle />
          </div>

          <div className="mt-12 max-w-lg">
            <h1 className="text-foreground text-[2.9rem] font-black leading-[1.02] tracking-[-0.045em]">
              Learn{" "}
              <span className="bg-gradient-to-r from-[var(--lp-coral)] to-[var(--lp-lavender)] bg-clip-text text-transparent">
                smarter.
              </span>
              <br />
              Build{" "}
              <span className="bg-gradient-to-r from-[var(--lp-mint)] to-[var(--lp-coral)] bg-clip-text text-transparent">
                faster.
              </span>
            </h1>

            <p className="text-muted-foreground mt-5 max-w-md text-[1rem] leading-7">
              Organise your courses, import YouTube playlists, track progress,
              and keep learning without the tab chaos.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title: featureTitle, description: featureText, color }, index) => (
              <div
                key={featureTitle}
                className={`lp-clay-card lp-clay-${color} lp-enter rounded-2xl`}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="flex items-start gap-3 p-4">
                  <div className="lp-clay-icon h-10 w-10 rounded-xl">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-foreground text-[0.95rem] font-semibold">
                      {featureTitle}
                    </h2>

                    <p className="text-muted-foreground mt-1 text-[0.8125rem] leading-5">
                      {featureText}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Form panel: one CSS entrance instead of nested JS/CSS animations. */}
        <section className="mx-auto w-full min-w-0 max-w-md">
          <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
            <Logo className="h-9 w-auto" />
            <ThemeToggle />
          </div>

          <div className="lp-clay-card lp-clay-white lp-enter rounded-[2rem] p-0">
            <div className="space-y-6 px-5 pt-7 pb-8 sm:px-8 sm:pt-9 sm:pb-10">
              <div className="text-center">
                <h2 className="text-foreground text-[1.9rem] font-bold leading-tight tracking-[-0.03em] sm:text-[2.15rem]">
                  {title}
                </h2>

                <p className="text-muted-foreground mt-2 text-sm sm:text-[0.95rem]">
                  {description}
                </p>
              </div>

              {children}
            </div>
          </div>

          <p className="text-muted-foreground mt-6 text-center text-xs leading-6">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </section>
      </div>
    </PageEffects>
  );
}

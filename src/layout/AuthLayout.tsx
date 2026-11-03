"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ChartColumn,
  Clock3,
  LayoutDashboard,
  PlayCircle,
} from "lucide-react";

import { Logo } from "@/components/common/Logo";
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
  const root = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Cursor-reactive glow
  useEffect(() => {
    const element = root.current;

    if (!element || reducedMotion) return;

    let frame = 0;

    const handlePointer = (event: PointerEvent) => {
      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        element.style.setProperty("--mx", `${event.clientX}px`);
        element.style.setProperty("--my", `${event.clientY}px`);
      });
    };

    window.addEventListener("pointermove", handlePointer);

    return () => {
      window.removeEventListener("pointermove", handlePointer);
      cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  // Reveal sections on mount
  useEffect(() => {
    if (reducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const elements = document.querySelectorAll(".lp-reveal");

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div className="relative min-h-screen overflow-hidden" ref={root}>
      <div className="lp-cursor-glow" />
      <div className="lp-bg-blob lp-bg-blob-1" />
      <div className="lp-bg-blob lp-bg-blob-2" />
      <div className="lp-bg-blob lp-bg-blob-3" />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_minmax(0,0.95fr)] lg:gap-14 lg:px-8">
        {/* Brand / feature panel */}
        <section className="lp-reveal hidden min-w-0 lg:block">
          <div className="flex items-center justify-between gap-4">
            <Logo className="h-10 w-auto" />
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
              <motion.div
                key={featureTitle}
                className={`lp-clay-card lp-clay-${color} lp-reveal rounded-2xl`}
                initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.06 }}
                style={{ transitionDelay: `${index * 80}ms` }}
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
              </motion.div>
            ))}
          </div>
        </section>

        {/* Form panel */}
        <section className="lp-reveal mx-auto w-full min-w-0 max-w-md">
          <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
            <Logo className="h-9 w-auto" />
            <ThemeToggle />
          </div>

          <motion.div
            className="lp-clay-card lp-clay-white rounded-[2rem] p-0"
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
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
          </motion.div>

          <p
            className="text-muted-foreground lp-reveal mt-6 text-center text-xs leading-6"
            style={{ transitionDelay: "180ms" }}
          >
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </section>
      </div>
    </div>
  );
}

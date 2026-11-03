"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { useMounted } from "@/hooks/use-mounted";

/**
 * Dark / Light segmented switch.
 * The sliding thumb is purely decorative; the labels stay in place, so the
 * control never changes size or alignment when it is toggled.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  // The server cannot resolve the theme, so render the light state first and
  // switch after hydration instead of producing mismatched attributes.
  const mounted = useMounted();

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      data-theme={isDark ? "dark" : "light"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="theme-switch"
    >
      <span className="theme-switch-thumb" aria-hidden="true" />

      <span className="theme-switch-option theme-switch-option-dark">
        <Moon aria-hidden="true" />
        <span className="theme-switch-label">Dark</span>
      </span>

      <span className="theme-switch-option theme-switch-option-light">
        <Sun aria-hidden="true" />
        <span className="theme-switch-label">Light</span>
      </span>
    </button>
  );
}

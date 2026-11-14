import Image from "next/image";

import { cn } from "@/lib/utils";

import logoDark from "@/assets/logo-dark.png";
import logoLight from "@/assets/logo-light.png";

interface LogoProps {
  className?: string;
  /** Rendered width: avoids requesting the full-size artwork for a small mark. */
  sizes?: string;
  /** Force a variant instead of following the active theme. */
  theme?: "light" | "dark";
}

const baseClassName = "h-9 w-auto select-none";

/**
 * The Coursify wordmark.
 *
 * Two dedicated files are shipped - a light-on-dark mark and a dark-on-light
 * one - so the artwork keeps its gradients and shadows on both themes instead
 * of being flattened by CSS filters.
 *
 * When no variant is forced, both marks are rendered and CSS picks the right
 * one from the `.dark` class that next-themes applies before paint. Deciding
 * in JavaScript would disagree with the server, which cannot resolve the theme
 * and would therefore hydrate the light mark into a dark page.
 */
export function Logo({ className, theme, sizes = "116px" }: LogoProps) {
  if (theme) {
    return (
      <Image
        src={theme === "dark" ? logoDark : logoLight}
        sizes={sizes}
        alt="Coursify"
        draggable={false}
        className={cn(baseClassName, className)}
      />
    );
  }

  return (
    <>
      <Image
        src={logoLight}
        sizes={sizes}
        alt="Coursify"
        draggable={false}
        className={cn(baseClassName, "dark:hidden", className)}
      />

      <Image
        src={logoDark}
        sizes={sizes}
        alt=""
        aria-hidden
        draggable={false}
        className={cn(baseClassName, "hidden dark:block", className)}
      />
    </>
  );
}

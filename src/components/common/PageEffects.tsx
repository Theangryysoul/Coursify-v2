"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface PageEffectsProps {
  children: ReactNode;
  className?: string;
  reveal?: boolean;
}

/** Visual enhancement only: page content is usable before this hydrates. */
export function PageEffects({
  children,
  className,
  reveal = false,
}: PageEffectsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const glow = glowRef.current;

    if (!root || !glow) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerPreference = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame: number | null = null;
    let tracking = false;
    let x = 0;
    let y = 0;

    const paintGlow = () => {
      frame = null;
      // Move one prepainted layer, not a gradient or inherited page-wide vars.
      glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const handlePointer = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;

      if (frame === null) frame = requestAnimationFrame(paintGlow);
    };

    const stopTracking = () => {
      window.removeEventListener("pointermove", handlePointer);
      tracking = false;

      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
    };

    const syncEffects = () => {
      const enabled =
        !document.hidden && !motionPreference.matches && pointerPreference.matches;

      root.dataset.effectsPaused = String(document.hidden);
      root.dataset.cursorTracking = String(enabled);

      if (enabled && !tracking) {
        window.addEventListener("pointermove", handlePointer, { passive: true });
        tracking = true;
      } else if (!enabled) {
        stopTracking();
      }
    };

    syncEffects();
    motionPreference.addEventListener("change", syncEffects);
    pointerPreference.addEventListener("change", syncEffects);
    document.addEventListener("visibilitychange", syncEffects);

    return () => {
      stopTracking();
      motionPreference.removeEventListener("change", syncEffects);
      pointerPreference.removeEventListener("change", syncEffects);
      document.removeEventListener("visibilitychange", syncEffects);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;

    if (!root || !reveal || !("IntersectionObserver" in window)) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (motionPreference.matches) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>(".lp-reveal"));
    const viewportHeight = document.documentElement.clientHeight;
    // Read positions together before writing styles. Never hide first-paint
    // content or a section already reached by an anchor/back navigation.
    const pending = targets.filter((target) => {
      const rect = target.getBoundingClientRect();
      return !target.classList.contains("visible") && rect.height > 0 &&
        rect.top >= viewportHeight;
    });

    if (!pending.length) return;

    const show = (target: HTMLElement) => {
      target.removeAttribute("data-reveal");
      target.classList.add("visible");
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px 32px 0px", threshold: 0 }
    );

    for (const target of pending) {
      target.dataset.reveal = "pending";
      observer.observe(target);
    }

    const revealFocused = (event: FocusEvent) => {
      if (!(event.target instanceof Node)) return;

      for (const target of pending) {
        if (target.contains(event.target)) {
          show(target);
          observer.unobserve(target);
        }
      }
    };

    const handleMotionChange = () => {
      if (!motionPreference.matches) return;
      observer.disconnect();
      pending.forEach(show);
    };

    root.addEventListener("focusin", revealFocused);
    motionPreference.addEventListener("change", handleMotionChange);

    return () => {
      observer.disconnect();
      root.removeEventListener("focusin", revealFocused);
      motionPreference.removeEventListener("change", handleMotionChange);
      pending.forEach((target) => target.removeAttribute("data-reveal"));
    };
  }, [reveal]);

  return (
    <div className={className} ref={rootRef}>
      <div className="lp-cursor-glow" ref={glowRef} aria-hidden="true" />
      {children}
    </div>
  );
}

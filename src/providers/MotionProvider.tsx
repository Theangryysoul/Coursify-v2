"use client";

import { domAnimation, LazyMotion, MotionConfig, type Transition } from "framer-motion";
import type { ReactNode } from "react";

const transition: Transition = {
  type: "tween",
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1],
};

/** Only the animation features used by the dashboard, without drag/layout code. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user" transition={transition}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}

"use client";

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative flex h-2 w-full items-center overflow-x-hidden rounded-full border border-white/50 bg-white/40 dark:border-white/10 dark:bg-white/10",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="size-full flex-1 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        style={{ 
          transform: `translateX(-${100 - (value || 0)}%)`,
          background: "linear-gradient(90deg, var(--lp-coral), var(--lp-lavender))"
        }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
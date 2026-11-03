"use client";

import { Clock3, PlayCircle, Tv } from "lucide-react";
import { motion } from "framer-motion";

import type { YoutubePreviewResponse } from "@/types/youtube";

interface PreviewCardProps {
  preview: YoutubePreviewResponse;
}

export function PreviewCard({ preview }: PreviewCardProps) {
  const { type, data } = preview;

  return (
    <motion.div
      className="lp-clay-card lp-clay-white mt-6 w-full max-w-3xl overflow-hidden rounded-3xl border-border/60 backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="grid md:grid-cols-[25rem_1fr]">
        <div className="overflow-hidden lp-clay-peach">
          <img
            src={data.thumbnail}
            alt={data.title}
            className="w-full object-cover aspect-video md:h-full md:aspect-auto"
          />
        </div>

        <div className="flex flex-col justify-start p-4 pt-5 sm:p-6 sm:pt-6">
          <h2 className="line-clamp-2 text-xl leading-tight font-bold sm:text-2xl text-foreground">
            {data.title}
          </h2>

          <div className="mt-3">
            <span
              className="
                inline-block
                lp-clay-card
                rounded-full
                px-3
                py-1
                text-xs
                font-semibold
                text-[var(--lp-coral)]
              "
            >
              {type === "playlist"
                ? "📚 Playlist"
                : "🎬 Single Video"}
            </span>
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            {data.channelName}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <motion.div
              className="lp-clay-card lp-clay-lilac rounded-xl p-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="mb-1 flex items-center gap-2">
                <PlayCircle className="h-4 w-4 shrink-0" style={{ color: "var(--lp-lavender)" }} />
                <span className="text-xs text-muted-foreground">
                  Videos
                </span>
              </div>

              <p className="text-lg font-bold sm:text-xl text-foreground">
                {data.videoCount}
              </p>
            </motion.div>

            <motion.div
              className="lp-clay-card lp-clay-mint rounded-xl p-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <div className="mb-1 flex items-center gap-2">
                <Tv className="h-4 w-4 shrink-0" style={{ color: "var(--lp-mint)" }} />
                <span className="text-xs text-muted-foreground">
                  Type
                </span>
              </div>

              <p className="text-lg font-bold capitalize sm:text-xl text-foreground">
                {type}
              </p>
            </motion.div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-muted-foreground">
            <Clock3 className="h-4 w-4 shrink-0" />
            <span className="text-xs">
              Total duration will be calculated after import.
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
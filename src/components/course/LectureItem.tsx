"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Play } from "lucide-react";

import type { Video } from "@/types/course-details";
import { useToggleCompleted } from "@/hooks/progress/useToggleCompleted";
import { cn } from "@/lib/utils";

const formatDuration = (duration: string) => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!match) return duration;

  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

interface LectureItemProps {
  lecture: Video;
  active: boolean;
  onClick: () => void;
}

/**
 * One entry in the "Up next" queue. It mirrors YouTube's playlist row: a
 * thumbnail with the duration, a two-line title and a completion toggle.
 */
export const LectureItem = forwardRef<
  HTMLDivElement,
  LectureItemProps
>(function LectureItem({ lecture, active, onClick }, ref) {
  const toggleCompleted = useToggleCompleted();

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-current={active ? "true" : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "group relative flex w-full cursor-pointer gap-3 rounded-xl p-2 transition-colors",
        active
          ? "bg-white/55 dark:bg-white/10"
          : "hover:bg-white/35 dark:hover:bg-white/5"
      )}
    >
      <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg bg-black/10">
        {lecture.thumbnail ? (
          <img
            src={lecture.thumbnail}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : null}

        <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
          {formatDuration(lecture.duration)}
        </span>

        {active && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/35">
            <Play className="h-5 w-5 fill-white text-white" />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1 py-0.5">
        <p
          className={cn(
            "line-clamp-2 text-sm leading-snug text-foreground",
            active ? "font-semibold" : "font-medium"
          )}
        >
          {lecture.title}
        </p>

        <span className="mt-1 block text-xs text-muted-foreground">
          Video {lecture.position}
          {lecture.completed ? " · Watched" : ""}
        </span>
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();

          toggleCompleted.mutate(lecture.videoId);
        }}
        aria-label={
          lecture.completed ? "Mark as unwatched" : "Mark as watched"
        }
        title={lecture.completed ? "Mark as unwatched" : "Mark as watched"}
        className={cn(
          "lp-clay-card lp-clay-white mt-0.5 self-start rounded-full p-1.5 transition-opacity",
          !lecture.completed && "opacity-70 group-hover:opacity-100"
        )}
      >
        {lecture.completed ? (
          <CheckCircle2
            className="h-5 w-5"
            style={{ color: "var(--lp-mint)" }}
          />
        ) : (
          <Play className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      {active && (
        <motion.span
          className="absolute bottom-0 left-0 top-0 w-1 rounded-l-xl"
          style={{
            background:
              "linear-gradient(180deg, var(--lp-coral), var(--lp-lavender))",
          }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </div>
  );
});

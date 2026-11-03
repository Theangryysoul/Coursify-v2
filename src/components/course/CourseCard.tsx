"use client";

import { Pin, Heart } from "lucide-react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CourseCardMenu } from "./CourseCardMenu";

import type { CourseItem } from "@/types/course";

interface CourseCardProps {
  course: CourseItem;
  index?: number;
}

const COLOR_CLASSES = [
  "lp-clay-peach",
  "lp-clay-lilac",
  "lp-clay-mint",
  "lp-clay-butter",
];

export function CourseCard({ course, index = 0 }: CourseCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const colorClass = COLOR_CLASSES[index % COLOR_CLASSES.length];

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
        delay: prefersReducedMotion ? 0 : Math.min(index, 3) * 0.05,
      }}
      className={`lp-clay-card ${colorClass} h-full overflow-hidden rounded-3xl`}
    >
      <div className="relative">
        <Link href={`/courses/${course.course._id}`}>
          <img
            src={course.course.thumbnail}
            alt={course.course.title}
            loading="lazy"
            className="aspect-video w-full cursor-pointer object-cover"
          />
        </Link>

        <CourseCardMenu course={course} />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 min-h-[3.5rem] text-lg leading-7 font-semibold text-foreground">
            {course.course.title}
          </h3>

          <div className="flex shrink-0 gap-2">
            {course.favorite && (
              <Heart className="h-4 w-4 fill-[var(--lp-coral)] text-[var(--lp-coral)]" />
            )}

            {course.pinned && (
              <Pin className="h-4 w-4" style={{ color: "var(--lp-coral)" }} />
            )}
          </div>
        </div>

        <div className="mt-auto space-y-4">
          <Progress value={course.progress.percentage} className="h-2" />

          <div className="text-muted-foreground flex items-center justify-between text-sm">
            <span>{course.progress.percentage}% completed</span>
            <span>{course.status}</span>
          </div>

          <Button asChild className="lp-clay-btn lp-clay-btn-primary w-full">
            <Link href={`/courses/${course.course._id}`}>Continue Learning</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
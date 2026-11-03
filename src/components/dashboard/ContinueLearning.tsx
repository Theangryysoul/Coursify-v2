"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { useCourses } from "@/hooks/course/useCourses";

export function ContinueLearning() {
  const { data: courses, isPending } = useCourses();

  if (isPending) {
    return (
      <motion.section
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold">Continue Learning</h2>

        <div className="lp-clay-card lp-clay-white h-72 animate-pulse rounded-3xl" />
      </motion.section>
    );
  }

  const course = courses?.find(
    (course) =>
      course.progress.percentage < 100 &&
      !course.archived
  );

  if (!course) {
    return (
      <motion.section
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold">Continue Learning</h2>

        <motion.div
          className="lp-clay-card lp-clay-white flex flex-col items-center justify-center rounded-3xl border border-dashed p-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h3 className="text-xl font-semibold">No courses yet 📚</h3>

          <p className="mt-2 max-w-md text-muted-foreground">
            Import your first YouTube playlist or video
            and start learning distraction-free.
          </p>

          <Button
            asChild
            className="lp-clay-btn lp-clay-btn-primary mt-6"
          >
            <Link href="/import">Import Course</Link>
          </Button>
        </motion.div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <h2 className="text-2xl font-bold">Continue Learning</h2>

      <motion.div
        className="lp-clay-card lp-clay-white overflow-hidden rounded-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="grid md:grid-cols-[320px_1fr]">
          <Link href={`/courses/${course.course._id}`}>
            <img
              src={course.course.thumbnail}
              alt={course.course.title}
              className="h-48 w-full object-cover md:h-full"
            />
          </Link>

          <div className="flex flex-col justify-between p-6 sm:p-8">
            <div>
              <p className="text-sm text-muted-foreground">
                {course.course.totalVideos} Videos
              </p>

              <h3 className="mt-2 text-2xl font-bold sm:text-3xl text-foreground">
                {course.course.title}
              </h3>

              <p className="mt-3 text-muted-foreground">
                Continue where you left off.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <Progress value={course.progress.percentage} className="h-2" />

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{course.progress.percentage}% completed</span>

                <span>{course.status}</span>
              </div>

              <Button
                asChild
                className="lp-clay-btn lp-clay-btn-primary mt-3 gap-2 w-full"
              >
                <Link href={`/courses/${course.course._id}`}>
                  Continue Learning
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
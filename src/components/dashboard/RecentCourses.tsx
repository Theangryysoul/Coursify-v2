"use client";

import { useCourses } from "@/hooks/course/useCourses";

import { RecentCourseCard } from "./RecentCourseCard";
import { motion } from "framer-motion";

export function RecentCourses() {
  const { data: courses, isPending } = useCourses();

  if (isPending) {
    return (
      <motion.section
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold">Recent Courses</h2>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <motion.div
              key={item}
              className="lp-clay-card lp-clay-white overflow-hidden rounded-2xl h-full"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(item, 3) * 0.05 }}
            >
              <div className="aspect-video animate-pulse bg-gradient-to-r from-[#f0ecec] to-[#e8e0e8]" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-24 animate-pulse rounded bg-gradient-to-r from-[#f0ecec] to-[#e8e0e8]" />
                <div className="h-5 w-full animate-pulse rounded bg-gradient-to-r from-[#f0ecec] to-[#e8e0e8]" />
                <div className="h-2 w-full animate-pulse rounded bg-gradient-to-r from-[#f0ecec] to-[#e8e0e8]" />
                <div className="mt-4 h-10 w-full animate-pulse rounded bg-gradient-to-r from-[#f0ecec] to-[#e8e0e8]" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    );
  }

  const recentCourses = courses?.slice(0, 4) ?? [];

  if (!recentCourses.length) {
    return (
      <motion.section
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold">Recent Courses</h2>

        <motion.div
          className="lp-clay-card lp-clay-white flex flex-col items-center justify-center rounded-3xl border border-dashed p-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h3 className="text-xl font-semibold">No recent courses</h3>

          <p className="mt-2 text-muted-foreground">
            Imported courses will appear here.
          </p>
        </motion.div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <h2 className="text-2xl font-bold">Recent Courses</h2>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {recentCourses.map((course, index) => (
          <RecentCourseCard
            key={course._id}
            course={course}
            index={index}
          />
        ))}
      </div>
    </motion.section>
  );
}
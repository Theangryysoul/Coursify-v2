"use client";

import Link from "next/link";
import { Flame, BookOpen, Clock3, Plus } from "lucide-react";

import { useAuthStore } from "@/store/auth.store";
import { useLearningStats } from "@/hooks/progress/useLearningStats";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../ui/avatar";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

export function DashboardHeader() {
  const user = useAuthStore((state) => state.user);

  const { data: stats } = useLearningStats();

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <motion.div
      className="lp-clay-card lp-clay-white rounded-3xl p-6 lg:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center lg:gap-8">
        <div className="flex min-w-0 items-start gap-4">
          <Avatar className="h-14 w-14 shrink-0 sm:h-16 sm:w-16">
            {user?.avatar?.url ? (
              <AvatarImage src={
                user?.avatar?.url
                  ? `${user.avatar.url}?t=${user.updatedAt}`
                  : undefined
              } />
            ) : (
              <AvatarFallback>
                {user?.name?.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="min-w-0">
            <h1 className="text-foreground text-2xl font-bold sm:text-3xl lg:text-4xl">
              {greeting},{" "}
              {user?.name ?? "Learner"} 👋
            </h1>

            <p className="text-muted-foreground mt-1">
              Ready to continue your learning journey?
            </p>

            <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
              <div className="lp-clay-card lp-clay-peach flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm sm:px-4 sm:py-2">
                <BookOpen className="h-4 w-4" style={{ color: "var(--lp-coral)" }} />
                <span className="font-medium">
                  {stats?.totalCourses ?? 0} Courses
                </span>
              </div>

              <div className="lp-clay-card lp-clay-butter flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm sm:px-4 sm:py-2">
                <Flame className="h-4 w-4" style={{ color: "var(--lp-coral)" }} />
                <span className="font-medium">
                  {stats?.streak ?? 0} Day Streak
                </span>
              </div>

              <div className="lp-clay-card lp-clay-mint flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm sm:px-4 sm:py-2">
                <Clock3 className="h-4 w-4" style={{ color: "var(--lp-mint)" }} />
                <span className="font-medium">
                  {stats?.formattedWatchTime ??
                    "0h 0m"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Button
          asChild
          size="lg"
          className="lp-clay-btn lp-clay-btn-primary w-full shrink-0 gap-2 px-6 text-base font-medium sm:w-auto"
        >
          <Link href="/import">
            <Plus className="h-5 w-5" />
            Import Course
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
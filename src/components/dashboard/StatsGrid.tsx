"use client";

import {
  BookOpen,
  Clock3,
  PlayCircle,
  Flame,
} from "lucide-react";

import { StatCard } from "./StatCard";
import { useLearningStats } from "@/hooks/progress/useLearningStats";
import Link from "next/link";
import { motion } from "framer-motion";

export function StatsGrid() {
  const { data, isPending } = useLearningStats();

  if (isPending) {
    return (
      <motion.div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="lp-clay-card lp-clay-white h-32 animate-pulse rounded-3xl"
          />
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
      initial="hidden"
      animate="show"
      variants={{
        show: {
          transition: { staggerChildren: 0.08 },
        },
      }}
    >
      <Link href="/courses" className="block">
        <StatCard
          title="Courses"
          value={String(data?.totalCourses ?? 0)}
          icon={BookOpen}
          color="peach"
        />
      </Link>

      <StatCard
        title="Videos Completed"
        value={String(data?.completedVideos ?? 0)}
        icon={PlayCircle}
        color="lilac"
      />

      <StatCard
        title="Watch Time"
        value={data?.formattedWatchTime ?? "0h 0m"}
        icon={Clock3}
        color="mint"
      />

      <StatCard
        title="Streak"
        value={`${data?.streak ?? 0} 🔥`}
        icon={Flame}
        color="butter"
      />
    </motion.div>
  );
}
"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface CourseHeaderProps {
  title: string;
  progress: {
    percentage: number;
    watchedDuration: number;
    totalDuration: number;
  };
  duration: string;
}

export function CourseHeader({
  title,
  progress,
  duration,
}: CourseHeaderProps) {
  return (
    <motion.div
      className="lp-clay-card lp-clay-white rounded-3xl p-6 lg:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Button
        asChild
        variant="ghost"
        className="w-fit mb-4"
      >
        <Link href="/courses">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {title}
        </h1>

        <div className="mt-2 flex items-center gap-4 text-muted-foreground">
          <span className="lp-clay-card lp-clay-peach px-3 py-1 rounded-full text-sm font-medium">
            {progress.percentage}% Completed
          </span>
          <span>•</span>
          <span className="lp-clay-card lp-clay-mint px-3 py-1 rounded-full text-sm font-medium">
            {duration}
          </span>
        </div>

        <Progress value={progress.percentage} className="mt-4 h-3" />
      </div>
    </motion.div>
  );
}
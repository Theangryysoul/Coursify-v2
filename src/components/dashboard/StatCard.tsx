"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color?: "peach" | "lilac" | "mint" | "butter";
}

const COLOR_MAP = {
  peach: "lp-clay-peach",
  lilac: "lp-clay-lilac",
  mint: "lp-clay-mint",
  butter: "lp-clay-butter",
};

const ICON_COLOR_MAP = {
  peach: "var(--lp-coral)",
  lilac: "var(--lp-lavender)",
  mint: "var(--lp-mint)",
  butter: "var(--lp-coral)",
};

export function StatCard({ title, value, icon: Icon, color = "peach" }: StatCardProps) {
  return (
    <motion.div
      className={`lp-clay-card ${COLOR_MAP[color]} h-full p-6`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="lp-clay-icon">
        <Icon className="h-6 w-6" style={{ color: ICON_COLOR_MAP[color] }} />
      </div>

      <p className="text-muted-foreground text-sm mt-4">{title}</p>

      <h2 className="mt-2 text-3xl font-bold text-foreground">{value}</h2>
    </motion.div>
  );
}
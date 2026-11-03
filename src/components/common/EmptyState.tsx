"use client";

import { motion } from "framer-motion";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      className="lp-clay-card lp-clay-white flex flex-col items-center justify-center rounded-3xl border border-dashed p-10 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {icon && (
        <div className="lp-clay-icon lp-clay-peach mb-5">
          {icon}
        </div>
      )}

      <h2 className="text-xl font-semibold text-foreground">{title}</h2>

      <p className="text-muted-foreground mt-2">{description}</p>

      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  message: string;
}

export function ErrorState({
  message,
}: ErrorStateProps) {
  return (
    <motion.div
      className="lp-clay-card lp-clay-peach rounded-3xl p-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="lp-clay-icon lp-clay-peach mb-4 mx-auto">
        <AlertCircle className="h-6 w-6" style={{ color: "var(--lp-coral)" }} />
      </div>

      <p className="text-[var(--lp-coral)] font-medium">{message}</p>
    </motion.div>
  );
}
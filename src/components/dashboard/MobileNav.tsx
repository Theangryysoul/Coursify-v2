"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Logo } from "@/components/common/Logo";

import { SIDEBAR_ITEMS } from "./sidebar-items";
import { SidebarItem } from "./SidebarItem";

/**
 * The sidebar, as a slide-in drawer.
 *
 * The desktop sidebar is hidden below `lg`, which used to leave small screens
 * with no way to navigate at all. This is that missing navigation.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          className="lp-clay-btn lp-clay-btn-secondary size-10 rounded-xl p-0"
        >
          {open ? (
            <X className="h-5 w-5" style={{ color: "var(--lp-coral)" }} />
          ) : (
            <Menu className="h-5 w-5" style={{ color: "var(--lp-ink)" }} />
          )}
        </button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[17rem] gap-0 border-r border-white/50 bg-white/75 p-0 backdrop-blur-2xl dark:border-white/10 dark:bg-[#181818]/90"
      >
        <SheetHeader className="border-b border-white/50 p-5 dark:border-white/10">
          <SheetTitle asChild>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center"
            >
              <Logo className="h-9 w-auto" />
              <span className="sr-only">Coursify</span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {SIDEBAR_ITEMS.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <SidebarItem
                {...item}
                onNavigate={() => setOpen(false)}
              />
            </motion.div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
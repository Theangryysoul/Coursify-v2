"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { SIDEBAR_ITEMS } from "./sidebar-items";
import { SidebarItem } from "./SidebarItem";

import { Logo } from "@/components/common/Logo";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "coursify:sidebar-collapsed";
const STORAGE_EVENT = "coursify:sidebar-collapsed-change";

// Fallback used when storage is unavailable (private mode, blocked cookies).
let memoryCollapsed = false;

const subscribe = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  window.addEventListener(STORAGE_EVENT, onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(STORAGE_EVENT, onChange);
  };
};

const getSnapshot = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    return stored === null ? memoryCollapsed : stored === "1";
  } catch {
    return memoryCollapsed;
  }
};

// The server cannot know the preference, so it renders the expanded sidebar
// and React swaps in the stored value right after hydration.
const getServerSnapshot = () => false;

const setCollapsed = (next: boolean) => {
  memoryCollapsed = next;

  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  } catch {
    // The in-memory value still keeps the toggle working for this session.
  }

  window.dispatchEvent(new Event(STORAGE_EVENT));
};

export function Sidebar() {
  const collapsed = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  return (
    <motion.aside
      className={cn(
        "hidden h-screen shrink-0 border-r border-white/50 bg-white/35 backdrop-blur-2xl transition-[width] duration-300 ease-out dark:border-white/10 dark:bg-black/25 lg:sticky lg:top-0 lg:flex lg:flex-col",
        collapsed ? "w-20" : "w-72"
      )}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center border-b border-white/50 dark:border-white/10",
          collapsed ? "justify-center px-3 py-5" : "p-6"
        )}
      >
        <Link href="/dashboard" aria-label="Coursify dashboard">
          <Logo
            className={cn(
              "w-auto transition-opacity hover:opacity-80",
              collapsed ? "h-5" : "h-9"
            )}
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav
        className={cn("flex-1 space-y-2", collapsed ? "p-2.5" : "p-4")}
        aria-label="Main navigation"
      >
        {SIDEBAR_ITEMS.map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <SidebarItem {...item} collapsed={collapsed} />
          </motion.div>
        ))}
      </nav>

      {/* Collapse / expand */}
      <div
        className={cn(
          "border-t border-white/50 dark:border-white/10",
          collapsed ? "p-2.5" : "p-4"
        )}
      >
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/45 hover:text-foreground dark:hover:bg-white/5",
            collapsed && "justify-center"
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5 shrink-0" />
          ) : (
            <>
              <PanelLeftClose className="h-5 w-5 shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}

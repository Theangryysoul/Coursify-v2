"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface SidebarItemProps {
  href: string;
  title: string;
  icon: React.ElementType;
  /** Render icon-only when the sidebar is collapsed. */
  collapsed?: boolean;
  /** Called after a link is followed, so the mobile drawer can close itself. */
  onNavigate?: () => void;
}

export function SidebarItem({
  href,
  title,
  icon: Icon,
  collapsed = false,
  onNavigate,
}: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onNavigate}
      title={collapsed ? title : undefined}
      aria-label={collapsed ? title : undefined}
      className={cn(
        "flex items-center gap-3 rounded-xl border border-transparent py-3 text-sm font-medium transition-colors duration-200",
        collapsed ? "justify-center px-2" : "px-4",
        isActive
          ? "bg-gradient-to-r from-[var(--lp-coral-light)] to-[var(--lp-coral)] text-[var(--on-accent)] shadow-lg"
          : "text-muted-foreground hover:bg-white/45 hover:text-foreground dark:hover:bg-white/5"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span>{title}</span>}
    </Link>
  );
}

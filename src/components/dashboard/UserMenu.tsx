"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  User,
  Settings,
  LogOut,
} from "lucide-react";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth.store";
import { useLogout } from "@/hooks/auth/useLogout";

export function UserMenu() {
  const user = useAuthStore((state) => state.user);

  const logoutMutation = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open account menu"
          className="relative rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          <Avatar className="lp-clay-card lp-clay-white h-10 w-10 border-2" style={{ borderColor: "var(--lp-coral)" }}>
            {user?.avatar?.url ? (
              <AvatarImage
                src={
                  user?.avatar?.url
                    ? `${user.avatar.url}?t=${user.updatedAt}`
                    : undefined
                }
                alt={user.name}
              />
            ) : (
              <AvatarFallback className="text-foreground">
                {user?.name?.charAt(0).toUpperCase() ?? "U"}
              </AvatarFallback>
            )}
          </Avatar>

          <span
            className="
              absolute
              bottom-0
              right-0
              h-3
              w-3
              rounded-full
              border-2
              border-background
              bg-[var(--lp-mint)]
            "
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="lp-clay-card lp-clay-white w-[min(24rem,calc(100vw-2rem))] rounded-3xl p-3"
      >
        <DropdownMenuLabel className="py-3">
          <div className="flex flex-col gap-1">
            <span className="text-base font-semibold text-foreground">
              {user?.name}
            </span>

            <span className="text-sm text-muted-foreground">
              {user?.email}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="border-border/60" />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href="/profile"
              className="lp-clay-btn lp-clay-btn-ghost w-full justify-start rounded-xl px-3 py-3 text-base"
            >
              <User className="h-4 w-4" style={{ color: "var(--lp-coral)" }} />
              My Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/settings"
              className="lp-clay-btn lp-clay-btn-ghost w-full justify-start rounded-xl px-3 py-3 text-base"
            >
              <Settings className="h-4 w-4" style={{ color: "var(--lp-lavender)" }} />
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="border-border/60" />

        <DropdownMenuItem
          className="lp-clay-btn lp-clay-btn-ghost w-full justify-start rounded-xl px-3 py-3 text-base text-[var(--lp-coral)] hover:bg-[var(--lp-peach-bg)]"
          disabled={logoutMutation.isPending}
          onSelect={() => logoutMutation.mutate()}
        >
          <LogOut className="mr-3 h-4 w-4" style={{ color: "var(--lp-coral)" }} />
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Check, LogOut, Monitor, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuthStore } from "@/store/auth.store";
import { useChangePassword } from "@/hooks/auth/useChangePassword";
import { useLogout } from "@/hooks/auth/useLogout";
import {
  changePasswordSchema,
  type ChangePasswordSchema,
} from "@/lib/validations/password.schema";
import { getErrorMessage } from "@/utils/get-error-message";
import { cn } from "@/lib/utils";

/**
 * Every card on this page shares the same shell, the same header rhythm and
 * the same field spacing, so nothing on the page looks hand-placed.
 */
function SettingsSection({
  title,
  description,
  delay = 0,
  children,
  footer,
}: {
  title: string;
  description: string;
  delay?: number;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <motion.section
      className="lp-clay-card lp-clay-white rounded-3xl p-5 sm:p-7"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <header className="border-b border-border/50 pb-4">
        <h2 className="text-foreground text-lg font-bold tracking-[-0.02em]">
          {title}
        </h2>

        <p className="text-muted-foreground mt-1 text-sm leading-6">
          {description}
        </p>
      </header>

      <div className="pt-5">{children}</div>

      {footer && (
        <div className="mt-6 flex justify-end border-t border-border/50 pt-5">
          {footer}
        </div>
      )}
    </motion.section>
  );
}

/** Label above control, with the same gap everywhere on the page. */
function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <Label
          htmlFor={htmlFor}
          className="text-foreground text-sm font-semibold"
        >
          {label}
        </Label>

        {hint && (
          <span className="text-muted-foreground text-xs">{hint}</span>
        )}
      </div>

      {children}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <motion.div
      className="mx-auto max-w-2xl space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <header>
        <h1 className="text-foreground text-3xl font-black tracking-[-0.035em] sm:text-4xl">
          Settings
        </h1>

        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Manage your account and preferences.
        </p>
      </header>

      <AccountSection />
      <PasswordSection />
      <AppearanceSection />
      <SessionSection />
    </motion.div>
  );
}

function AccountSection() {
  const user = useAuthStore((state) => state.user);

  return (
    <SettingsSection
      title="Account"
      description="This is the email you sign in with."
      delay={0.05}
    >
      <div className="space-y-5">
        <Field label="Name" htmlFor="account-name" hint="Read only">
          <Input
            id="account-name"
            className="lp-clay-input text-muted-foreground cursor-default"
            value={user?.name ?? ""}
            readOnly
          />
        </Field>

        <Field label="Email" htmlFor="account-email" hint="Read only">
          <Input
            id="account-email"
            className="lp-clay-input text-muted-foreground cursor-default"
            value={user?.email ?? ""}
            readOnly
          />
        </Field>
      </div>
    </SettingsSection>
  );
}

function PasswordSection() {
  const changePasswordMutation = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ChangePasswordSchema) => {
    changePasswordMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Password changed successfully");
        reset();
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  return (
    <SettingsSection
      title="Password"
      description="Use at least 8 characters."
      delay={0.1}
      footer={
        <Button
          type="submit"
          form="change-password-form"
          className="lp-clay-btn lp-clay-btn-primary px-5"
          disabled={changePasswordMutation.isPending}
        >
          {changePasswordMutation.isPending
            ? "Updating..."
            : "Update password"}
        </Button>
      }
    >
      <form
        id="change-password-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <Field label="Current password" htmlFor="currentPassword">
          <Input
            id="currentPassword"
            className="lp-clay-input"
            type="password"
            autoComplete="current-password"
            {...register("currentPassword")}
          />

          {errors.currentPassword && (
            <p className="text-destructive text-sm">
              {errors.currentPassword.message}
            </p>
          )}
        </Field>

        <Field label="New password" htmlFor="newPassword">
          <Input
            id="newPassword"
            className="lp-clay-input"
            type="password"
            autoComplete="new-password"
            {...register("newPassword")}
          />

          {errors.newPassword && (
            <p className="text-destructive text-sm">
              {errors.newPassword.message}
            </p>
          )}
        </Field>

        <Field label="Confirm new password" htmlFor="confirmPassword">
          <Input
            id="confirmPassword"
            className="lp-clay-input"
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword")}
          />

          {errors.confirmPassword && (
            <p className="text-destructive text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </Field>
      </form>
    </SettingsSection>
  );
}

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

function AppearanceSection() {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // next-themes cannot resolve the active theme until after hydration, so
    // this one synchronous flag is exactly what the server/client split needs.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <SettingsSection
      title="Appearance"
      description="Choose how Coursify looks on this device."
      delay={0.15}
    >
      <div className="grid gap-2.5 sm:grid-cols-3">
        {THEMES.map(({ value, label, icon: Icon }) => {
          const isActive = mounted && theme === value;

          return (
            <button
              key={value}
              type="button"
              aria-pressed={isActive}
              onClick={() => setTheme(value)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors",
                isActive
                  ? "border-transparent bg-gradient-to-r from-[var(--lp-coral-light)] to-[var(--lp-coral)] text-[var(--on-accent)] shadow-lg"
                  : "border-border/60 bg-white/40 text-muted-foreground hover:text-foreground dark:bg-white/5"
              )}
            >
              <Icon className="h-4 w-4" />

              {label}

              {isActive && <Check className="h-4 w-4" />}
            </button>
          );
        })}
      </div>
    </SettingsSection>
  );
}

function SessionSection() {
  const logoutMutation = useLogout();

  return (
    <SettingsSection
      title="Session"
      description="Sign out of Coursify on this device."
      delay={0.2}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-sm leading-6">
          You will need to sign in again to reach your library.
        </p>

        <Button
          type="button"
          className="lp-clay-btn lp-clay-btn-primary shrink-0 gap-2 bg-destructive hover:bg-destructive/85"
          disabled={logoutMutation.isPending}
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="h-4 w-4" />
          {logoutMutation.isPending ? "Logging out..." : "Log out"}
        </Button>
      </div>
    </SettingsSection>
  );
}

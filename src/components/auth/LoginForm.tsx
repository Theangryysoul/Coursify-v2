"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useLogin } from "@/hooks/auth/useLogin";
import { loginSchema, type LoginSchema } from "@/lib/validations/auth.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { ROUTES } from "@/constants/routes";

import { getErrorMessage } from "@/utils/get-error-message";

export function LoginForm() {
  const router = useRouter();

  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginSchema) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Login successful");

        router.replace(ROUTES.DASHBOARD);
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-foreground" htmlFor="email">
          Email
        </Label>

        <Input
          className="lp-clay-input"
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Enter your email"
          {...register("email")}
        />

        {errors.email && (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-foreground" htmlFor="password">
          Password
        </Label>

        <Input
          className="lp-clay-input"
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          {...register("password")}
        />

        {errors.password && (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="lp-clay-btn lp-clay-btn-primary w-full"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Signing in..." : "Login"}
      </Button>

      <GoogleSignInButton />

      <p className="text-muted-foreground text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href={ROUTES.REGISTER}
          className="font-semibold text-[var(--lp-coral)] transition-colors hover:underline"
        >
          Register
        </Link>
      </p>
    </form>
  );
}
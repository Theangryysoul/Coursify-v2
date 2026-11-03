"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  registerSchema,
  type RegisterSchema,
} from "@/lib/validations/auth.schema";

import { useRegister } from "@/hooks/auth/useRegister";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

import { ROUTES } from "@/constants/routes";
import { getErrorMessage } from "@/utils/get-error-message";

export function RegisterForm() {
  const router = useRouter();

  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: RegisterSchema) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Account created successfully");
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
        <Label className="text-sm font-semibold text-foreground" htmlFor="name">
          Name
        </Label>

        <Input
          className="lp-clay-input"
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Enter your name"
          {...register("name")}
        />

        {errors.name && (
          <p className="text-destructive text-sm">{errors.name.message}</p>
        )}
      </div>

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
          autoComplete="new-password"
          placeholder="Choose a password"
          {...register("password")}
        />

        {errors.password && (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="lp-clay-btn lp-clay-btn-primary w-full"
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending
          ? "Creating account..."
          : "Create Account"}
      </Button>

      <GoogleSignInButton />

      <p className="text-muted-foreground text-center text-sm">
        Already have an account?{" "}
        <Link
          href={ROUTES.LOGIN}
          className="font-semibold text-[var(--lp-coral)] transition-colors hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  );
}
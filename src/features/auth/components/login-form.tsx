"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Loader2Icon } from "lucide-react";

import { Link } from "@/lib/i18n/navigation";
import { routes } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createLoginSchema, type LoginValues } from "../schemas";
import { useLogin } from "../hooks";

export function LoginForm() {
  const t = useTranslations("auth");
  const tv = useTranslations("auth.validation");
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(createLoginSchema(tv)),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = handleSubmit((values) => {
    login.mutate(values);
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">{t("password")}</Label>
          <Link
            href={routes.forgotPassword}
            className="text-muted-foreground hover:text-foreground text-xs"
          >
            {t("forgotPassword")}
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        ) : null}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="accent-primary size-4 rounded"
          {...register("rememberMe")}
        />
        {t("rememberMe")}
      </label>

      <Button type="submit" className="mt-2" disabled={login.isPending}>
        {login.isPending ? (
          <Loader2Icon className="size-4 animate-spin" />
        ) : null}
        {t("loginCta")}
      </Button>
    </form>
  );
}

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
import { EmailIcon, PasswordIcon } from "@/components/icons";
import {
  PasswordToggle,
  usePasswordToggle,
} from "@/components/molecules/password-toggle";
import { createLoginSchema, type LoginValues } from "../schemas";
import { useLogin } from "../hooks";

export function LoginForm() {
  const t = useTranslations("auth");
  const tv = useTranslations("auth.validation");
  const login = useLogin();
  const pw = usePasswordToggle();

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
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-6" noValidate>
      <div className="flex flex-col gap-3">
        <Label htmlFor="email" className="w-full">
          {t("emailLabel")}
          <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          size="md"
          type="email"
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          startIcon={<EmailIcon />}
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="password" className="w-full">
          {t("passwordLabel")}
          <span className="text-destructive">*</span>
        </Label>
        <div className="relative w-full">
          <Input
            id="password"
            size="md"
            type={pw.type}
            autoComplete="current-password"
            placeholder={t("passwordPlaceholder")}
            startIcon={<PasswordIcon />}
            endIcon={<span className="size-4" />}
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          <PasswordToggle
            visible={pw.visible}
            onToggle={pw.toggle}
            className="pointer-events-auto absolute inset-y-0 end-0"
          />
        </div>
        {errors.password ? (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        ) : null}
        <Link
          href={routes.forgotPassword}
          className="w-full text-start text-sm text-secondary underline"
        >
          {t("forgotPasswordLink")}
        </Link>
      </div>

      <label className="sr-only flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="accent-primary size-4 rounded"
          {...register("rememberMe")}
        />
        {t("rememberMe")}
      </label>

      <Button
        type="submit"
        size="md"
        className="w-full"
        disabled={login.isPending}
      >
        {login.isPending ? (
          <Loader2Icon className="size-4 animate-spin" />
        ) : null}
        {t("loginCta")}
      </Button>
    </form>
  );
}

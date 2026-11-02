"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmailIcon } from "@/components/icons";
import {
  createForgotPasswordSchema,
  type ForgotPasswordValues,
} from "../schemas";

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const tv = useTranslations("auth.validation");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(createForgotPasswordSchema(tv)),
    defaultValues: { email: "" },
  });

  // No forgot-password endpoint exists in the auth API yet, so this is a
  // typed placeholder that does not fabricate a backend call. The handler is
  // typed via useForm<ForgotPasswordValues> and is intentionally a no-op
  // until a recovery endpoint is available.
  const onSubmit = handleSubmit(() => {});

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

      <Button type="submit" size="md" className="w-full">
        {t("forgotSubmit")}
      </Button>
    </form>
  );
}

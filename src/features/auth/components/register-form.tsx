"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Loader2Icon } from "lucide-react";

import { roleList } from "@/config/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";
import { createRegisterSchema, type RegisterValues } from "../schemas";
import { useRegister } from "../hooks";

export function RegisterForm() {
  const t = useTranslations("auth");
  const tv = useTranslations("auth.validation");
  const tr = useTranslations("auth.roles");
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(createRegisterSchema(tv)),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student",
    },
  });

  const onSubmit = handleSubmit((values) => {
    const { confirmPassword: _confirm, ...payload } = values;
    void _confirm;
    registerMutation.mutate(payload);
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="firstName">{t("firstName")}</Label>
          <Input
            id="firstName"
            autoComplete="given-name"
            aria-invalid={!!errors.firstName}
            {...register("firstName")}
          />
          {errors.firstName ? (
            <p className="text-destructive text-sm">
              {errors.firstName.message}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="lastName">{t("lastName")}</Label>
          <Input
            id="lastName"
            autoComplete="family-name"
            aria-invalid={!!errors.lastName}
            {...register("lastName")}
          />
          {errors.lastName ? (
            <p className="text-destructive text-sm">
              {errors.lastName.message}
            </p>
          ) : null}
        </div>
      </div>

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
        <Label htmlFor="role">{t("role")}</Label>
        <select
          id="role"
          className={cn(
            "border-input bg-transparent h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          )}
          aria-invalid={!!errors.role}
          {...register("role")}
        >
          {roleList.map((role) => (
            <option key={role} value={role}>
              {tr(role)}
            </option>
          ))}
        </select>
        {errors.role ? (
          <p className="text-destructive text-sm">{errors.role.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">{t("password")}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword ? (
          <p className="text-destructive text-sm">
            {errors.confirmPassword.message}
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        className="mt-2"
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? (
          <Loader2Icon className="size-4 animate-spin" />
        ) : null}
        {t("registerCta")}
      </Button>
    </form>
  );
}

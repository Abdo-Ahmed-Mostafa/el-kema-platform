"use client";

import * as React from "react";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Loader2Icon } from "lucide-react";

import { useAppForm } from "@/hooks";
import type { Role } from "@/config/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectableCardGroup } from "@/components/molecules/selectable-card";
import {
  CardIdIcon,
  ParentIcon,
  PersonIcon,
  PhoneIcon,
  StudentIcon,
  TeacherIcon,
} from "@/components/icons";
import { createRegisterSchema, type RegisterValues } from "../schemas";
import { useRegister } from "../hooks";
import { useNumericField } from "./use-numeric-field";

/** Role cards in Figma display order (Student / Parent / Teacher). */
const roleOrder: Role[] = ["student", "parent", "teacher"];

const roleIcon: Record<Role, React.ReactNode> = {
  student: <StudentIcon className="size-7" />,
  parent: <ParentIcon className="size-7" />,
  teacher: <TeacherIcon className="size-7" />,
};

/** Fields validated before advancing from step 1 (identity) to step 2 (role). */
const step1Fields = [
  "firstName",
  "secondName",
  "thirdName",
  "lastName",
  "phone",
  "nationalId",
] as const;

export function RegisterForm() {
  const t = useTranslations("auth");
  const tv = useTranslations("auth.validation");
  const tr = useTranslations("auth.roles");
  const trd = useTranslations("auth.roleDescriptions");
  const registerMutation = useRegister();

  const [step, setStep] = React.useState<1 | 2>(1);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    setValue,
    formState: { errors },
  } = useAppForm<RegisterValues>({
    resolver: zodResolver(createRegisterSchema(tv)),
    defaultValues: {
      firstName: "",
      secondName: "",
      thirdName: "",
      lastName: "",
      phone: "",
      nationalId: "",
      role: "student",
    },
  });

  const onSubmit = handleSubmit((values) => {
    registerMutation.mutate(values);
  });

  // Phone (11 digits) and national id (14 digits) accept digits only, enforced
  // as the user types and on paste — not just on submit.
  const phoneNumeric = useNumericField<RegisterValues>("phone", setValue, 11);
  const nationalIdNumeric = useNumericField<RegisterValues>(
    "nationalId",
    setValue,
    14,
  );

  const goToStep2 = async () => {
    const valid = await trigger([...step1Fields]);
    if (valid) setStep(2);
  };

  const roleOptions = roleOrder.map((role) => ({
    value: role,
    heading: tr(role),
    subheading: trd(role),
    icon: roleIcon[role],
  }));

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-6" noValidate>
      {step === 1 ? (
        <>
          <div className="flex gap-6">
            <div className="flex flex-1 flex-col gap-3">
              <Label htmlFor="firstName" className="w-full">
                {t("firstNameLabel")}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                size="md"
                autoComplete="given-name"
                placeholder={t("firstNamePlaceholder")}
                startIcon={<PersonIcon />}
                aria-invalid={!!errors.firstName}
                {...register("firstName")}
              />
              {errors.firstName ? (
                <p className="text-destructive text-sm">
                  {errors.firstName.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-1 flex-col gap-3">
              <Label htmlFor="secondName" className="w-full">
                {t("secondNameLabel")}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="secondName"
                size="md"
                autoComplete="additional-name"
                placeholder={t("secondNamePlaceholder")}
                startIcon={<PersonIcon />}
                aria-invalid={!!errors.secondName}
                {...register("secondName")}
              />
              {errors.secondName ? (
                <p className="text-destructive text-sm">
                  {errors.secondName.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-1 flex-col gap-3">
              <Label htmlFor="thirdName" className="w-full">
                {t("thirdNameLabel")}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="thirdName"
                size="md"
                placeholder={t("thirdNamePlaceholder")}
                startIcon={<PersonIcon />}
                aria-invalid={!!errors.thirdName}
                {...register("thirdName")}
              />
              {errors.thirdName ? (
                <p className="text-destructive text-sm">
                  {errors.thirdName.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-1 flex-col gap-3">
              <Label htmlFor="lastName" className="w-full">
                {t("lastNameLabel")}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lastName"
                size="md"
                autoComplete="family-name"
                placeholder={t("lastNamePlaceholder")}
                startIcon={<PersonIcon />}
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

          <div className="flex flex-col gap-3">
            <Label htmlFor="phone" className="w-full">
              {t("phoneLabel")}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              size="md"
              type="tel"
              autoComplete="tel"
              placeholder={t("phonePlaceholder")}
              startIcon={<PhoneIcon />}
              aria-invalid={!!errors.phone}
              {...register("phone")}
              {...phoneNumeric}
            />
            {errors.phone ? (
              <p className="text-destructive text-sm">{errors.phone.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="nationalId" className="w-full">
              {t("nationalIdLabel")}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nationalId"
              size="md"
              placeholder={t("nationalIdPlaceholder")}
              startIcon={<CardIdIcon />}
              aria-invalid={!!errors.nationalId}
              {...register("nationalId")}
              {...nationalIdNumeric}
            />
            {errors.nationalId ? (
              <p className="text-destructive text-sm">
                {errors.nationalId.message}
              </p>
            ) : null}
          </div>

          <Button
            type="button"
            size="md"
            className="w-full"
            onClick={goToStep2}
          >
            {t("nextButton")}
          </Button>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            <Label className="w-full">
              {t("roleGroupLabel")}
              <span className="text-destructive">*</span>
            </Label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <SelectableCardGroup
                  label={t("roleGroupLabel")}
                  options={roleOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  className="w-full gap-4"
                />
              )}
            />
            {errors.role ? (
              <p className="text-destructive text-sm">{errors.role.message}</p>
            ) : null}
          </div>

          <div className="flex items-start gap-3">
            <Button
              type="button"
              variant="secondary"
              appearance="outline"
              size="md"
              className="flex-1"
              onClick={() => setStep(1)}
            >
              {t("backButton")}
            </Button>
            <Button
              type="submit"
              size="md"
              className="flex-1"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : null}
              {t("nextButton")}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}

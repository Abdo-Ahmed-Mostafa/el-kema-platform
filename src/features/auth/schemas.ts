import { z } from "zod";

import { roleList, type Role } from "@/config/roles";

/**
 * A translator function compatible with next-intl's `useTranslations`.
 * We build schemas from a translator so validation messages are localized
 * (ar/en) at the call site rather than hardcoded.
 */
type Translator = (key: string) => string;

/** Login form schema. */
export function createLoginSchema(t: Translator) {
  return z.object({
    email: z.string().min(1, t("emailRequired")).email(t("emailInvalid")),
    password: z.string().min(1, t("passwordRequired")),
    rememberMe: z.boolean(),
  });
}

/** Registration form schema with role selection and password confirmation. */
export function createRegisterSchema(t: Translator) {
  return z
    .object({
      firstName: z.string().min(1, t("firstNameRequired")),
      lastName: z.string().min(1, t("lastNameRequired")),
      email: z.string().min(1, t("emailRequired")).email(t("emailInvalid")),
      password: z.string().min(8, t("passwordMin")),
      confirmPassword: z.string().min(1, t("passwordRequired")),
      role: z.enum(roleList as [Role, ...Role[]], {
        message: t("roleRequired"),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordMismatch"),
      path: ["confirmPassword"],
    });
}

export type LoginSchema = ReturnType<typeof createLoginSchema>;
export type RegisterSchema = ReturnType<typeof createRegisterSchema>;

export type LoginValues = z.infer<LoginSchema>;
export type RegisterValues = z.infer<RegisterSchema>;

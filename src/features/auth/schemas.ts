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

/**
 * Registration form schema — matches the Figma general sign-up flow
 * (nodes 89:4922 + 221:1217): four Arabic name parts, Egyptian mobile and
 * national-id, and a role selection. There is no email/password on these
 * screens, so none is collected here.
 */
export function createRegisterSchema(t: Translator) {
  return z.object({
    firstName: z.string().min(1, t("firstNameRequired")),
    secondName: z.string().min(1, t("secondNameRequired")),
    thirdName: z.string().min(1, t("thirdNameRequired")),
    lastName: z.string().min(1, t("lastNameRequired")),
    // Egyptian mobile: 11 digits starting 01 (optionally +20 / 0020 prefix).
    phone: z
      .string()
      .min(1, t("phoneRequired"))
      .regex(/^(?:\+20|0020|0)?1[0125]\d{8}$/, t("phoneInvalid")),
    // Egyptian national id: exactly 14 digits.
    nationalId: z
      .string()
      .min(1, t("nationalIdRequired"))
      .regex(/^\d{14}$/, t("nationalIdInvalid")),
    role: z.enum(roleList as [Role, ...Role[]], {
      message: t("roleRequired"),
    }),
  });
}

/**
 * Forgot-password form schema — a single email field, reusing the same
 * emailRequired/emailInvalid validation messages as login.
 */
export function createForgotPasswordSchema(t: Translator) {
  return z.object({
    email: z.string().min(1, t("emailRequired")).email(t("emailInvalid")),
  });
}

export type LoginSchema = ReturnType<typeof createLoginSchema>;
export type RegisterSchema = ReturnType<typeof createRegisterSchema>;
export type ForgotPasswordSchema = ReturnType<
  typeof createForgotPasswordSchema
>;

export type LoginValues = z.infer<LoginSchema>;
export type RegisterValues = z.infer<RegisterSchema>;
export type ForgotPasswordValues = z.infer<ForgotPasswordSchema>;

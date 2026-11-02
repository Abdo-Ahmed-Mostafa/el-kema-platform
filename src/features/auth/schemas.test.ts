import { describe, it, expect } from "vitest";

import {
  createLoginSchema,
  createRegisterSchema,
  createForgotPasswordSchema,
} from "./schemas";

// Identity translator: returns the message key so we can assert which rule fired.
const t = (key: string) => key;

describe("login schema", () => {
  const schema = createLoginSchema(t);

  it("accepts valid credentials", () => {
    const result = schema.safeParse({
      email: "user@example.com",
      password: "secret",
      rememberMe: false,
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = schema.safeParse({
      email: "not-an-email",
      password: "secret",
      rememberMe: false,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty password", () => {
    const result = schema.safeParse({
      email: "user@example.com",
      password: "",
      rememberMe: false,
    });
    expect(result.success).toBe(false);
  });
});

describe("register schema", () => {
  const schema = createRegisterSchema(t);

  const base = {
    firstName: "Sara",
    secondName: "Ahmed",
    thirdName: "Mahmoud",
    lastName: "Hassan",
    phone: "01012345678",
    nationalId: "29801011234567",
    role: "student" as const,
  };

  it("accepts a valid registration", () => {
    expect(schema.safeParse(base).success).toBe(true);
  });

  it("requires every name part", () => {
    expect(schema.safeParse({ ...base, secondName: "" }).success).toBe(false);
    expect(schema.safeParse({ ...base, thirdName: "" }).success).toBe(false);
  });

  it("rejects an invalid mobile number", () => {
    expect(schema.safeParse({ ...base, phone: "12345" }).success).toBe(false);
  });

  it("accepts a plain 11-digit Egyptian mobile (01xxxxxxxxx)", () => {
    expect(schema.safeParse({ ...base, phone: "01234567890" }).success).toBe(
      true,
    );
  });

  it("rejects a +20 / country-prefixed mobile (digits-only, no prefix)", () => {
    expect(schema.safeParse({ ...base, phone: "+201012345678" }).success).toBe(
      false,
    );
    expect(schema.safeParse({ ...base, phone: "00201012345678" }).success).toBe(
      false,
    );
  });

  it("rejects a mobile with the wrong operator digit", () => {
    expect(schema.safeParse({ ...base, phone: "01312345678" }).success).toBe(
      false,
    );
  });

  it("rejects a national id that is not 14 digits", () => {
    expect(schema.safeParse({ ...base, nationalId: "123" }).success).toBe(
      false,
    );
  });

  it("rejects an unknown role", () => {
    const result = schema.safeParse({ ...base, role: "admin" });
    expect(result.success).toBe(false);
  });
});

describe("forgot-password schema", () => {
  const schema = createForgotPasswordSchema(t);

  it("accepts a valid email", () => {
    expect(schema.safeParse({ email: "user@example.com" }).success).toBe(true);
  });

  it("rejects an empty email", () => {
    expect(schema.safeParse({ email: "" }).success).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(schema.safeParse({ email: "not-an-email" }).success).toBe(false);
  });
});

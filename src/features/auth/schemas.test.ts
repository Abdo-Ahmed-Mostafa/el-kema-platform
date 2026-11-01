import { describe, it, expect } from "vitest";

import { createLoginSchema, createRegisterSchema } from "./schemas";

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
    lastName: "Hassan",
    email: "sara@example.com",
    password: "password123",
    confirmPassword: "password123",
    role: "student" as const,
  };

  it("accepts a valid registration", () => {
    expect(schema.safeParse(base).success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = schema.safeParse({ ...base, confirmPassword: "different" });
    expect(result.success).toBe(false);
  });

  it("rejects a short password", () => {
    const result = schema.safeParse({
      ...base,
      password: "123",
      confirmPassword: "123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown role", () => {
    const result = schema.safeParse({ ...base, role: "admin" });
    expect(result.success).toBe(false);
  });
});

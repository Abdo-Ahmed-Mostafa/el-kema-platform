"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

/**
 * Decorative hero image for the auth split-screen. Each auth screen has its
 * own Figma illustration, so the image is chosen from the current pathname:
 * the sign-up / register flow uses `signup.png`, everything else (login,
 * forgot-password) uses `login`'s `hero.png`.
 *
 * Client component so it can read the active route via `usePathname`. The
 * `next-intl` locale prefix is part of the path, so we match on a path
 * segment rather than an exact string.
 */
export function AuthHero() {
  const pathname = usePathname();
  const isRegister = /(^|\/)register(\/|$)/.test(pathname);

  const src = isRegister ? "/auth/signup.png" : "/auth/hero.png";

  return (
    <Image
      src={src}
      alt=""
      fill
      priority
      sizes="628px"
      className="object-cover"
    />
  );
}

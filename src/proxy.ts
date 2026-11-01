import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { routing } from "@/lib/i18n/routing";
import { locales } from "@/config/locales";
import {
  protectedPrefixes,
  authPaths,
  localized,
  routes,
} from "@/config/routes";
import { storageKeys } from "@/config/storage-keys";

/**
 * Proxy (formerly "middleware" before Next.js 16).
 *
 * Two responsibilities, composed:
 * 1. next-intl locale detection + redirect (always runs).
 * 2. An *optimistic* auth guard based on a presence cookie:
 *    - Unauthenticated users hitting a protected prefix are sent to /login.
 *    - Authenticated users hitting an auth page are sent to their dashboard.
 *
 * The guard is optimistic: it only checks for the presence of the access-token
 * cookie, not its validity. Real authorization happens server-side on the API.
 * The cookie is a UX shortcut to avoid flashing protected UI.
 */
const intlMiddleware = createMiddleware(routing);

/** Strip a leading `/<locale>` segment so we can match locale-agnostic paths. */
function stripLocale(pathname: string): string {
  const segments = pathname.split("/");
  // segments[0] is "" (leading slash), segments[1] may be a locale.
  if (segments.length > 1 && locales.includes(segments[1] as never)) {
    const rest = "/" + segments.slice(2).join("/");
    return rest === "/" ? "/" : rest.replace(/\/$/, "");
  }
  return pathname;
}

/** The active locale from the path, defaulting to the configured default. */
function localeFromPath(pathname: string): string {
  const seg = pathname.split("/")[1];
  return locales.includes(seg as never) ? seg : routing.defaultLocale;
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const path = stripLocale(pathname);
  const locale = localeFromPath(pathname);
  const hasSession = request.cookies.has(storageKeys.accessToken);

  const isProtected = protectedPrefixes.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
  const isAuthPage = authPaths.some((p) => path === p);

  // Unauthenticated → block protected areas.
  if (isProtected && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = localized(routes.login, locale);
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  // Authenticated → keep away from auth pages.
  if (isAuthPage && hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = localized(routes.home, locale);
    return NextResponse.redirect(url);
  }

  // Otherwise defer to next-intl for locale handling.
  return intlMiddleware(request);
}

export const config = {
  /**
   * Match all pathnames except:
   * - API routes (`/api`)
   * - Next.js internals (`/_next`, `/_vercel`)
   * - static files (anything containing a dot, e.g. `favicon.ico`)
   */
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

"use client";

import { useEffect } from "react";

/**
 * Last-resort error boundary. Replaces the root layout when it (or something
 * above the locale tree) throws, so it must render its own <html>/<body> and
 * cannot use app context (i18n, theme). Text is intentionally static English —
 * this only shows on catastrophic failures.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          background: "#fff",
          color: "#171717",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: 420 }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
            Application error
          </h1>
          <p style={{ color: "#666", marginTop: "0.5rem" }}>
            A critical error occurred. Please reload the page.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              padding: "0.5rem 1.25rem",
              borderRadius: "9999px",
              border: "none",
              background: "#171717",
              color: "#fff",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}

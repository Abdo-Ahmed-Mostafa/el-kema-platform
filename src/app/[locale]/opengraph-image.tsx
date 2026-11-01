import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

/**
 * Default Open Graph / social share image (1200×630), generated at build time.
 * Applies to every page under `[locale]` that doesn't set its own OG image.
 */
export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        background: "linear-gradient(135deg, #0f766e 0%, #134e4a 100%)",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 140,
          height: 140,
          borderRadius: 32,
          background: "rgba(255,255,255,0.15)",
          fontSize: 72,
          fontWeight: 800,
        }}
      >
        EK
      </div>
      <div style={{ fontSize: 72, fontWeight: 800 }}>{siteConfig.name}</div>
      <div
        style={{
          fontSize: 30,
          opacity: 0.85,
          maxWidth: 760,
          textAlign: "center",
        }}
      >
        {siteConfig.description}
      </div>
    </div>,
    size,
  );
}

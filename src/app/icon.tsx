import { ImageResponse } from "next/og";

/**
 * Generated app icon (favicon / PWA icon). Rendered by Next at build time via
 * ImageResponse, so there's no binary asset to maintain. The "EK" wordmark on
 * the brand teal matches the in-app Logo.
 */
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f766e",
        color: "#ffffff",
        fontSize: 260,
        fontWeight: 800,
        borderRadius: 96,
      }}
    >
      EK
    </div>,
    size,
  );
}

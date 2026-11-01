import { ImageResponse } from "next/og";

/** Generated Apple touch icon (180×180). */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        fontSize: 92,
        fontWeight: 800,
      }}
    >
      EK
    </div>,
    size,
  );
}

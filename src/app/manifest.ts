import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/**
 * PWA web app manifest. Served at `/manifest.webmanifest`. Icons point at the
 * generated `icon` route. Static — cached by default under Cache Components.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f766e",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}

import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Unmount React trees and clear the DOM after every test to keep them isolated.
afterEach(() => {
  cleanup();
});

// jsdom doesn't implement matchMedia; stub it so hooks/components that call it
// (e.g. useMediaQuery, next-themes) don't crash under test.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}

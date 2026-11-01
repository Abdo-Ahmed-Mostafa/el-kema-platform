import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names conditionally and resolve Tailwind conflicts.
 * The standard utility used by shadcn/ui and throughout the UI layer.
 *
 * @example cn("px-2", condition && "px-4") // -> "px-4"
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

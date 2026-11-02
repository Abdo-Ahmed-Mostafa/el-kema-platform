"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "@/components/icons";

type SearchButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "appearance" | "size" | "children"
>;

/**
 * SearchButton — a 48px icon button (Figma Search Default/Hover). Reuses the
 * Button atom's ghost styling and sizes it to size-12 to match Figma's 48px.
 * The accessible name comes from the i18n `search` key.
 */
function SearchButton({ className, ...props }: SearchButtonProps) {
  const t = useTranslations("molecules");

  return (
    <Button
      type="button"
      appearance="ghost"
      size="icon"
      data-slot="search-button"
      aria-label={t("search")}
      className={cn("size-12", className)}
      {...props}
    >
      <SearchIcon />
    </Button>
  );
}

type SearchBarProps = Omit<React.ComponentProps<typeof Input>, "size"> & {
  /**
   * Visual size from Figma: "lg" → 50px (Search Bar Large),
   * "sm" → 42px (Search Bar Small). Defaults to "lg".
   */
  size?: "lg" | "sm";
};

/**
 * SearchBar — reuses the Input atom with a leading SearchIcon (via its
 * `startIcon` slot, which already applies `ps-9` logical padding and the
 * hover tint). We only override the height to match Figma's 50/42 (the Input
 * atom's own `size` tops out at 46px). Placeholder comes from i18n.
 */
function SearchBar({
  className,
  placeholder,
  size = "lg",
  ...props
}: SearchBarProps) {
  const t = useTranslations("molecules");

  return (
    <Input
      type="search"
      data-slot="search-bar"
      startIcon={<SearchIcon />}
      placeholder={placeholder ?? t("searchPlaceholder")}
      // Figma Search Bar: Large 50px / Small 42px (sizes beyond the Input atom).
      className={cn(size === "sm" ? "h-[42px]" : "h-[50px]", className)}
      {...props}
    />
  );
}

export { SearchButton, SearchBar };

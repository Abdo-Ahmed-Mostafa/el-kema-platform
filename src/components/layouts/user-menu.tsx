"use client";

import { useTranslations } from "next-intl";
import { LogOutIcon, UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth, useLogout } from "@/features/auth";

/**
 * Avatar dropdown with the current user's identity and a logout action.
 * Reads the optimistic user from Redux; falls back gracefully when absent.
 */
export function UserMenu() {
  const t = useTranslations("nav");
  const { user } = useAuth();
  const logout = useLogout();

  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button appearance="ghost" size="icon" className="rounded-full">
          <Avatar>
            {user?.avatarUrl ? (
              <AvatarImage src={user.avatarUrl} alt="" />
            ) : null}
            <AvatarFallback>
              {initials || <UserIcon className="size-4" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {user ? (
          <>
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-muted-foreground text-xs font-normal">
                  {user.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        ) : null}
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => logout.mutate()}
        >
          <LogOutIcon className="size-4" />
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

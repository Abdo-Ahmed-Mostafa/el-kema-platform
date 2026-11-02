"use client";

import { useTranslations } from "next-intl";
import {
  BabyIcon,
  BookOpenIcon,
  LayoutDashboardIcon,
  UserIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";

import { Link, usePathname } from "@/lib/i18n/navigation";
import { dashboardNav, type DashboardNavItem } from "@/config/dashboard-nav";
import type { Role } from "@/config/roles";
import { cn } from "@/lib/utils/cn";
import { Logo } from "@/components/shared/logo";

const icons: Record<DashboardNavItem["iconName"], LucideIcon> = {
  "layout-dashboard": LayoutDashboardIcon,
  "book-open": BookOpenIcon,
  users: UsersIcon,
  user: UserIcon,
  baby: BabyIcon,
};

export function DashboardSidebar({ role }: { role: Role }) {
  const t = useTranslations("dashboard");
  const pathname = usePathname();
  const items = dashboardNav[role];

  return (
    <aside className="bg-sidebar text-sidebar-foreground hidden w-64 shrink-0 flex-col border-e md:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Logo />
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {items.map((item) => {
          const Icon = icons[item.iconName];
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              data-state={active ? "selected" : "default"}
              className={cn(
                "text-paragraph-md flex items-center gap-2 rounded-lg px-4 py-3 transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-5 shrink-0" />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

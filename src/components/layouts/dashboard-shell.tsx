import { type ReactNode } from "react";

import type { Role } from "@/config/roles";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardTopbar } from "./dashboard-topbar";

/**
 * Full dashboard chrome: role-aware sidebar + top bar around the page.
 * Each role's layout renders this with its own `role`.
 */
export function DashboardShell({
  role,
  children,
}: {
  role: Role;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-1">
      <DashboardSidebar role={role} />
      <div className="flex flex-1 flex-col">
        <DashboardTopbar />
        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

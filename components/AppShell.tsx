"use client";

import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import SideMenu from "./SideMenu";
import { useAuth } from "@/hooks/api/useAuth";
import { IconHamburger, IconHome, IconOrders, IconProducts, IconSettings, IconUsers } from "./core/Icon";

type AppShellProps = {
  children: React.ReactNode;
};



export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();

  const menuItems = useMemo(
    () => [
      {
        label: "Dashboard",
        href: "/",
        icon: <IconHome className="h-5 w-5" />,
      },
      {
        label: "Orders",
        href: "/orders",
        icon: <IconOrders className="h-5 w-5" />,
      },
      {
        label: "Products",
        href: "/products",
        icon: <IconProducts className="h-5 w-5" />,
      },
      {
        label: "Admin Users",
        href: "/users",
        icon: <IconUsers className="h-5 w-5" />,
      },
      {
        label: "Settings",
        href: "/settings",
        icon: <IconSettings className="h-5 w-5" />,
      },
    ],
    [],
  );

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
    } catch {
      // keep user on current page if logout fails
    }
  };

  const showShell = pathname !== "/login";

  if (!showShell) return <>{children}</>;

  return (
    <div className="h-dvh overflow-hidden bg-zinc-50 text-zinc-950">
      <div className="flex h-full">
        <SideMenu collapsed={collapsed} items={menuItems} />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur">
            <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCollapsed((v) => !v)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-4 focus:ring-zinc-950/10"
                  aria-label={collapsed ? "Expand menu" : "Collapse menu"}
                  title={collapsed ? "Expand menu" : "Collapse menu"}
                >
                  <IconHamburger
                    className={
                      "h-5 w-5 transition-transform duration-300 ease-in-out " +
                      (collapsed ? "rotate-0" : "rotate-90")
                    }
                  />
                </button>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={logout.isPending}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-4 focus:ring-zinc-950/10"
              >
                Logout
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

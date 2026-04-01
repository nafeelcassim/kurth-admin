"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

type SideMenuItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

type SideMenuProps = {
  collapsed: boolean;
  items: SideMenuItem[];
};

export default function SideMenu({ collapsed, items }: SideMenuProps) {
  const pathname = usePathname();

  return (
    <aside
      className={
        "h-dvh shrink-0 border-r border-zinc-200 bg-white shadow-sm transition-[width] duration-300 ease-in-out " +
        (collapsed ? "w-18" : "w-72")
      }
    >
      <div className="flex h-full flex-col">
        <div
          className={
            "flex h-16 items-center gap-3 " + (collapsed ? "px-3" : "px-4")
          }
        >
          <Image
            src="/logo.png"
            alt="Kurth Glass"
            width={28}
            height={28}
            className="h-7 w-7 object-contain"
            priority
          />
          {collapsed ? null : (
            <div className="min-w-0 leading-tight">
              <div className="text-sm font-semibold text-zinc-900">
                Kurth Glass
              </div>
              <div className="text-xs text-zinc-500">Administration</div>
            </div>
          )}
        </div>

        <nav
          className={
            "flex-1 overflow-y-auto pb-4 " + (collapsed ? "px-2" : "px-3")
          }
        >
          <div className="flex flex-col gap-1">
            {items.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    "group relative flex h-11 items-center gap-3 rounded-xl text-sm font-medium transition focus:outline-none focus:ring-4 focus:ring-zinc-950/10 " +
                    (collapsed ? "justify-center px-0" : "px-3") +
                    (active
                      ? " bg-zinc-800 text-white shadow-sm"
                      : " text-zinc-700 hover:bg-zinc-100")
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <span
                    className={
                      "grid h-9 w-9 place-items-center rounded-xl text-current transition " +
                      (active
                        ? "bg-white/10 "
                        : "bg-white/80 text-zinc-700 group-hover:bg-white")
                    }
                    aria-hidden
                  >
                    {item.icon}
                  </span>

                  <span
                    className={
                      "min-w-0 flex-1 truncate transition-all duration-200 " +
                      (collapsed
                        ? "w-0 translate-x-1 opacity-0"
                        : "w-auto translate-x-0 opacity-100")
                    }
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className={"pb-4 " + (collapsed ? "px-2" : "px-3")}>
          <div
            className={
              "overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 transition-[max-height,opacity] duration-300 ease-in-out " +
              (collapsed ? "max-h-0 opacity-0" : "max-h-24 opacity-100")
            }
          ></div>
        </div>
      </div>
    </aside>
  );
}

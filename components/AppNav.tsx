"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/add-concert", label: "Add Concert" },
  { href: "/my-concerts", label: "My Concerts" },
  { href: "/my-spending", label: "My Spending" },
  { href: "/recommendations", label: "Recommendations" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="w-full overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div
        role="tablist"
        className="flex w-max min-w-full flex-nowrap items-center gap-1 rounded-box bg-base-200/80 p-1"
      >
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              role="tab"
              aria-selected={active}
              className={`btn btn-sm h-9 shrink-0 border-0 shadow-none ${
                active
                  ? "btn-primary"
                  : "btn-ghost bg-transparent hover:bg-base-300/60"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

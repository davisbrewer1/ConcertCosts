"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/add-concert", label: "Add Concert" },
  { href: "/my-concerts", label: "My Concerts" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <div role="tablist" className="tabs tabs-boxed bg-base-200/80 p-1 w-full sm:w-auto overflow-x-auto">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            role="tab"
            className={`tab whitespace-nowrap ${active ? "tab-active font-semibold" : ""}`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}

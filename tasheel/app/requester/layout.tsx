"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

const navItems = [
  { href: "/requester", label: "Service Catalog", match: "catalog" },
  { href: "/requester/requests", label: "My Requests", match: "requests" },
];

export default function RequesterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  function isNavActive(match: string): boolean {
    if (match === "catalog") {
      return pathname === "/requester" || pathname.startsWith("/requester/services");
    }
    return pathname.startsWith("/requester/requests");
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between border-b border-requester-nav-border bg-requester-nav-bg px-6">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-sans text-lg font-bold text-foreground"
          >
            Tasheel
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const active = isNavActive(item.match);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <User className="h-4 w-4" />
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { TasheelLogo } from "@/components/shared/tasheel-logo";

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
    <div className="flex h-screen flex-col bg-muted/25">
      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/90 sm:px-6">
        <div className="flex min-w-0 items-center gap-4 sm:gap-8">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 font-sans text-lg font-semibold tracking-tight text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <TasheelLogo size={24} variant="light" animated={false} />
            <span>Tasheel</span>
          </Link>
          <nav className="flex items-center gap-0.5" aria-label="Requester">
            {navItems.map((item) => {
              const active = isNavActive(item.match);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"
          title="Signed in as requester (demo)"
        >
          <User className="h-4 w-4" aria-hidden />
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">{children}</div>
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTasheelStore } from "@/lib/store";
import {
  LayoutDashboard, Layers, Plus, FolderOpen, GitBranch,
  Inbox, ArrowLeftRight, Settings,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

export function Sidebar() {
  const pathname = usePathname();
  const services = useTasheelStore((s) => s.services);
  const workflows = useTasheelStore((s) => s.workflows);
  const requests = useTasheelStore((s) => s.requests);

  const pendingRequests = requests.filter(
    (r) => r.status === "submitted" || r.status === "in_review"
  ).length;

  const sections: NavSection[] = [
    {
      items: [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "Services",
      items: [
        { href: "/admin/services", label: "All Services", icon: Layers, badge: services.length },
        { href: "/admin/services/new", label: "Create Service", icon: Plus },
        { href: "/admin/categories", label: "Categories", icon: FolderOpen },
      ],
    },
    {
      title: "Workflows",
      items: [
        { href: "/admin/workflows", label: "Templates", icon: GitBranch, badge: workflows.length },
      ],
    },
    {
      title: "Requests",
      items: [
        { href: "/admin/requests", label: "All Requests", icon: Inbox, badge: pendingRequests || undefined },
      ],
    },
  ];

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside className="flex w-60 min-h-0 flex-shrink-0 flex-col bg-admin-sidebar-bg">
      <div className="flex h-[60px] items-center gap-2.5 border-b border-admin-sidebar-border px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-bold text-admin-sidebar-bg">
            T
          </div>
          <span className="text-sm font-semibold text-admin-sidebar-text">Tasheel</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {sections.map((section, si) => (
          <div key={si}>
            {section.title && (
              <p className="mb-1 mt-6 px-3 text-[11px] font-semibold uppercase tracking-widest text-admin-sidebar-muted">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex h-9 items-center justify-between rounded-md px-3 text-sm font-medium transition-colors duration-150",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-admin-sidebar-muted hover:bg-admin-sidebar-hover hover:text-admin-sidebar-text"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={cn(
                          "h-4 w-4",
                          active ? "text-primary-foreground" : "text-admin-sidebar-muted"
                        )}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-medium",
                          active
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-admin-sidebar-hover text-admin-sidebar-muted"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="space-y-0.5 border-t border-admin-sidebar-border p-2 pb-4">
        <Link
          href="/admin/settings"
          className={cn(
            "flex h-9 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors duration-150",
            pathname === "/admin/settings"
              ? "bg-primary text-primary-foreground"
              : "text-admin-sidebar-muted hover:bg-admin-sidebar-hover hover:text-admin-sidebar-text"
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          Settings
        </Link>
        <Link
          href="/requester"
          className="flex h-9 items-center gap-3 rounded-md px-3 text-sm font-medium text-admin-sidebar-muted transition-colors duration-150 hover:bg-admin-sidebar-hover hover:text-admin-sidebar-text"
        >
          <ArrowLeftRight className="h-4 w-4 shrink-0" />
          Requester Portal
        </Link>
      </div>
    </aside>
  );
}

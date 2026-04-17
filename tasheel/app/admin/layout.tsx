"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/shared/sidebar";
import { Header } from "@/components/shared/header";
import { CommandPalette } from "@/components/shared/command-palette";
import { AdminShellProvider } from "@/components/shared/admin-shell-context";
import { useTasheelStore } from "@/lib/store";

function AdminMainFooter() {
  const platformName = useTasheelStore((s) => s.workspaceSettings.platformName);
  return (
    <footer className="mt-12 border-t border-border/70 pt-4 pb-2 text-center text-[11px] leading-relaxed text-muted-foreground">
      <p>
        <span className="font-medium text-foreground">{platformName}</span>{" "}
        admin — data stays in this browser (local storage). Export or reset from{" "}
        <span className="text-foreground">Settings</span> when you need a clean
        demo.
      </p>
    </footer>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStudio = pathname.includes("/studio") || pathname === "/admin/services/new";

  if (isStudio) {
    return (
      <>
        {children}
        <CommandPalette />
      </>
    );
  }

  return (
    <AdminShellProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Header portal="admin" />
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
              {children}
              <AdminMainFooter />
            </div>
          </main>
        </div>
      </div>
      <CommandPalette />
    </AdminShellProvider>
  );
}

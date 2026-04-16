"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/shared/sidebar";
import { Header } from "@/components/shared/header";
import { CommandPalette } from "@/components/shared/command-palette";

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
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header portal="admin" />
        <main className="flex-1 overflow-y-auto px-8 py-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}

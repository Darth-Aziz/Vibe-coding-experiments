import React from "react";
import { Link, Outlet, useLocation } from "react-router";
import { LayoutDashboard, Palette, Component } from "lucide-react";

export function DesignSystemRoot() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {/* Sidebar for Navigation */}
      <aside className="w-64 border-r bg-muted/30 p-6 flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">Tasheel UI</h1>
        </div>
        <nav className="flex flex-col gap-2">
          <Link
            to="/colors"
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              location.pathname === "/colors" || location.pathname === "/"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
            }`}
          >
            <Palette className="h-4 w-4" />
            Color Guide
          </Link>
          <Link
            to="/components"
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              location.pathname === "/components"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
            }`}
          >
            <Component className="h-4 w-4" />
            Component Guide
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-background">
        <Outlet />
      </main>
    </div>
  );
}
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Shield, Menu, User, LogOut } from "lucide-react";
import { useAdminShell } from "@/components/shared/admin-shell-context";
import { useTasheelStore } from "@/lib/store";
import { ADMIN_PERSONA } from "@/lib/admin-persona";

interface HeaderProps {
  portal: "admin" | "requester";
}

export function Header({ portal }: HeaderProps) {
  const { openCommandPalette, setMobileNavOpen } = useAdminShell();
  const platformName = useTasheelStore((s) => s.workspaceSettings.platformName);
  const modKey =
    typeof navigator !== "undefined" &&
    (/Mac|iPhone|iPad|iPod/i.test(navigator.platform) ||
      navigator.userAgent.includes("Mac"))
      ? "⌘"
      : "Ctrl";

  return (
    <header
      data-portal={portal}
      className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border bg-background/95 px-3 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 sm:px-6"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 md:hidden"
          aria-label="Open navigation menu"
          onClick={() => setMobileNavOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground">
            <Shield className="h-3.5 w-3.5 text-primary" aria-hidden />
            Admin
          </span>
          <Badge
            variant="outline"
            className="hidden shrink-0 text-[10px] font-normal text-muted-foreground sm:inline-flex"
          >
            Browser demo
          </Badge>
          <span className="hidden min-w-0 truncate sm:inline">
            <span className="font-medium text-foreground">{platformName}</span>
            <span className="text-muted-foreground">
              {" "}
              · Service operations console
            </span>
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <button
          type="button"
          aria-label="Open command palette"
          onClick={() => openCommandPalette()}
          className="flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground shadow-sm transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-3"
        >
          <Search className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="hidden sm:inline">Search</span>
          <kbd
            suppressHydrationWarning
            className="hidden rounded border border-border bg-muted/80 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground md:inline-block"
          >
            {modKey}K
          </kbd>
        </button>
        <div className="flex items-center gap-2 border-l border-border pl-2 sm:pl-4">
          <span className="hidden max-w-[10rem] truncate text-sm text-muted-foreground md:inline">
            {ADMIN_PERSONA.name}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  className="h-8 rounded-full p-0"
                  aria-label={`Account menu, ${ADMIN_PERSONA.name}`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-xs font-medium text-primary-foreground">
                      {ADMIN_PERSONA.initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-medium text-foreground">
                  {ADMIN_PERSONA.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {ADMIN_PERSONA.email}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {ADMIN_PERSONA.jobTitle}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled className="gap-2">
                <User className="h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem disabled className="gap-2">
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

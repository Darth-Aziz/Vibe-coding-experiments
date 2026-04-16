"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search } from "lucide-react";

interface HeaderProps {
  portal: "admin" | "requester";
}

export function Header({ portal }: HeaderProps) {
  return (
    <header
      data-portal={portal}
      className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/40 bg-white/50 px-6 backdrop-blur-md"
    >
      <div />
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() =>
            document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))
          }
          className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/80 px-3 py-1.5 text-xs text-muted-foreground shadow-sm transition-colors hover:bg-muted/60"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search...</span>
          <kbd className="rounded border border-border/60 bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </button>
        <div className="flex items-center gap-2.5">
          <span className="text-sm text-muted-foreground">Sarah Mitchell</span>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-xs font-medium text-primary-foreground">
              SM
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

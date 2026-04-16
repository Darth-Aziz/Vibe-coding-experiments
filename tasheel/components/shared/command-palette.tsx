"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useTasheelStore } from "@/lib/store";
import {
  LayoutDashboard, Layers, Plus, Inbox, GitBranch, Settings,
  FolderOpen, Search, ArrowRight, RotateCcw,
} from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const services = useTasheelStore((s) => s.services);
  const requests = useTasheelStore((s) => s.requests);
  const resetToDefaults = useTasheelStore((s) => s.resetToDefaults);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const go = useCallback(
    (path: string) => {
      setOpen(false);
      router.push(path);
    },
    [router]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 max-w-lg" showCloseButton={false}>
        <Command className="rounded-lg">
          <CommandInput placeholder="Search services, requests, or navigate..." />
          <CommandList className="max-h-[400px]">
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Quick Actions">
              <CommandItem onSelect={() => go("/admin/services/new")}>
                <Plus className="mr-2 h-4 w-4 text-blue-500" />
                Create New Service
              </CommandItem>
              <CommandItem onSelect={() => go("/admin/requests")}>
                <Inbox className="mr-2 h-4 w-4 text-amber-500" />
                View All Requests
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  resetToDefaults();
                  localStorage.removeItem("tasheel-store");
                  window.location.href = "/admin";
                }}
              >
                <RotateCcw className="mr-2 h-4 w-4 text-red-500" />
                Reset Demo Data
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Navigation">
              {[
                { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
                { path: "/admin/services", label: "Services", icon: Layers },
                { path: "/admin/workflows", label: "Workflows", icon: GitBranch },
                { path: "/admin/requests", label: "Requests", icon: Inbox },
                { path: "/admin/categories", label: "Categories", icon: FolderOpen },
                { path: "/admin/settings", label: "Settings", icon: Settings },
                { path: "/requester", label: "Requester Portal", icon: ArrowRight },
              ].map((item) => (
                <CommandItem key={item.path} onSelect={() => go(item.path)}>
                  <item.icon className="mr-2 h-4 w-4 text-muted-foreground/70" />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>

            {services.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Services">
                  {services.slice(0, 8).map((svc) => (
                    <CommandItem key={svc.id} onSelect={() => go(`/admin/services/${svc.id}`)}>
                      <Layers className="mr-2 h-4 w-4 text-muted-foreground/70" />
                      <span>{svc.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{svc.status}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {requests.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Recent Requests">
                  {requests.slice(0, 6).map((req) => (
                    <CommandItem key={req.id} onSelect={() => go(`/admin/requests/${req.id}`)}>
                      <Search className="mr-2 h-4 w-4 text-muted-foreground/70" />
                      <span className="font-mono text-xs mr-2">{req.ticketNumber}</span>
                      <span className="text-muted-foreground">{req.serviceName}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>

          <div className="border-t px-3 py-2 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Navigate with arrow keys</span>
            <span>
              <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">ESC</kbd> to close
            </span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

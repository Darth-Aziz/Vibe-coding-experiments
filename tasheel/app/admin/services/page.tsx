"use client";

import { Suspense, useCallback } from "react";
import { useTasheelStore } from "@/lib/store";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  MoreHorizontal,
  Trash2,
  Search,
  Settings,
  FileText,
  ArrowUpDown,
  Workflow,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Service } from "@/lib/types";
import { cn, formatSlaSummary, serviceVisibilityLabel } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

const categories = [
  { key: "all", label: "All" },
  { key: "it", label: "IT Support" },
  { key: "hr", label: "HR" },
  { key: "facilities", label: "Facilities" },
  { key: "finance", label: "Finance" },
  { key: "general", label: "General" },
];

const statusFilters: { key: "all" | Service["status"]; label: string }[] = [
  { key: "all", label: "All statuses" },
  { key: "draft", label: "Draft" },
  { key: "published", label: "Published" },
  { key: "archived", label: "Archived" },
];

function ServiceListInner() {
  const services = useTasheelStore((s) => s.services);
  const requests = useTasheelStore((s) => s.requests);
  const deleteService = useTasheelStore((s) => s.deleteService);
  const duplicateService = useTasheelStore((s) => s.duplicateService);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("q") ?? "";
  const categoryFilter = searchParams.get("cat") ?? "all";
  const statusParam = searchParams.get("status");
  const statusFilter: "all" | Service["status"] =
    statusParam === "draft" ||
    statusParam === "published" ||
    statusParam === "archived"
      ? statusParam
      : "all";

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const p = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v === undefined || v === "") p.delete(k);
        else p.set(k, v);
      }
      const q = p.toString();
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const filtered = services.filter((s) => {
    const desc = s.description ?? "";
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      desc.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || s.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Services"
        description="Search, filter, and open the studio to configure forms, visibility, and workflows."
        actions={
          <Link
            href="/admin/services/new"
            className={cn(
              buttonVariants({ variant: "default", size: "default" }),
              "gap-2"
            )}
          >
            <Plus className="h-4 w-4" />
            Create service
          </Link>
        }
      />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                const v = e.target.value;
                updateParams({ q: v.length ? v : undefined });
              }}
              placeholder="Search services..."
              className="h-10 bg-background pl-9"
            />
          </div>
          <div className="flex flex-wrap rounded-lg border border-border bg-muted/50 p-1">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => {
                  updateParams({
                    cat: cat.key === "all" ? undefined : cat.key,
                  });
                }}
                className={cn(
                  "rounded-md px-4 py-1.5 text-sm font-medium transition-all",
                  categoryFilter === cat.key
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {statusFilters.map((st) => (
            <button
              key={st.key}
              type="button"
              onClick={() => {
                updateParams({
                  status: st.key === "all" ? undefined : st.key,
                });
              }}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                statusFilter === st.key
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:bg-muted"
              )}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      <Card className="border shadow-sm">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState
              className="rounded-none border-0 bg-muted/15 py-14"
              icon={FileText}
              title={
                services.length === 0
                  ? "No services yet"
                  : "No matching services"
              }
              description={
                services.length === 0
                  ? "Create your first service to appear in admin and requester catalogs."
                  : "Try clearing search or filters to see the full list."
              }
              action={
                <Link
                  href="/admin/services/new"
                  className={cn(
                    buttonVariants({ variant: "default", size: "sm" }),
                    "gap-2"
                  )}
                >
                  <Plus className="h-4 w-4" />
                  Create service
                </Link>
              }
            />
          ) : (
            <Table>
              <caption className="sr-only">
                Service catalog with category, status, and setup health
              </caption>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[260px] text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Service Name
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Category
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Visibility
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead
                    className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    title="Form fields and linked workflow"
                  >
                    Setup
                  </TableHead>
                  <TableHead className="text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Requests
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    SLA
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      Last Modified
                      <ArrowUpDown className="h-3 w-3" />
                    </span>
                  </TableHead>
                  <TableHead className="w-[70px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((service) => {
                  const reqCount = requests.filter(
                    (r) => r.serviceId === service.id
                  ).length;
                  const fieldCount = service.formFields?.length ?? 0;
                  const hasForm = fieldCount > 0;
                  const hasWorkflow = Boolean(service.workflowId);
                  return (
                    <TableRow
                      key={service.id}
                      className="group cursor-pointer border-border hover:bg-muted/50"
                      onClick={() =>
                        router.push(`/admin/services/${service.id}/studio`)
                      }
                    >
                      <TableCell className="font-medium">
                        {service.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {service.category}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {serviceVisibilityLabel(service.visibility)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={service.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span
                            title={
                              hasForm
                                ? `${fieldCount} form field(s)`
                                : "No form fields yet"
                            }
                            className="inline-flex"
                          >
                            <ClipboardList
                              className={cn(
                                "h-4 w-4",
                                hasForm
                                  ? "text-emerald-600 dark:text-emerald-500"
                                  : "text-muted-foreground/35"
                              )}
                              aria-hidden
                            />
                            <span className="sr-only">
                              {hasForm
                                ? "Form configured"
                                : "Form not configured"}
                            </span>
                          </span>
                          <span
                            title={
                              hasWorkflow
                                ? "Workflow linked"
                                : "No workflow linked"
                            }
                            className="inline-flex"
                          >
                            <Workflow
                              className={cn(
                                "h-4 w-4",
                                hasWorkflow
                                  ? "text-emerald-600 dark:text-emerald-500"
                                  : "text-muted-foreground/35"
                              )}
                              aria-hidden
                            />
                            <span className="sr-only">
                              {hasWorkflow
                                ? "Workflow linked"
                                : "No workflow"}
                            </span>
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {reqCount}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatSlaSummary(service.sla)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(service.updatedAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </TableCell>
                      <TableCell
                        onClick={(e) => e.stopPropagation()}
                        className="text-right"
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem
                              render={
                                <Link
                                  href={`/admin/services/${service.id}/studio`}
                                />
                              }
                            >
                              <Settings className="mr-2 h-4 w-4" /> Configure
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              render={
                                <Link
                                  href={`/admin/services/${service.id}/workflow`}
                                />
                              }
                            >
                              <Workflow className="mr-2 h-4 w-4" /> Workflow
                              editor
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                const copy = duplicateService(service.id);
                                if (copy) {
                                  toast.success("Duplicated");
                                  router.push(
                                    `/admin/services/${copy.id}/studio`
                                  );
                                }
                              }}
                            >
                              <FileText className="mr-2 h-4 w-4" /> Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => {
                                deleteService(service.id);
                                toast.success("Deleted");
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ServiceListPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8 animate-pulse">
          <div className="h-10 w-64 rounded-md bg-muted" />
          <div className="h-12 w-full max-w-md rounded-md bg-muted" />
          <div className="h-96 rounded-lg bg-muted" />
        </div>
      }
    >
      <ServiceListInner />
    </Suspense>
  );
}

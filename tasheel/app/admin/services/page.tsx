"use client";

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
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Service } from "@/lib/types";
import { cn, formatSlaSummary, serviceVisibilityLabel } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/status-badge";

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

export default function ServiceListPage() {
  const services = useTasheelStore((s) => s.services);
  const requests = useTasheelStore((s) => s.requests);
  const deleteService = useTasheelStore((s) => s.deleteService);
  const duplicateService = useTasheelStore((s) => s.duplicateService);
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | Service["status"]>("all");

  const filtered = services.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || s.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Service Catalog
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage and configure your available services
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className={cn(buttonVariants({ variant: "default" }), "gap-2")}
        >
          <Plus className="h-4 w-4" />
          Create Service
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className="h-10 bg-background pl-9"
            />
          </div>
          <div className="flex flex-wrap rounded-lg border border-border bg-muted/50 p-1">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setCategoryFilter(cat.key)}
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
              onClick={() => setStatusFilter(st.key)}
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
            <div className="py-16 text-center">
              <p className="text-sm text-muted-foreground">No services found</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[300px] font-medium uppercase tracking-wider text-muted-foreground text-xs">
                    Service Name
                  </TableHead>
                  <TableHead className="font-medium uppercase tracking-wider text-muted-foreground text-xs">
                    Category
                  </TableHead>
                  <TableHead className="font-medium uppercase tracking-wider text-muted-foreground text-xs">
                    Visibility
                  </TableHead>
                  <TableHead className="font-medium uppercase tracking-wider text-muted-foreground text-xs">
                    Status
                  </TableHead>
                  <TableHead className="text-right font-medium uppercase tracking-wider text-muted-foreground text-xs">
                    Requests
                  </TableHead>
                  <TableHead className="font-medium uppercase tracking-wider text-muted-foreground text-xs">
                    SLA
                  </TableHead>
                  <TableHead className="font-medium uppercase tracking-wider text-muted-foreground text-xs">
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
                  return (
                    <TableRow
                      key={service.id}
                      className="group cursor-pointer hover:bg-muted/30"
                      onClick={() =>
                        router.push(`/admin/services/${service.id}/studio`)
                      }
                    >
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {service.category}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {serviceVisibilityLabel(service.visibility)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={service.status} />
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {reqCount}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatSlaSummary(service.sla)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(service.updatedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
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
                              <Workflow className="mr-2 h-4 w-4" /> Workflow editor
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                const copy = duplicateService(service.id);
                                if (copy) {
                                  toast.success("Duplicated");
                                  router.push(`/admin/services/${copy.id}/studio`);
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

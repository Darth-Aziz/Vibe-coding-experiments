"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useTasheelStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/search-bar";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatDate, getCategoryColor, cn } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import {
  MoreHorizontal,
  Eye,
  ArrowRight,
  Ban,
  Inbox,
  AlertTriangle,
  User,
} from "lucide-react";
import { toast } from "sonner";
import type { Service, ServiceCategory, ServiceRequest } from "@/lib/types";
import { ADMIN_PERSONA } from "@/lib/admin-persona";
import {
  getAllAssignableAgents,
  QUEUE_LABELS,
  resolveRequestQueue,
} from "@/lib/assignment-queues";

function slaInfo(
  createdAt: string,
  resolutionHours: number,
  now: number
): {
  text: string;
  color: string;
  breached: boolean;
} {
  const elapsed = (now - new Date(createdAt).getTime()) / 3600000;
  const remaining = resolutionHours - elapsed;
  if (remaining <= 0)
    return {
      text: "Breached",
      color: "font-semibold text-destructive",
      breached: true,
    };
  const h = Math.floor(remaining);
  const m = Math.round((remaining - h) * 60);
  if (remaining < resolutionHours * 0.3)
    return {
      text: `${h}h ${m}m`,
      color: "text-amber-600 dark:text-amber-500",
      breached: false,
    };
  return {
    text: `${h}h ${m}m`,
    color: "text-emerald-600 dark:text-emerald-500",
    breached: false,
  };
}

function remainingHours(
  req: ServiceRequest,
  services: Service[],
  now: number
): number | null {
  const svc = services.find((s) => s.id === req.serviceId);
  if (
    !svc ||
    ["completed", "cancelled", "rejected"].includes(req.status)
  ) {
    return null;
  }
  return (
    svc.sla.resolutionTime -
    (now - new Date(req.createdAt).getTime()) / 3600000
  );
}

function sortRequests(
  list: ServiceRequest[],
  sort: "date" | "sla",
  services: Service[],
  now: number
): ServiceRequest[] {
  if (sort === "date") {
    return [...list].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  return [...list].sort((a, b) => {
    const score = (r: ServiceRequest) => {
      const rem = remainingHours(r, services, now);
      if (rem === null) return Number.POSITIVE_INFINITY;
      return rem;
    };
    return score(a) - score(b);
  });
}

function AdminRequestsInner() {
  const requests = useTasheelStore((s) => s.requests);
  const services = useTasheelStore((s) => s.services);
  const advanceRequest = useTasheelStore((s) => s.advanceRequest);
  const rejectRequest = useTasheelStore((s) => s.rejectRequest);
  const reassignRequest = useTasheelStore((s) => s.reassignRequest);
  const workflows = useTasheelStore((s) => s.workflows);
  const assignAgents = getAllAssignableAgents();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const ssrNow = new Date("2026-04-15T12:00:00Z").getTime();
  const [now, setNow] = useState(ssrNow);
  useEffect(() => {
    const id = requestAnimationFrame(() => setNow(Date.now()));
    return () => cancelAnimationFrame(id);
  }, []);

  const search = searchParams.get("q") ?? "";
  const serviceFilter = searchParams.get("service") ?? "all";
  const statusFilter = searchParams.get("status") ?? "all";
  const sort: "date" | "sla" =
    searchParams.get("sort") === "sla" ? "sla" : "date";
  const urlFilter = searchParams.get("filter");
  const workFilter = searchParams.get("work") ?? "all";
  const queueFilter = (searchParams.get("queue") ?? "all") as
    | "all"
    | ServiceCategory;

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

  const filtered = requests.filter((r) => {
    if (urlFilter === "pending") {
      if (r.status !== "submitted" && r.status !== "in_review") return false;
    }
    if (urlFilter === "breached") {
      const svc = services.find((s) => s.id === r.serviceId);
      if (
        !svc ||
        ["completed", "cancelled", "rejected"].includes(r.status)
      ) {
        return false;
      }
      const rem =
        svc.sla.resolutionTime -
        (now - new Date(r.createdAt).getTime()) / 3600000;
      if (rem > 0) return false;
    }
    if (queueFilter !== "all") {
      if (resolveRequestQueue(r, services) !== queueFilter) return false;
    }
    if (workFilter === "me") {
      if (r.assignedToId !== ADMIN_PERSONA.id) return false;
    } else if (workFilter === "unassigned") {
      if (r.assignedToId != null && r.assignedToId !== "") return false;
    } else if (workFilter !== "all") {
      if (r.assignedToId !== workFilter) return false;
    }
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (serviceFilter !== "all" && r.serviceId !== serviceFilter)
      return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !r.ticketNumber.toLowerCase().includes(q) &&
        !r.serviceName.toLowerCase().includes(q) &&
        !r.requesterName.toLowerCase().includes(q) &&
        !(r.assignedToName?.toLowerCase().includes(q) ?? false)
      ) {
        return false;
      }
    }
    return true;
  });

  const sorted = sortRequests(filtered, sort, services, now);

  function getStageName(req: (typeof requests)[0]) {
    const svc = services.find((s) => s.id === req.serviceId);
    const wf = workflows.find((w) => w.id === svc?.workflowId);
    return wf?.stages.find((s) => s.id === req.currentStage)?.name ?? "—";
  }

  const uniqueServices = [...new Set(requests.map((r) => r.serviceId))].map(
    (id) => ({
      id,
      name: services.find((s) => s.id === id)?.name ?? id,
    })
  );

  const presetActive = (key: string | null) =>
    (key === null && !urlFilter) || urlFilter === key;

  const allScopeActive =
    !urlFilter &&
    workFilter === "all" &&
    queueFilter === "all";

  const queueKeys = Object.keys(QUEUE_LABELS) as ServiceCategory[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Requests"
        description="Work queues, round-robin assignment on new tickets, and filters for your owned work. Reassign from the row menu or the ticket page."
      />

      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Work scope
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              updateParams({
                filter: undefined,
                work: undefined,
                queue: undefined,
              });
            }}
            className={cn(
              buttonVariants({
                variant: allScopeActive ? "default" : "outline",
                size: "sm",
              }),
              "rounded-full"
            )}
          >
            All open queues
          </button>
          <button
            type="button"
            onClick={() => {
              updateParams({ work: "me", filter: undefined });
            }}
            className={cn(
              buttonVariants({
                variant: workFilter === "me" ? "default" : "outline",
                size: "sm",
              }),
              "rounded-full gap-1.5"
            )}
          >
            <User className="h-3.5 w-3.5" />
            My tickets
          </button>
          <button
            type="button"
            onClick={() => {
              updateParams({ work: "unassigned", filter: undefined });
            }}
            className={cn(
              buttonVariants({
                variant: workFilter === "unassigned" ? "secondary" : "outline",
                size: "sm",
              }),
              "rounded-full"
            )}
          >
            Unassigned
          </button>
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground pt-2">
          Team queues
        </p>
        <div className="flex flex-wrap gap-2">
          {queueKeys.map((qk) => (
            <button
              key={qk}
              type="button"
              onClick={() => {
                updateParams({
                  queue: qk,
                  filter: undefined,
                });
              }}
              className={cn(
                buttonVariants({
                  variant: queueFilter === qk ? "default" : "outline",
                  size: "sm",
                }),
                "rounded-full text-xs"
              )}
            >
              {QUEUE_LABELS[qk]}
            </button>
          ))}
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground pt-2">
          SLA &amp; status
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              updateParams({
                filter: "pending",
                status: undefined,
                work: undefined,
                queue: undefined,
              });
            }}
            className={cn(
              buttonVariants({
                variant: presetActive("pending") ? "default" : "outline",
                size: "sm",
              }),
              "rounded-full gap-1.5"
            )}
          >
            <Inbox className="h-3.5 w-3.5" />
            Pending review
          </button>
          <button
            type="button"
            onClick={() => {
              updateParams({
                filter: "breached",
                status: undefined,
                work: undefined,
                queue: undefined,
              });
            }}
            className={cn(
              buttonVariants({
                variant: presetActive("breached") ? "destructive" : "outline",
                size: "sm",
              }),
              "rounded-full gap-1.5",
              !presetActive("breached") &&
                "border-destructive/30 text-destructive"
            )}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            SLA breached
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select
          value={serviceFilter}
          onValueChange={(v) => {
            const next = v ?? "all";
            updateParams({ service: next === "all" ? undefined : next });
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All Services" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            {uniqueServices.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            const next = v ?? "all";
            updateParams({
              status: next === "all" ? undefined : next,
              filter: undefined,
              work: undefined,
              queue: undefined,
            });
          }}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={sort}
          onValueChange={(v) => {
            const next = v === "sla" ? "sla" : "date";
            updateParams({ sort: next === "date" ? undefined : next });
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Newest submitted</SelectItem>
            <SelectItem value="sla">SLA urgency (open tickets)</SelectItem>
          </SelectContent>
        </Select>
        <div className="min-w-[200px] flex-1">
          <SearchBar
            value={search}
            onChange={(v) => {
              updateParams({ q: v.trim() ? v : undefined });
            }}
            placeholder="Search ticket, service, requester..."
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {sorted.length} of {requests.length} requests
      </p>

      <Card className="border shadow-sm">
        <CardContent className="p-0">
          {sorted.length === 0 ? (
            <EmptyState
              className="rounded-none border-0 bg-muted/15 py-14"
              icon={Inbox}
              title="No requests match"
              description="Clear filters or wait for new submissions from the requester portal."
            />
          ) : (
            <Table>
              <caption className="sr-only">
                Service requests with SLA and workflow stage
              </caption>
              <TableHeader>
                <TableRow className="border-b bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-32 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Ticket #
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Service
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Requester
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Queue
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Assignee
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Current Stage
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    SLA
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Submitted
                  </TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((req) => {
                  const svc = services.find((s) => s.id === req.serviceId);
                  const isOpen = !["completed", "cancelled", "rejected"].includes(
                    req.status
                  );
                  const sla =
                    svc && isOpen
                      ? slaInfo(
                          req.createdAt,
                          svc.sla.resolutionTime,
                          now
                        )
                      : null;
                  const canAdvance = ["submitted", "in_review"].includes(
                    req.status
                  );

                  return (
                    <TableRow key={req.id} className="group hover:bg-muted/50">
                      <TableCell>
                        <Link
                          href={`/admin/requests/${req.id}`}
                          className="font-mono text-xs transition-colors hover:text-primary"
                        >
                          {req.ticketNumber}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{req.serviceName}</span>
                          {svc && (
                            <Badge
                              variant="secondary"
                              className={`${getCategoryColor(svc.category)} text-[9px]`}
                            >
                              {svc.category.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {req.requesterName}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {QUEUE_LABELS[resolveRequestQueue(req, services)]}
                      </TableCell>
                      <TableCell className="text-sm">
                        {req.assignedToName ? (
                          <span
                            className={
                              req.assignedToId === ADMIN_PERSONA.id
                                ? "font-medium text-foreground"
                                : "text-muted-foreground"
                            }
                          >
                            {req.assignedToName}
                          </span>
                        ) : (
                          <span className="text-xs italic text-muted-foreground">
                            Unassigned
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={req.status} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {getStageName(req)}
                      </TableCell>
                      <TableCell>
                        {sla ? (
                          <span
                            className={`inline-flex items-center gap-1 text-xs ${sla.color}`}
                          >
                            {sla.breached && (
                              <AlertTriangle
                                className="h-3.5 w-3.5 shrink-0"
                                aria-hidden
                              />
                            )}
                            {sla.breached ? (
                              <span>SLA breached</span>
                            ) : (
                              <span>{sla.text}</span>
                            )}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(req.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              render={
                                <Link href={`/admin/requests/${req.id}`} />
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            {canAdvance && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => {
                                    advanceRequest(
                                      req.id,
                                      "Approved",
                                      ADMIN_PERSONA.name,
                                      "Approved by admin"
                                    );
                                    toast.success("Request advanced");
                                  }}
                                >
                                  <ArrowRight className="mr-2 h-4 w-4" />{" "}
                                  Advance
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  variant="destructive"
                                  onClick={() => {
                                    rejectRequest(req.id, "Rejected by admin");
                                    toast.info("Request rejected");
                                  }}
                                >
                                  <Ban className="mr-2 h-4 w-4" /> Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                Assign to…
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent className="max-h-64 overflow-y-auto">
                                <DropdownMenuItem
                                  onClick={() => {
                                    reassignRequest(req.id, {
                                      id: ADMIN_PERSONA.id,
                                      name: ADMIN_PERSONA.name,
                                    });
                                    toast.success("Assigned to you");
                                  }}
                                >
                                  Me ({ADMIN_PERSONA.name.split(" ")[0]})
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    reassignRequest(req.id, {
                                      id: "",
                                      name: "",
                                    });
                                    toast.success("Released to queue");
                                  }}
                                >
                                  Unassigned
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {assignAgents.map((a) => (
                                  <DropdownMenuItem
                                    key={a.id}
                                    onClick={() => {
                                      reassignRequest(req.id, a);
                                      toast.success(`Assigned to ${a.name}`);
                                    }}
                                  >
                                    {a.name}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              render={
                                <Link
                                  href={`/admin/services/${req.serviceId}`}
                                />
                              }
                            >
                              View Service
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

export default function AdminRequestsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 animate-pulse">
          <div className="h-10 w-56 rounded-md bg-muted" />
          <div className="h-12 w-full rounded-md bg-muted" />
          <div className="h-96 rounded-lg bg-muted" />
        </div>
      }
    >
      <AdminRequestsInner />
    </Suspense>
  );
}

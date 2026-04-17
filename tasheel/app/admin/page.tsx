"use client";

import { useState, useEffect, useMemo } from "react";
import { useTasheelStore } from "@/lib/store";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import {
  Inbox,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  User,
} from "lucide-react";
import { ADMIN_PERSONA } from "@/lib/admin-persona";
import { StatusBadge } from "@/components/shared/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

function timeSince(date: string, now: number): string {
  const seconds = Math.floor((now - new Date(date).getTime()) / 1000);
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 172800) return "Yesterday";
  return formatDate(date);
}

function slaRemainingHours(
  createdAt: string,
  resolutionHours: number,
  now: number
): number {
  return resolutionHours - (now - new Date(createdAt).getTime()) / 3600000;
}

function slaText(
  createdAt: string,
  resolutionHours: number,
  now: number
): { text: string; color: string; breached: boolean } {
  const remaining = slaRemainingHours(createdAt, resolutionHours, now);
  if (remaining <= 0)
    return { text: "Breached", color: "text-destructive", breached: true };
  if (remaining < resolutionHours * 0.3)
    return {
      text: `${Math.round(remaining)}h left`,
      color: "text-amber-600 dark:text-amber-500",
      breached: false,
    };
  return {
    text: `${Math.round(remaining)}h left`,
    color: "text-emerald-600 dark:text-emerald-500",
    breached: false,
  };
}

export default function AdminDashboard() {
  const services = useTasheelStore((s) => s.services);
  const requests = useTasheelStore((s) => s.requests);
  const ssrNow = new Date("2026-04-15T12:00:00Z").getTime();
  const [now, setNow] = useState(ssrNow);
  useEffect(() => {
    const id = requestAnimationFrame(() => setNow(Date.now()));
    return () => cancelAnimationFrame(id);
  }, []);

  const published = services.filter((s) => s.status === "published").length;
  const drafts = services.filter((s) => s.status === "draft").length;

  const { pendingReviewCount, breachedCount } = useMemo(() => {
    let pending = 0;
    let breached = 0;
    for (const r of requests) {
      if (r.status === "submitted" || r.status === "in_review") pending++;
      const svc = services.find((s) => s.id === r.serviceId);
      if (
        svc &&
        !["completed", "cancelled", "rejected"].includes(r.status) &&
        slaRemainingHours(r.createdAt, svc.sla.resolutionTime, now) <= 0
      ) {
        breached++;
      }
    }
    return { pendingReviewCount: pending, breachedCount: breached };
  }, [requests, services, now]);

  const myOpenTicketCount = useMemo(() => {
    return requests.filter(
      (r) =>
        r.assignedToId === ADMIN_PERSONA.id &&
        (r.status === "submitted" || r.status === "in_review")
    ).length;
  }, [requests]);

  const recentRequests = [...requests]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 6);

  const stats = [
    {
      label: "Total Services",
      value: services.length,
      href: "/admin/services",
      icon: FileText,
      iconWrap: "bg-primary/10",
      iconClass: "text-primary",
    },
    {
      label: "Published",
      value: published,
      href: "/admin/services?status=published",
      icon: CheckCircle,
      iconWrap: "bg-success/10",
      iconClass: "text-success",
    },
    {
      label: "Draft",
      value: drafts,
      href: "/admin/services?status=draft",
      icon: Clock,
      iconWrap: "bg-warning/10",
      iconClass: "text-warning",
    },
    {
      label: "Total Requests",
      value: requests.length,
      href: "/admin/requests",
      icon: Inbox,
      iconWrap: "bg-info/10",
      iconClass: "text-info",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of services, publishing health, and the latest request activity."
      />

      {(pendingReviewCount > 0 ||
        breachedCount > 0 ||
        myOpenTicketCount > 0) && (
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Needs attention
          </span>
          <div className="flex flex-wrap gap-2">
            {myOpenTicketCount > 0 && (
              <Link
                href="/admin/requests?work=me"
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-primary/15"
              >
                <User className="h-3.5 w-3.5 text-primary" />
                {myOpenTicketCount} assigned to you
              </Link>
            )}
            {pendingReviewCount > 0 && (
              <Link
                href="/admin/requests?filter=pending"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-muted/80"
              >
                <Inbox className="h-3.5 w-3.5 text-muted-foreground" />
                {pendingReviewCount} pending review
              </Link>
            )}
            {breachedCount > 0 && (
              <Link
                href="/admin/requests?filter=breached"
                className="inline-flex items-center gap-1.5 rounded-full border border-destructive/25 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive"
              >
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                {breachedCount} SLA breached
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group rounded-lg border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/20 hover:bg-muted/20"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {s.label}
              </span>
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg",
                  s.iconWrap
                )}
              >
                <s.icon
                  className={cn("h-4 w-4", s.iconClass)}
                  strokeWidth={1.5}
                />
              </div>
            </div>
            <p className="mt-2 text-[28px] font-bold leading-none text-foreground">
              {s.value}
            </p>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              View <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>

      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-foreground">
            Recent Requests
          </h2>
          {recentRequests.length > 0 && (
            <Link
              href="/admin/requests"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-primary"
              )}
            >
              View all
            </Link>
          )}
        </div>
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          {recentRequests.length === 0 ? (
            <EmptyState
              className="rounded-none border-0 bg-muted/15 py-14"
              icon={Inbox}
              title="No requests yet"
              description="When requesters submit tickets, they will appear here with SLA context."
              action={
                <Link
                  href="/admin/services/new"
                  className={cn(
                    buttonVariants({ variant: "default", size: "sm" })
                  )}
                >
                  Create a service
                </Link>
              }
            />
          ) : (
            <Table>
              <caption className="sr-only">
                Six most recent service requests with status and SLA
              </caption>
              <TableHeader>
                <TableRow className="border-b bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Ticket
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Service
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Requester
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentRequests.map((req) => {
                  const svc = services.find((s) => s.id === req.serviceId);
                  const sla =
                    svc &&
                    !["completed", "cancelled", "rejected"].includes(
                      req.status
                    )
                      ? slaText(
                          req.createdAt,
                          svc.sla.resolutionTime,
                          now
                        )
                      : null;
                  return (
                    <TableRow
                      key={req.id}
                      className="border-border hover:bg-muted/50"
                    >
                      <TableCell className="font-mono text-[13px] font-medium">
                        <Link
                          href={`/admin/requests/${req.id}`}
                          className="text-foreground hover:underline"
                        >
                          {req.ticketNumber}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm text-foreground">
                        {req.serviceName}
                      </TableCell>
                      <TableCell className="text-sm text-foreground">
                        {req.requesterName}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <StatusBadge status={req.status} />
                          {sla && (
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 text-xs font-medium",
                                sla.color
                              )}
                            >
                              {sla.breached && (
                                <AlertTriangle
                                  className="h-3.5 w-3.5 shrink-0"
                                  aria-hidden
                                />
                              )}
                              <span>
                                SLA: {sla.text}
                                {sla.breached ? " (overdue)" : ""}
                              </span>
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {timeSince(req.createdAt, now)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/services/new"
          className={cn(buttonVariants({ variant: "default", size: "lg" }))}
        >
          Create Service
        </Link>
        <Link
          href="/admin/services"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          View All Services
        </Link>
      </div>
    </div>
  );
}

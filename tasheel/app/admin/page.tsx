"use client";

import { useState, useEffect } from "react";
import { useTasheelStore } from "@/lib/store";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { Inbox, FileText, CheckCircle, Clock } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";

function timeSince(date: string, now: number): string {
  const seconds = Math.floor((now - new Date(date).getTime()) / 1000);
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 172800) return "Yesterday";
  return formatDate(date);
}

function slaText(
  createdAt: string,
  resolutionHours: number,
  now: number
): { text: string; color: string } {
  const remaining =
    resolutionHours - (now - new Date(createdAt).getTime()) / 3600000;
  if (remaining <= 0) return { text: "Breached", color: "text-danger" };
  if (remaining < resolutionHours * 0.3)
    return { text: `${Math.round(remaining)}h`, color: "text-warning" };
  return { text: `${Math.round(remaining)}h`, color: "text-success" };
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
      icon: FileText,
      iconWrap: "bg-primary/10",
      iconClass: "text-primary",
    },
    {
      label: "Published",
      value: published,
      icon: CheckCircle,
      iconWrap: "bg-success/10",
      iconClass: "text-success",
    },
    {
      label: "Draft",
      value: drafts,
      icon: Clock,
      iconWrap: "bg-warning/10",
      iconClass: "text-warning",
    },
    {
      label: "Total Requests",
      value: requests.length,
      icon: Inbox,
      iconWrap: "bg-info/10",
      iconClass: "text-info",
    },
  ];

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your service management platform
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
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
                <s.icon className={cn("h-4 w-4", s.iconClass)} strokeWidth={1.5} />
              </div>
            </div>
            <p className="mt-2 text-[28px] font-bold leading-none text-foreground">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Recent Requests
          </h2>
        </div>
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {recentRequests.length === 0 ? (
            <div className="py-16 text-center">
              <Inbox className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No requests yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  {["Ticket", "Service", "Requester", "Status", "Date"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((req) => {
                  const svc = services.find((s) => s.id === req.serviceId);
                  const sla =
                    svc &&
                    !["completed", "cancelled", "rejected"].includes(req.status)
                      ? slaText(req.createdAt, svc.sla.resolutionTime, now)
                      : null;
                  return (
                    <tr
                      key={req.id}
                      className="border-t border-border/60 transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/requests/${req.id}`}
                          className="font-mono text-[13px] font-medium text-foreground hover:underline"
                        >
                          {req.ticketNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {req.serviceName}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {req.requesterName}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <StatusBadge status={req.status} />
                          {sla && (
                            <span className={`text-xs font-medium ${sla.color}`}>
                              SLA: {sla.text}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {timeSince(req.createdAt, now)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="flex gap-3">
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

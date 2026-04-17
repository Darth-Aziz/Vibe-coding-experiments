"use client";

import { use, createElement } from "react";
import { useTasheelStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import Link from "next/link";
import {
  Pencil, FileText, GitBranch, Inbox, CheckCircle, Timer,
  ArrowRight, Circle, FileQuestion,
} from "lucide-react";
import { cn, getCategoryColor, formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { toast } from "sonner";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

function getIcon(name: string): LucideIcon {
  const icons = LucideIcons as unknown as Record<string, LucideIcon>;
  return icons[name] || LucideIcons.FileText;
}

export default function ServiceOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const service = useTasheelStore((s) => s.services.find((svc) => svc.id === id));
  const allRequests = useTasheelStore((s) => s.requests);
  const workflows = useTasheelStore((s) => s.workflows);
  const publishService = useTasheelStore((s) => s.publishService);
  const unpublishService = useTasheelStore((s) => s.unpublishService);

  const requests = allRequests.filter((r) => r.serviceId === id);

  if (!service) {
    return (
      <div className="py-12">
        <EmptyState
          icon={FileQuestion}
          title="Service not found"
          description="This ID is not in the catalog. Return to the list or create a new service."
          action={
            <Link
              href="/admin/services"
              className={cn(buttonVariants({ variant: "default", size: "sm" }))}
            >
              All services
            </Link>
          }
        />
      </div>
    );
  }

  const workflow = workflows.find((w) => w.id === service.workflowId);
  const openReqs = requests.filter((r) => !["completed", "cancelled", "rejected"].includes(r.status));
  const completedReqs = requests.filter((r) => r.status === "completed");

  const avgResolutionHours = completedReqs.length > 0
    ? Math.round(
        completedReqs.reduce((sum, r) => {
          return sum + (new Date(r.updatedAt).getTime() - new Date(r.createdAt).getTime()) / 3600000;
        }, 0) / completedReqs.length
      )
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={service.name}
        description={service.description}
        breadcrumb={[
          { label: "Services", href: "/admin/services" },
          { label: service.name },
        ]}
        actions={
          <div className="flex gap-2">
            {service.status === "draft" && (
              <Button size="sm" onClick={() => { publishService(service.id); toast.success("Service published"); }}>
                Publish
              </Button>
            )}
            {service.status === "published" && (
              <Button size="sm" variant="outline" onClick={() => { unpublishService(service.id); toast.info("Service unpublished"); }}>
                Unpublish
              </Button>
            )}
            <Link href={`/admin/services/${id}/studio`}>
              <Button size="sm" variant="outline" className="gap-1.5">
                <Pencil className="h-3.5 w-3.5" /> Open in Studio
              </Button>
            </Link>
          </div>
        }
      />

      {/* Status + Category */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
          {createElement(getIcon(service.icon), {
            className: "h-6 w-6 text-muted-foreground",
          })}
        </div>
        <div className="flex gap-2">
          <StatusBadge status={service.status} />
          <Badge variant="secondary" className={getCategoryColor(service.category)}>
            {service.category.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold">{requests.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total Requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-primary">{openReqs.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Open Requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-warning">{avgResolutionHours || "—"}h</p>
            <p className="text-xs text-muted-foreground mt-0.5">Avg Resolution</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-success">
              {requests.length > 0
                ? Math.round((completedReqs.length / requests.length) * 100)
                : 100}%
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Completion Rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Configuration Summary */}
        <div className="col-span-2 space-y-4">
          {/* SLA */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-1.5">
                <Timer className="h-4 w-4 text-muted-foreground" /> SLA Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">Response Time</p>
                  <p className="text-lg font-bold">{service.sla.responseTime}h</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">Resolution Time</p>
                  <p className="text-lg font-bold">{service.sla.resolutionTime}h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Fields */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-primary" /> Request Form
              </CardTitle>
              <Badge variant="secondary">{service.formFields.length} fields</Badge>
            </CardHeader>
            <CardContent>
              {service.formFields.length === 0 ? (
                <p className="text-sm text-muted-foreground">No form fields configured yet.</p>
              ) : (
                <div className="space-y-1.5">
                  {[...service.formFields].sort((a, b) => a.order - b.order).map((f, i) => (
                    <div key={f.id} className="flex items-center justify-between rounded px-2 py-1.5 hover:bg-muted">
                      <span className="text-sm">
                        <span className="text-muted-foreground mr-1.5">{i + 1}.</span>
                        {f.label}
                        {f.required && <span className="ml-0.5 text-destructive">*</span>}
                      </span>
                      <span className="text-xs text-muted-foreground">{f.type}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Workflow */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-1.5">
                <GitBranch className="h-4 w-4 text-purple-500" /> Workflow
              </CardTitle>
              {workflow && <Badge variant="secondary">{workflow.stages.length} stages</Badge>}
            </CardHeader>
            <CardContent>
              {workflow ? (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {workflow.stages
                    .filter((s) => s.type !== "start")
                    .map((stage, i, arr) => (
                      <div key={stage.id} className="flex items-center gap-1.5">
                        <div className="flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-1">
                          {stage.type === "end" ? (
                            <CheckCircle className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <Circle className="h-3 w-3 fill-primary/15 text-primary" />
                          )}
                          <span className="text-xs font-medium">{stage.name}</span>
                          {stage.assignee && (
                            <span className="text-[10px] text-muted-foreground">({stage.assignee})</span>
                          )}
                        </div>
                        {i < arr.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground/40" />}
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No workflow linked.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p>{formatDate(service.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p>{formatDate(service.updatedAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Service ID</p>
                <p className="font-mono text-xs">{service.id}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              <Link href={`/admin/services/${id}/studio`} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted">
                <Pencil className="h-4 w-4 text-muted-foreground" /> Edit in Studio
              </Link>
              <Link href={`/admin/services/${id}/studio?step=2`} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted">
                <FileText className="h-4 w-4 text-primary" /> Edit Form
              </Link>
              <Link href={`/admin/services/${id}/studio?step=3`} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted">
                <GitBranch className="h-4 w-4 text-purple-400" /> Edit Workflow
              </Link>
              {requests.length > 0 && (
                <Link href={`/admin/requests?service=${id}`} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted">
                  <Inbox className="h-4 w-4 text-amber-400" /> View Requests ({requests.length})
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Service, FormField, WorkflowStage } from "@/lib/types";
import { formatSlaSummary, getCategoryColor, serviceVisibilityLabel } from "@/lib/utils";
import { Check, AlertTriangle, Pencil, ArrowRight, Rocket, Loader2 } from "lucide-react";

interface StepReviewProps {
  service: Service;
  formFields: FormField[];
  workflowStages: WorkflowStage[];
  /** Linked workflow record name from the store (spec: show on review). */
  workflowName?: string;
  onEdit: (step: number) => void;
  onPublish: () => void;
  isPublishing?: boolean;
}

interface CheckItem {
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
}

export function StepReview({
  service,
  formFields,
  workflowStages,
  workflowName,
  onEdit,
  onPublish,
  isPublishing = false,
}: StepReviewProps) {
  const taskStages = workflowStages.filter((s) => s.type === "task");
  const unassigned = taskStages.filter((s) => !s.assignee);

  const checks: CheckItem[] = [
    {
      label: "Service details complete",
      status: service.name && service.description && service.category ? "pass" : "fail",
      detail: service.name ? `${service.name} — ${service.category.toUpperCase()}` : "Missing name or description",
    },
    {
      label: "Request form configured",
      status: formFields.length > 0 ? "pass" : "warn",
      detail: formFields.length > 0 ? `${formFields.length} fields defined` : "No fields — requesters won't provide any info",
    },
    {
      label: "Workflow configured",
      status: workflowStages.length > 0 ? "pass" : "warn",
      detail:
        workflowStages.length > 0
          ? `${workflowStages.length} stages in workflow graph`
          : "No workflow stages yet",
    },
    {
      label: "SLA defined",
      status: service.sla.responseTime > 0 && service.sla.resolutionTime > 0 ? "pass" : "fail",
      detail: formatSlaSummary(service.sla),
    },
    {
      label: "All task stages have assignees",
      status: unassigned.length === 0 ? "pass" : "warn",
      detail: unassigned.length === 0 ? "All tasks assigned" : `${unassigned.length} task(s) unassigned`,
    },
  ];

  const hasErrors = checks.some((c) => c.status === "fail");
  const allPass = checks.every((c) => c.status === "pass");

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-6 py-8">
      <div className="rounded-xl border border-border/80 bg-gradient-to-br from-slate-50 to-slate-100/80 p-5 dark:from-slate-950 dark:to-slate-900/80">
        <h2 className="text-lg font-semibold text-foreground">Review & Publish</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Confirm details, form, and workflow — then publish to the catalog (if visibility is public).
        </p>
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              <span className="text-sm font-semibold">Service Details</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onEdit(1)} className="h-7 gap-1 text-xs">
              <Pencil className="h-3 w-3" /> Edit
            </Button>
          </div>
          <div className="ml-6 mt-3 space-y-1 text-sm">
            <p><span className="text-muted-foreground">Name:</span> {service.name || "—"}</p>
            <p>
              <span className="text-muted-foreground">Category:</span>{" "}
              <Badge variant="secondary" className={`${getCategoryColor(service.category)} text-[10px]`}>
                {service.category.toUpperCase()}
              </Badge>
            </p>
            <p>
              <span className="text-muted-foreground">Visibility:</span>{" "}
              {serviceVisibilityLabel(service.visibility)}
            </p>
            <p><span className="text-muted-foreground">SLA:</span> {formatSlaSummary(service.sla)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {formFields.length > 0 ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-warning" />
              )}
              <span className="text-sm font-semibold">Request Form ({formFields.length} fields)</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onEdit(2)} className="h-7 gap-1 text-xs">
              <Pencil className="h-3 w-3" /> Edit
            </Button>
          </div>
          {formFields.length > 0 && (
            <div className="ml-6 mt-3 space-y-1">
              {[...formFields].sort((a, b) => a.order - b.order).map((f, i) => (
                <p key={f.id} className="text-sm">
                  <span className="text-muted-foreground">{i + 1}.</span> {f.label}{" "}
                  <span className="text-xs text-muted-foreground">({f.type}{f.required ? ", required" : ""})</span>
                </p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {workflowStages.length > 0 ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-warning" />
              )}
              <span className="text-sm font-semibold">Workflow ({workflowStages.length} stages)</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onEdit(3)} className="h-7 gap-1 text-xs">
              <Pencil className="h-3 w-3" /> Edit
            </Button>
          </div>
          {workflowName && (
            <p className="ml-6 mt-2 text-xs text-muted-foreground">
              Linked workflow: <span className="font-medium text-foreground">{workflowName}</span>
            </p>
          )}
          {workflowStages.length > 0 && (
            <div className="ml-6 mt-3 flex flex-wrap items-center gap-1.5">
              {workflowStages.map((s, i) => (
                <div key={s.id} className="flex items-center gap-1.5">
                  {i > 0 && <ArrowRight className="h-3 w-3 text-muted-foreground/40" />}
                  <span className="text-sm">{s.name}</span>
                  <span className="text-[10px] uppercase text-muted-foreground">({s.type})</span>
                  {s.assignee && (
                    <span className="text-xs text-muted-foreground">— {s.assignee}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className={hasErrors ? "border-destructive/30 bg-destructive/5" : allPass ? "border-success/30 bg-success/5" : "border-warning/30 bg-warning/5"}>
        <CardContent className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Publish Checklist</h3>
          <div className="space-y-2">
            {checks.map((check, i) => (
              <div key={i} className="flex items-center gap-2.5">
                {check.status === "pass" ? (
                  <Check className="h-4 w-4 shrink-0 text-success" />
                ) : check.status === "warn" ? (
                  <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
                ) : (
                  <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
                )}
                <div>
                  <p className="text-sm">{check.label}</p>
                  <p className="text-xs text-muted-foreground">{check.detail}</p>
                </div>
              </div>
            ))}
          </div>
          {allPass && (
            <p className="mt-3 text-sm font-medium text-success">All checks passed. Ready to publish.</p>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between pt-2">
        <p className="max-w-sm text-xs text-muted-foreground">
          After publishing, this service will appear in the requester catalog and employees can start submitting requests immediately.
        </p>
        <Button
          onClick={onPublish}
          disabled={hasErrors || isPublishing}
          className="gap-1.5"
          size="lg"
        >
          {isPublishing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Rocket className="h-4 w-4" />
          )}{" "}
          Publish Service
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTasheelStore } from "@/lib/store";
import { WorkflowFlowDesigner } from "@/components/admin/workflow-flow-designer";
import { WorkflowTemplateCards } from "@/components/admin/service-studio/workflow-template-cards";
import { extractStagesFromFlow } from "@/lib/workflow-graph-utils";
import { resolveWorkflowInitialDefinition } from "@/lib/workflow-resolve-initial";
import type { FormField } from "@/lib/types";
import type { WorkflowFlowDefinition } from "@/lib/workflow-flow-types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface StudioWorkflowStepProps {
  serviceId: string;
  serviceName: string;
  formFields: FormField[];
}

export function StudioWorkflowStep({
  serviceId,
  serviceName,
  formFields,
}: StudioWorkflowStepProps) {
  const workflows = useTasheelStore((s) => s.workflows);
  const services = useTasheelStore((s) => s.services);
  const updateWorkflow = useTasheelStore((s) => s.updateWorkflow);

  const service = services.find((s) => s.id === serviceId);
  const workflowId = service?.workflowId ?? null;
  const linkedWorkflow = workflowId
    ? workflows.find((w) => w.id === workflowId)
    : undefined;

  const initialDefinition = useMemo(
    () =>
      resolveWorkflowInitialDefinition(
        linkedWorkflow?.flowDefinition ?? null,
        linkedWorkflow?.stages ?? []
      ),
    [linkedWorkflow?.flowDefinition, linkedWorkflow?.stages]
  );

  const [definitionEpoch, setDefinitionEpoch] = useState(0);

  function handleSave(def: WorkflowFlowDefinition) {
    if (!workflowId || !linkedWorkflow) {
      toast.error("Workflow is not ready yet. Wait a moment and try again.");
      return;
    }
    const stages = extractStagesFromFlow(def.nodes, def.edges);
    updateWorkflow(workflowId, {
      flowDefinition: def,
      stages,
    });
    toast.success("Workflow saved");
  }

  function handleApplyTemplate(def: WorkflowFlowDefinition) {
    if (!workflowId || !linkedWorkflow) {
      toast.error("Workflow is not ready yet. Wait a moment and try again.");
      return;
    }
    const stages = extractStagesFromFlow(def.nodes, def.edges);
    updateWorkflow(workflowId, {
      flowDefinition: def,
      stages,
    });
    setDefinitionEpoch((n) => n + 1);
    toast.success("Template applied — adjust nodes as needed and save.");
  }

  if (!service) {
    return (
      <div className="px-6 py-12 text-center text-sm text-muted-foreground">
        Preparing service…
      </div>
    );
  }

  if (!workflowId || !linkedWorkflow) {
    return (
      <div className="px-6 py-12 text-center text-sm text-muted-foreground">
        Creating workflow…
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col px-2 pb-4">
      <div className="mb-2 flex flex-col gap-3 px-4 pt-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Workflow</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Design the process visually. Use the full canvas for complex diagrams.
          </p>
        </div>
        <Link
          href={`/admin/services/${serviceId}/workflow`}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-9 shrink-0 gap-1.5"
          )}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Full workflow editor
        </Link>
      </div>

      <WorkflowTemplateCards onApply={handleApplyTemplate} />

      <WorkflowFlowDesigner
        key={`${workflowId}-${definitionEpoch}`}
        variant="embedded"
        serviceId={serviceId}
        serviceName={serviceName.trim() || "Service"}
        formFields={formFields}
        initialDefinition={initialDefinition}
        onSave={handleSave}
        backHref={`/admin/services/${serviceId}`}
      />
    </div>
  );
}

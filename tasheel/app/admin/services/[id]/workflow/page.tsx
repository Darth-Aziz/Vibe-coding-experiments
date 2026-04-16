"use client";

import { use } from "react";
import { useTasheelStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WorkflowFlowDesigner } from "@/components/admin/workflow-flow-designer";
import { extractStagesFromFlow } from "@/lib/workflow-graph-utils";
import { resolveWorkflowInitialDefinition } from "@/lib/workflow-resolve-initial";
import type { WorkflowFlowDefinition } from "@/lib/workflow-flow-types";
import Link from "next/link";
import { ArrowLeft, ChevronRight, GitBranch, Link2 } from "lucide-react";
import { toast } from "sonner";

export default function WorkflowDesignerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const service = useTasheelStore((s) => s.services.find((svc) => svc.id === id));
  const workflows = useTasheelStore((s) => s.workflows);
  const updateWorkflow = useTasheelStore((s) => s.updateWorkflow);
  const addWorkflow = useTasheelStore((s) => s.addWorkflow);
  const linkWorkflowToService = useTasheelStore((s) => s.linkWorkflowToService);

  if (!service) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Service not found.</p>
      </div>
    );
  }

  const linkedWorkflow = workflows.find((w) => w.id === service.workflowId);
  const initialDefinition = resolveWorkflowInitialDefinition(
    linkedWorkflow?.flowDefinition ?? null,
    linkedWorkflow?.stages ?? []
  );

  function handleSave(def: WorkflowFlowDefinition) {
    const stages = extractStagesFromFlow(def.nodes, def.edges);

    if (linkedWorkflow) {
      updateWorkflow(linkedWorkflow.id, {
        flowDefinition: def,
        stages,
      });
      toast.success("Workflow saved successfully");
    } else {
      const newWorkflowId = `wf-${Date.now()}`;
      addWorkflow({
        id: newWorkflowId,
        name: `${service!.name} Workflow`,
        description: `Workflow for ${service!.name}`,
        flowDefinition: def,
        stages,
        createdAt: new Date().toISOString(),
      });
      linkWorkflowToService(id, newWorkflowId);
      toast.success("Workflow created and linked to service");
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/admin/services/${id}`}>
            <Button variant="ghost" size="sm" className="h-8">
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
            </Button>
          </Link>
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/admin/services" className="transition-colors hover:text-foreground">
              Services
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={`/admin/services/${id}`} className="transition-colors hover:text-foreground">
              {service.name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-foreground">Workflow</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {linkedWorkflow ? (
            <Badge variant="secondary" className="gap-1.5 bg-emerald-50 text-emerald-700">
              <Link2 className="h-3 w-3" />
              Linked: {linkedWorkflow.name}
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1.5 bg-amber-50 text-amber-700">
              <GitBranch className="h-3 w-3" />
              New workflow (save to link)
            </Badge>
          )}
        </div>
      </div>

      <WorkflowFlowDesigner
        key={linkedWorkflow?.id ?? "new"}
        serviceId={id}
        serviceName={service.name}
        formFields={service.formFields}
        initialDefinition={initialDefinition}
        onSave={handleSave}
        backHref={`/admin/services/${id}`}
      />
    </div>
  );
}

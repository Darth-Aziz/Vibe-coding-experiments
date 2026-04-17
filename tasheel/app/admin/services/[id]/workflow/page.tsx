"use client";

import { use } from "react";
import { useTasheelStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { WorkflowFlowDesigner } from "@/components/admin/workflow-flow-designer";
import { extractStagesFromFlow } from "@/lib/workflow-graph-utils";
import { resolveWorkflowInitialDefinition } from "@/lib/workflow-resolve-initial";
import type { WorkflowFlowDefinition } from "@/lib/workflow-flow-types";
import { GitBranch, Link2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";

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
      <PageHeader
        breadcrumb={[
          { label: "Services", href: "/admin/services" },
          { label: service.name, href: `/admin/services/${id}` },
          { label: "Workflow" },
        ]}
        title="Workflow designer"
        description={`Edit the BPMN-style flow for ${service.name}. Saving publishes stages used in request routing.`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {linkedWorkflow ? (
              <Badge
                variant="secondary"
                className="gap-1.5 bg-emerald-50 text-emerald-700"
              >
                <Link2 className="h-3 w-3" />
                Linked: {linkedWorkflow.name}
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="gap-1.5 bg-amber-50 text-amber-700"
              >
                <GitBranch className="h-3 w-3" />
                New workflow (save to link)
              </Badge>
            )}
          </div>
        }
      />

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

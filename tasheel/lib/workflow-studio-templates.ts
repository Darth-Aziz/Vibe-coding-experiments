import { buildFlowDefinitionFromStages, getMinimalDefaultFlowDefinition } from "@/lib/workflow-graph-utils";
import type { WorkflowFlowDefinition } from "@/lib/workflow-flow-types";

export interface WorkflowStudioTemplate {
  id: string;
  title: string;
  description: string;
  build: () => WorkflowFlowDefinition;
}

export const WORKFLOW_STUDIO_TEMPLATES: WorkflowStudioTemplate[] = [
  {
    id: "simple",
    title: "Simple approval",
    description: "One reviewer, then complete — good for straightforward requests.",
    build: () => getMinimalDefaultFlowDefinition(),
  },
  {
    id: "it-triage",
    title: "IT triage",
    description: "IT triage followed by fulfillment — typical for hardware or access.",
    build: () =>
      buildFlowDefinitionFromStages([
        { id: "s0", name: "Start", type: "start", order: 0 },
        {
          id: "s1",
          name: "IT triage",
          type: "task",
          order: 1,
          assignee: "IT Support",
        },
        {
          id: "s2",
          name: "Fulfillment",
          type: "task",
          order: 2,
          assignee: "Technician",
        },
        { id: "s3", name: "Complete", type: "end", order: 3 },
      ]),
  },
  {
    id: "hr-two-step",
    title: "HR + manager",
    description: "HR review, then manager sign-off — common for people workflows.",
    build: () =>
      buildFlowDefinitionFromStages([
        { id: "s0", name: "Start", type: "start", order: 0 },
        {
          id: "s1",
          name: "HR review",
          type: "task",
          order: 1,
          assignee: "HR",
        },
        {
          id: "s2",
          name: "Manager approval",
          type: "task",
          order: 2,
          assignee: "Manager",
        },
        { id: "s3", name: "Complete", type: "end", order: 3 },
      ]),
  },
];

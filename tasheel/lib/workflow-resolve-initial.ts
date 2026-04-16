import type { WorkflowFlowDefinition } from "./workflow-flow-types";
import type { WorkflowStage } from "./types";
import {
  buildFlowDefinitionFromStages,
  getMinimalDefaultFlowDefinition,
} from "./workflow-graph-utils";

/**
 * Resolves the React Flow graph to load in the designer from persisted workflow state.
 */
export function resolveWorkflowInitialDefinition(
  flowDefinition: WorkflowFlowDefinition | null | undefined,
  stages: WorkflowStage[]
): WorkflowFlowDefinition {
  if (flowDefinition && flowDefinition.version === 1 && flowDefinition.nodes.length > 0) {
    return flowDefinition;
  }
  if (stages.length > 0) {
    return buildFlowDefinitionFromStages(stages);
  }
  return getMinimalDefaultFlowDefinition();
}

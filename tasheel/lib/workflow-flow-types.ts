import type { Edge, Node } from "@xyflow/react";

export type WorkflowNodeKind = "start" | "end" | "task" | "gateway";

export type WorkflowTaskKind = "approval" | "task";

export type WorkflowActionType = "email" | "webhook" | "update_record" | "slack";

export interface WorkflowAction {
  id: string;
  type: WorkflowActionType;
  label: string;
  variableMap: Record<string, string>;
}

export interface GatewayCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export type SimulationNodeStatus = "active" | "completed" | "skipped";

export interface StartEndFlowData extends Record<string, unknown> {
  label: string;
  simStatus?: SimulationNodeStatus;
}

export interface TaskFlowData extends Record<string, unknown> {
  label: string;
  taskType: WorkflowTaskKind;
  assignee?: string;
  actions: WorkflowAction[];
  simStatus?: SimulationNodeStatus;
}

export interface GatewayFlowData extends Record<string, unknown> {
  label: string;
  conditions: Record<string, GatewayCondition[]>;
  simStatus?: SimulationNodeStatus;
}

export type WorkflowNodeData = StartEndFlowData | TaskFlowData | GatewayFlowData;

export type WorkflowFlowNode = Node<WorkflowNodeData, WorkflowNodeKind>;

export type WorkflowFlowEdge = Edge;

export interface WorkflowFlowDefinition {
  version: 1;
  nodes: WorkflowFlowNode[];
  edges: WorkflowFlowEdge[];
}

export function isTaskFlowData(
  data: WorkflowNodeData,
  nodeType: WorkflowNodeKind | undefined
): data is TaskFlowData {
  return nodeType === "task";
}

export function isGatewayFlowData(
  data: WorkflowNodeData,
  nodeType: WorkflowNodeKind | undefined
): data is GatewayFlowData {
  return nodeType === "gateway";
}

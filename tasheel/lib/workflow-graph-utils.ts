import { MarkerType } from "@xyflow/react";
import type {
  GatewayFlowData,
  TaskFlowData,
  WorkflowFlowDefinition,
  WorkflowFlowEdge,
  WorkflowFlowNode,
  WorkflowNodeKind,
} from "./workflow-flow-types";
import type { WorkflowStage } from "./types";

const HANDLE_ORDER: Record<string, number> = {
  top: 0,
  right: 1,
  bottom: 2,
  left: 3,
};

function edgeSortKey(e: WorkflowFlowEdge): number {
  const h = e.sourceHandle ?? "";
  return HANDLE_ORDER[h] ?? 99;
}

function sortOutgoingEdges(edges: WorkflowFlowEdge[], sourceId: string): WorkflowFlowEdge[] {
  return edges.filter((e) => e.source === sourceId).sort((a, b) => edgeSortKey(a) - edgeSortKey(b));
}

/**
 * Produces `WorkflowStage[]` for Zustand-backed request progression.
 * Uses BFS from the start node; outgoing edges are ordered by handle (top → right → bottom → left).
 * Limitation: for XOR forks, `advanceRequest` still walks this flat list in order—parallel branches are
 * a demo constraint; a real engine would track active tokens per branch.
 */
export function extractStagesFromFlow(
  nodes: WorkflowFlowNode[],
  edges: WorkflowFlowEdge[]
): WorkflowStage[] {
  const start = nodes.find((n) => n.type === "start");
  if (!start) return [];

  const outgoingBySource = new Map<string, string[]>();
  for (const n of nodes) {
    const outs = sortOutgoingEdges(edges, n.id).map((e) => e.target);
    outgoingBySource.set(n.id, outs);
  }

  const visited = new Set<string>();
  const order: string[] = [];
  const queue: string[] = [start.id];

  while (queue.length > 0) {
    const id = queue.shift();
    if (!id || visited.has(id)) continue;
    visited.add(id);
    order.push(id);
    for (const tgt of outgoingBySource.get(id) ?? []) {
      if (!visited.has(tgt)) queue.push(tgt);
    }
  }

  return order.map((id, index) => {
    const node = nodes.find((x) => x.id === id);
    if (!node) {
      return { id, name: id, type: "task" as const, order: index };
    }
    const stageType = nodeTypeToStageType(node.type);
    const name = getNodeLabel(node);
    const assignee =
      node.type === "task" && "assignee" in node.data
        ? (node.data as TaskFlowData).assignee
        : undefined;
    return {
      id: node.id,
      name,
      type: stageType,
      order: index,
      ...(assignee ? { assignee } : {}),
    };
  });
}

function nodeTypeToStageType(type: WorkflowNodeKind): WorkflowStage["type"] {
  if (type === "start") return "start";
  if (type === "end") return "end";
  if (type === "gateway") return "gateway";
  return "task";
}

function getNodeLabel(node: WorkflowFlowNode): string {
  const d = node.data;
  if ("label" in d && typeof d.label === "string") return d.label;
  return node.id;
}

/** Linear layout from existing stages when no graph is saved yet. */
export function buildFlowDefinitionFromStages(stages: WorkflowStage[]): WorkflowFlowDefinition {
  const nodes: WorkflowFlowNode[] = [];
  const edges: WorkflowFlowEdge[] = [];
  let x = 40;
  const y = 220;

  for (const s of stages) {
    const kind = stageTypeToNodeKind(s.type);
    const id = s.id;
    if (kind === "task") {
      const data: TaskFlowData = {
        label: s.name,
        taskType: "approval",
        assignee: s.assignee,
        actions: [],
      };
      nodes.push({ id, type: "task", position: { x, y }, data });
    } else if (kind === "gateway") {
      const data: GatewayFlowData = { label: s.name, conditions: {} };
      nodes.push({ id, type: "gateway", position: { x, y }, data });
    } else if (kind === "start") {
      nodes.push({
        id,
        type: "start",
        position: { x, y },
        data: { label: s.name },
      });
    } else {
      nodes.push({
        id,
        type: "end",
        position: { x, y },
        data: { label: s.name },
      });
    }
    x += 200;
  }

  for (let i = 0; i < nodes.length - 1; i++) {
    const a = nodes[i];
    const b = nodes[i + 1];
    edges.push({
      id: `e-${a.id}-${b.id}`,
      source: a.id,
      target: b.id,
      type: "smoothstep",
      markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
      style: { stroke: "#94a3b8", strokeWidth: 1.5 },
    });
  }

  return { version: 1, nodes, edges };
}

/** Simple linear Start → Task → End for brand-new workflows (studio and empty workflow routes). */
export function getMinimalDefaultFlowDefinition(): WorkflowFlowDefinition {
  return buildFlowDefinitionFromStages([
    { id: "st-start", name: "Start", type: "start", order: 0 },
    {
      id: "st-task",
      name: "Review request",
      type: "task",
      order: 1,
      assignee: "Manager",
    },
    { id: "st-end", name: "Complete", type: "end", order: 2 },
  ]);
}

function stageTypeToNodeKind(t: WorkflowStage["type"]): WorkflowNodeKind {
  if (t === "start") return "start";
  if (t === "end") return "end";
  if (t === "gateway") return "gateway";
  return "task";
}

/** Reference laptop approval graph (BPMN zip prototype). */
export function getDefaultLaptopFlowDefinition(): WorkflowFlowDefinition {
  const nodes: WorkflowFlowNode[] = [
    { id: "1", type: "start", position: { x: 50, y: 250 }, data: { label: "Request Submitted" } },
    {
      id: "2",
      type: "task",
      position: { x: 180, y: 202 },
      data: {
        label: "Line Manager Approval",
        taskType: "approval",
        assignee: "Manager",
        actions: [
          {
            id: "a1",
            type: "email",
            label: "Notify Manager via Email",
            variableMap: {
              to: "{{form.manager_email}}",
              subject: "Approval Required: {{form.employee_name}}",
              body: "Please review request {{sys.request_id}}",
            },
          },
          {
            id: "a2",
            type: "update_record",
            label: "Set Status: Pending Approval",
            variableMap: { field: "status", value: "pending_approval" },
          },
        ],
      },
    },
    {
      id: "3",
      type: "gateway",
      position: { x: 520, y: 236 },
      data: {
        label: "Is Approved?",
        conditions: {
          top: [
            {
              id: "c1",
              field: "wf.approval_decision",
              operator: "equals",
              value: "approved",
            },
          ],
          bottom: [
            {
              id: "c2",
              field: "wf.approval_decision",
              operator: "equals",
              value: "rejected",
            },
          ],
        },
      },
    },
    {
      id: "4",
      type: "task",
      position: { x: 650, y: 80 },
      data: {
        label: "IT Fulfillment",
        taskType: "task",
        assignee: "IT Team",
        actions: [
          {
            id: "a3",
            type: "webhook",
            label: "POST to Jira (Create Issue)",
            variableMap: {
              url: "https://jira.company.com/api/issue",
              method: "POST",
              payload:
                '{"summary": "{{form.laptop_model}} for {{form.employee_name}}", "priority": "{{form.priority}}"}',
            },
          },
          {
            id: "a4",
            type: "slack",
            label: "Alert #it-ops channel",
            variableMap: {
              channel: "#it-ops",
              message:
                "New fulfillment: {{form.laptop_model}} for {{form.employee_name}} ({{sys.request_id}})",
            },
          },
        ],
      },
    },
    {
      id: "5",
      type: "task",
      position: { x: 650, y: 340 },
      data: {
        label: "Notify Rejection",
        taskType: "task",
        assignee: "System",
        actions: [
          {
            id: "a5",
            type: "email",
            label: "Send Rejection Email",
            variableMap: {
              to: "{{sys.submitter_email}}",
              subject: "Request {{sys.request_id}} Denied",
              body: "Your request was rejected. Comments: {{wf.approval_comments}}",
            },
          },
          {
            id: "a6",
            type: "update_record",
            label: "Close Request (Denied)",
            variableMap: { field: "status", value: "rejected" },
          },
        ],
      },
    },
    { id: "6", type: "end", position: { x: 1000, y: 122 }, data: { label: "Fulfilled" } },
    { id: "7", type: "end", position: { x: 1000, y: 382 }, data: { label: "Rejected" } },
  ];

  const edges: WorkflowFlowEdge[] = [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      type: "smoothstep",
      markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
      style: { stroke: "#94a3b8", strokeWidth: 1.5 },
    },
    {
      id: "e2-3",
      source: "2",
      target: "3",
      type: "smoothstep",
      markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
      style: { stroke: "#94a3b8", strokeWidth: 1.5 },
    },
    {
      id: "e3-4",
      source: "3",
      target: "4",
      sourceHandle: "top",
      type: "smoothstep",
      label: "Yes",
      labelStyle: { fill: "#334155", fontSize: 11, fontWeight: 600 },
      labelBgStyle: {
        fill: "#ffffff",
        fillOpacity: 0.9,
        stroke: "#e2e8f0",
        strokeWidth: 1,
      },
      labelBgPadding: [6, 4] as [number, number],
      markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" },
      style: { stroke: "#10b981", strokeWidth: 1.5 },
      animated: true,
    },
    {
      id: "e3-5",
      source: "3",
      target: "5",
      sourceHandle: "bottom",
      type: "smoothstep",
      label: "No",
      labelStyle: { fill: "#334155", fontSize: 11, fontWeight: 600 },
      labelBgStyle: {
        fill: "#ffffff",
        fillOpacity: 0.9,
        stroke: "#e2e8f0",
        strokeWidth: 1,
      },
      labelBgPadding: [6, 4] as [number, number],
      markerEnd: { type: MarkerType.ArrowClosed, color: "#ef4444" },
      style: { stroke: "#ef4444", strokeWidth: 1.5 },
    },
    {
      id: "e4-6",
      source: "4",
      target: "6",
      type: "smoothstep",
      markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
      style: { stroke: "#94a3b8", strokeWidth: 1.5 },
    },
    {
      id: "e5-7",
      source: "5",
      target: "7",
      type: "smoothstep",
      markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
      style: { stroke: "#94a3b8", strokeWidth: 1.5 },
    },
  ];

  return { version: 1, nodes, edges };
}

export type SimDecision = "approved" | "rejected";

/**
 * Node ids along one path for UI simulation (approved: top/Yes edge from gateway; rejected: bottom/No).
 * Does not evaluate `conditions` against runtime data—that would be a future engine feature.
 */
export function computeSimulationNodePath(
  nodes: WorkflowFlowNode[],
  edges: WorkflowFlowEdge[],
  decision: SimDecision
): string[] {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const start = nodes.find((n) => n.type === "start");
  if (!start) return [];

  const path: string[] = [];
  let currentId: string | null = start.id;

  while (currentId) {
    path.push(currentId);
    const current = byId.get(currentId);
    if (!current || current.type === "end") break;

    const outgoing = edges.filter((e) => e.source === currentId);
    if (outgoing.length === 0) break;

    let next: WorkflowFlowEdge;
    if (current.type === "gateway") {
      if (decision === "approved") {
        next =
          outgoing.find(
            (e) => e.sourceHandle === "top" || String(e.label ?? "").toLowerCase() === "yes"
          ) ?? outgoing[0];
      } else {
        next =
          outgoing.find(
            (e) => e.sourceHandle === "bottom" || String(e.label ?? "").toLowerCase() === "no"
          ) ?? outgoing[outgoing.length - 1];
      }
    } else {
      next = sortOutgoingEdges(outgoing, currentId)[0];
    }
    currentId = next.target;
  }

  return path;
}

export function getSkippedNodeIds(allIds: string[], pathIds: string[]): string[] {
  const inPath = new Set(pathIds);
  return allIds.filter((id) => !inPath.has(id));
}

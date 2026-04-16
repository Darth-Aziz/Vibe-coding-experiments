"use client";

import "@xyflow/react/dist/style.css";

import {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Node,
} from "@xyflow/react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  GitBranch,
  GripVertical,
  History,
  Layers,
  Link2,
  MousePointerClick,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Save,
  Search,
  Settings,
  Settings2,
  Split,
  Square,
  Trash2,
  User,
  Variable,
  Workflow,
  X,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FormField } from "@/lib/types";
import type {
  GatewayCondition,
  SimulationNodeStatus,
  TaskFlowData,
  WorkflowAction,
  WorkflowActionType,
  WorkflowFlowDefinition,
  WorkflowFlowEdge,
  WorkflowFlowNode,
} from "@/lib/workflow-flow-types";
import {
  isGatewayFlowData,
  isTaskFlowData,
} from "@/lib/workflow-flow-types";
import {
  computeSimulationNodePath,
  getSkippedNodeIds,
  type SimDecision,
} from "@/lib/workflow-graph-utils";
import Link from "next/link";
import {
  ACTION_TYPE_META,
  ASSIGNEE_OPTIONS,
  getActionFieldKeys,
} from "./workflow-flow-config";
import { WorkflowConditionRow } from "./workflow-condition-row";
import { workflowFlowNodeTypes } from "./workflow-flow-nodes";
import { WorkflowVariablePicker } from "./workflow-variable-picker";

interface SimulationStepState {
  nodeId: string;
  label: string;
  type: string;
  status: "pending" | "active" | "completed" | "skipped";
  timestamp: string;
  duration?: number;
  detail?: string;
}

interface SimulationRunMock {
  id: string;
  name: string;
  timestamp: string;
  status: "completed" | "failed" | "running";
  steps: { type: string }[];
  duration: number;
}

const MOCK_HISTORY: SimulationRunMock[] = [
  {
    id: "run_001",
    name: "Approval path (approved)",
    timestamp: "2026-04-16T09:32:00Z",
    status: "completed",
    steps: [
      { type: "start" },
      { type: "task" },
      { type: "gateway" },
      { type: "task" },
      { type: "end" },
    ],
    duration: 4460,
  },
  {
    id: "run_002",
    name: "Rejection path",
    timestamp: "2026-04-15T14:12:00Z",
    status: "completed",
    steps: [
      { type: "start" },
      { type: "task" },
      { type: "gateway" },
      { type: "task" },
      { type: "end" },
    ],
    duration: 7675,
  },
];

const paletteItems: {
  type: string;
  label: string;
  icon: typeof Circle;
  desc: string;
  data?: Record<string, unknown>;
}[] = [
  { type: "start", label: "Start Event", icon: Circle, desc: "Triggers workflow" },
  {
    type: "task",
    label: "User Task",
    icon: User,
    desc: "Human approval or input",
    data: { taskType: "approval", actions: [] },
  },
  {
    type: "task",
    label: "Service Task",
    icon: Settings2,
    desc: "Automated system action",
    data: { taskType: "task", actions: [] },
  },
  { type: "gateway", label: "Exclusive Gateway", icon: Split, desc: "XOR branching" },
  { type: "end", label: "End Event", icon: Square, desc: "Ends a path" },
];

function cloneDef(def: WorkflowFlowDefinition): WorkflowFlowDefinition {
  return JSON.parse(JSON.stringify(def)) as WorkflowFlowDefinition;
}

let nodeIdCounter = 100;
function nextNodeId(): string {
  return `dndnode_${nodeIdCounter++}`;
}

function WorkflowFlowDesignerInner({
  serviceId,
  serviceName,
  formFields,
  initialDefinition,
  onSave,
  backHref,
  variant = "page",
}: {
  serviceId: string;
  serviceName: string;
  formFields: FormField[];
  initialDefinition: WorkflowFlowDefinition;
  onSave: (def: WorkflowFlowDefinition) => void;
  backHref: string;
  variant?: "page" | "embedded";
}) {
  const embedded = variant === "embedded";
  const baseline = useMemo(
    () => cloneDef(initialDefinition),
    [initialDefinition]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowFlowNode>(
    baseline.nodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<WorkflowFlowEdge>(
    baseline.edges
  );

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const [selectedNode, setSelectedNode] = useState<WorkflowFlowNode | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<
    "settings" | "actions" | "conditions" | "variables"
  >("settings");

  const [triggerEvent, setTriggerEvent] = useState("on_submit");
  const [showTriggerPanel, setShowTriggerPanel] = useState(false);

  const [simMode, setSimMode] = useState(false);
  const [simRunning, setSimRunning] = useState(false);
  const [simSteps, setSimSteps] = useState<SimulationStepState[]>([]);
  const [simDecision, setSimDecision] = useState<SimDecision>("approved");
  const [showHistory, setShowHistory] = useState(false);
  const simTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setNodes(baseline.nodes);
    setEdges(baseline.edges);
    setSelectedNode(null);
    setSimMode(false);
    setSimRunning(false);
    setSimSteps([]);
    nodeIdCounter = 100;
  }, [baseline, serviceId, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "smoothstep",
            style: { stroke: "#94a3b8", strokeWidth: 1.5 },
            markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
          },
          eds
        )
      ),
    [setEdges]
  );

  const onDragStart = (
    event: React.DragEvent,
    nodeType: string,
    defaultData?: Record<string, unknown>
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    if (defaultData) {
      event.dataTransfer.setData(
        "application/reactflow-data",
        JSON.stringify(defaultData)
      );
    }
    event.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      const dataStr = event.dataTransfer.getData("application/reactflow-data");
      let extra: Record<string, unknown> = {};
      if (dataStr) {
        try {
          extra = JSON.parse(dataStr) as Record<string, unknown>;
        } catch {
          extra = {};
        }
      }
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: WorkflowFlowNode = {
        id: nextNodeId(),
        type: type as WorkflowFlowNode["type"],
        position,
        data:
          type === "task"
            ? {
                label: `New ${type}`,
                taskType: (extra.taskType as TaskFlowData["taskType"]) ?? "task",
                actions: (extra.actions as WorkflowAction[]) ?? [],
              }
            : type === "gateway"
              ? { label: `New ${type}`, conditions: {} }
              : { label: `New ${type}` },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes, screenToFlowPosition]
  );

  const onSelectionChange = useCallback(
    ({ nodes: sel }: { nodes: Node[] }) => {
      if (sel.length > 0) {
        const n = sel[0] as WorkflowFlowNode;
        setSelectedNode(n);
        if (n.type === "gateway") setActiveTab("conditions");
        else if (n.type === "task") setActiveTab("settings");
        else setActiveTab("settings");
      } else {
        setSelectedNode(null);
      }
    },
    []
  );

  const updateSelectedNode = (key: string, value: unknown) => {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: { ...node.data, [key]: value } as WorkflowFlowNode["data"],
          };
        }
        return node;
      })
    );
    setSelectedNode((prev) =>
      prev
        ? {
            ...prev,
            data: { ...prev.data, [key]: value } as WorkflowFlowNode["data"],
          }
        : null
    );
  };

  const addAction = () => {
    if (!selectedNode || !isTaskFlowData(selectedNode.data, selectedNode.type))
      return;
    const current = selectedNode.data.actions;
    const newAction: WorkflowAction = {
      id: `act_${Date.now()}`,
      type: "email",
      label: "New action",
      variableMap: {},
    };
    updateSelectedNode("actions", [...current, newAction]);
  };

  const updateAction = (actionId: string, key: string, value: unknown) => {
    if (!selectedNode || !isTaskFlowData(selectedNode.data, selectedNode.type))
      return;
    const updated = selectedNode.data.actions.map((a) =>
      a.id === actionId ? { ...a, [key]: value } : a
    );
    updateSelectedNode("actions", updated);
  };

  const updateActionVariable = (
    actionId: string,
    varKey: string,
    varValue: string
  ) => {
    if (!selectedNode || !isTaskFlowData(selectedNode.data, selectedNode.type))
      return;
    const updated = selectedNode.data.actions.map((a) => {
      if (a.id === actionId) {
        return {
          ...a,
          variableMap: { ...a.variableMap, [varKey]: varValue },
        };
      }
      return a;
    });
    updateSelectedNode("actions", updated);
  };

  const removeAction = (actionId: string) => {
    if (!selectedNode || !isTaskFlowData(selectedNode.data, selectedNode.type))
      return;
    updateSelectedNode(
      "actions",
      selectedNode.data.actions.filter((a) => a.id !== actionId)
    );
  };

  const getGatewayConditions = (handleId: string): GatewayCondition[] => {
    if (!selectedNode || !isGatewayFlowData(selectedNode.data, selectedNode.type))
      return [];
    const conditions = selectedNode.data.conditions;
    return conditions[handleId] ?? [];
  };

  const updateGatewayConditions = (
    handleId: string,
    next: GatewayCondition[]
  ) => {
    if (!selectedNode || !isGatewayFlowData(selectedNode.data, selectedNode.type))
      return;
    const all = { ...selectedNode.data.conditions, [handleId]: next };
    updateSelectedNode("conditions", all);
  };

  const addCondition = (handleId: string) => {
    const current = getGatewayConditions(handleId);
    updateGatewayConditions(handleId, [
      ...current,
      {
        id: `cond_${Date.now()}`,
        field: "",
        operator: "equals",
        value: "",
      },
    ]);
  };

  const updateCondition = (
    handleId: string,
    condId: string,
    key: string,
    value: string
  ) => {
    const current = getGatewayConditions(handleId);
    updateGatewayConditions(
      handleId,
      current.map((c) => (c.id === condId ? { ...c, [key]: value } : c))
    );
  };

  const removeCondition = (handleId: string, condId: string) => {
    const current = getGatewayConditions(handleId);
    updateGatewayConditions(
      handleId,
      current.filter((c) => c.id !== condId)
    );
  };

  const getOutgoingEdges = () => {
    if (!selectedNode) return [];
    return edges.filter((e) => e.source === selectedNode.id);
  };

  const resetSimulation = useCallback(() => {
    setSimMode(false);
    setSimRunning(false);
    setSimSteps([]);
    if (simTimerRef.current) clearTimeout(simTimerRef.current);
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: { ...n.data, simStatus: undefined } as WorkflowFlowNode["data"],
      }))
    );
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        animated: false,
        opacity: 1,
        style: {
          ...e.style,
          stroke: (e.style?.stroke as string) ?? "#94a3b8",
          strokeWidth: 1.5,
        },
      }))
    );
  }, [setNodes, setEdges]);

  /** Simulation v1: visual walkthrough only—path follows topology + approved/rejected, not live condition evaluation. */
  const startSimulation = useCallback(() => {
    const pathIds = computeSimulationNodePath(nodes, edges, simDecision);
    const skipped = getSkippedNodeIds(
      nodes.map((n) => n.id),
      pathIds
    );

    setSimMode(true);
    setSimRunning(true);

    const steps: SimulationStepState[] = pathIds.map((nodeId, i) => {
      const node = nodes.find((n) => n.id === nodeId);
      const label =
        node && "label" in node.data ? node.data.label : nodeId;
      const typ = node?.type ?? "task";
      return {
        nodeId,
        label,
        type: typ,
        status: "pending",
        timestamp: new Date(Date.now() + i * 1200).toLocaleTimeString(),
        duration: Math.floor(Math.random() * 2000) + 200,
        detail:
          typ === "gateway"
            ? `Evaluated: ${simDecision === "approved" ? "Yes" : "No"} path`
            : undefined,
      };
    });
    setSimSteps(steps);

    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          simStatus: skipped.includes(n.id)
            ? "skipped"
            : undefined,
        } as WorkflowFlowNode["data"],
      }))
    );

    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        style: { ...e.style, stroke: "#94a3b8", strokeWidth: 1.5 },
        animated: false,
        opacity: skipped.includes(e.target) ? 0.35 : 1,
      }))
    );

    let stepIdx = 0;
    const runStep = () => {
      if (stepIdx >= pathIds.length) {
        setSimRunning(false);
        return;
      }
      const currentNodeId = pathIds[stepIdx];

      setSimSteps((prev) =>
        prev.map((s, i) => ({
          ...s,
          status:
            i < stepIdx ? "completed" : i === stepIdx ? "active" : "pending",
        }))
      );

      setNodes((nds) =>
        nds.map((n) => {
          const pi = pathIds.indexOf(n.id);
          let simStatus: SimulationNodeStatus | undefined;
          if (n.id === currentNodeId) simStatus = "active";
          else if (pi >= 0 && pi < stepIdx) simStatus = "completed";
          else if (skipped.includes(n.id)) simStatus = "skipped";
          else simStatus = undefined;
          const data = { ...n.data };
          if (simStatus === undefined) {
            delete data.simStatus;
          } else {
            data.simStatus = simStatus;
          }
          return {
            ...n,
            data: data as WorkflowFlowNode["data"],
          };
        })
      );

      if (stepIdx > 0) {
        const prevId = pathIds[stepIdx - 1];
        const edgeBetween = edges.find(
          (e) => e.source === prevId && e.target === currentNodeId
        );
        if (edgeBetween) {
          setEdges((eds) =>
            eds.map((e) => ({
              ...e,
              animated: e.id === edgeBetween.id,
              style: {
                ...e.style,
                stroke:
                  e.id === edgeBetween.id ? "#2563eb" : e.style?.stroke ?? "#94a3b8",
                strokeWidth: e.id === edgeBetween.id ? 2.5 : 1.5,
              },
              opacity: skipped.includes(e.target) ? 0.35 : 1,
            }))
          );
        }
      }

      stepIdx++;
      simTimerRef.current = setTimeout(runStep, 1200);
    };

    runStep();
  }, [nodes, edges, simDecision, setNodes, setEdges]);

  const stopSimulation = () => {
    setSimRunning(false);
    if (simTimerRef.current) clearTimeout(simTimerRef.current);
  };

  useEffect(() => {
    return () => {
      if (simTimerRef.current) clearTimeout(simTimerRef.current);
    };
  }, []);

  const handlePersistSave = () => {
    onSave({ version: 1, nodes, edges });
  };

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-lg border border-border/60 bg-muted/10 ${
        embedded
          ? "min-h-[min(72vh,820px)] max-h-[min(90vh,960px)]"
          : "min-h-[calc(100vh-8rem)]"
      }`}
    >
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/40 bg-background/80 px-4 backdrop-blur-xl">
        <div className="flex min-w-0 items-center gap-3">
          {!embedded && (
            <>
              <Link href={backHref}>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="h-4 w-px bg-border/60" />
            </>
          )}
          <div className="flex min-w-0 items-center gap-2">
            <Workflow className="h-4 w-4 shrink-0 text-muted-foreground" />
            <h1 className="truncate text-sm font-semibold tracking-tight">
              {serviceName}
            </h1>
            <Badge variant="secondary" className="shrink-0 text-[10px] uppercase">
              Workflow
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => setShowTriggerPanel(!showTriggerPanel)}
          >
            <Link2 className="h-3.5 w-3.5" />
            Form trigger
          </Button>
          {!simMode ? (
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={() => setSimMode(true)}
            >
              <Play className="h-3.5 w-3.5 text-emerald-600" /> Simulate
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs text-destructive border-destructive/30 hover:bg-destructive/5"
              onClick={resetSimulation}
            >
              <X className="h-3.5 w-3.5" /> Exit sim
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="h-3.5 w-3.5" /> History
          </Button>
          <Button
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={handlePersistSave}
          >
            <Save className="h-3.5 w-3.5 opacity-80" /> Save workflow
          </Button>
        </div>
      </header>

      {showTriggerPanel && (
        <div className="border-b border-border/40 bg-background/90 px-4 py-3 backdrop-blur-xl">
          <div className="flex flex-wrap items-start gap-6">
            <div className="flex items-center gap-2 pt-0.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10">
                <Workflow className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <div className="text-xs font-semibold">Workflow trigger</div>
                <div className="text-[10px] text-muted-foreground">
                  Starts when the linked service form is submitted
                </div>
              </div>
            </div>
            <div className="grid min-w-[200px] flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Linked form
                </Label>
                <div className="rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                  Service form ({formFields.length} fields)
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Trigger event
                </Label>
                <Select value={triggerEvent} onValueChange={(v) => v && setTriggerEvent(v)}>
                  <SelectTrigger className="h-9 text-xs bg-background shadow-sm border-border/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on_submit" className="text-xs">
                      On form submission
                    </SelectItem>
                    <SelectItem value="on_update" className="text-xs">
                      On record update
                    </SelectItem>
                    <SelectItem value="on_status_change" className="text-xs">
                      On status change
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={() => setShowTriggerPanel(false)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-[260px] shrink-0 flex-col border-r border-border/40 bg-background/50 backdrop-blur-sm">
          {!simMode ? (
            <>
              <div className="p-4 pb-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                  <Input
                    placeholder="Filter elements..."
                    className="h-9 rounded-md border-border/60 bg-background/50 pl-9 text-xs shadow-sm"
                    disabled
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-3 pb-6">
                <h4 className="mb-2 flex items-center gap-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  <GitBranch className="h-3 w-3" /> BPMN elements
                </h4>
                <div className="grid gap-0.5">
                  {paletteItems.map((item, i) => (
                    <div
                      key={`${item.type}-${item.label}-${i}`}
                      draggable
                      onDragStart={(e) => onDragStart(e, item.type, item.data)}
                      className="group flex cursor-grab items-center gap-3 rounded-md border border-transparent px-2 py-2 text-left text-sm text-foreground transition-all hover:border-border/50 hover:bg-muted/60 active:cursor-grabbing"
                    >
                      <div className="flex h-8 w-8 shrink-0 flex-col items-center justify-center rounded border border-border/60 bg-background text-muted-foreground shadow-sm transition-colors group-hover:border-primary/30 group-hover:text-primary">
                        <item.icon className="h-4 w-4" strokeWidth={2} />
                      </div>
                      <div className="min-w-0 flex-1 flex-col">
                        <span className="truncate text-xs font-medium">{item.label}</span>
                        <span className="truncate text-[10px] text-muted-foreground">
                          {item.desc}
                        </span>
                      </div>
                      <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-40" />
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col">
              <div className="space-y-4 border-b border-border/40 p-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded border border-blue-500/20 bg-blue-500/10">
                    <Play className="ml-0.5 h-3 w-3 text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold">Simulation</span>
                  {simRunning && (
                    <Badge className="ml-auto animate-pulse border-0 bg-blue-500/10 text-[9px] text-blue-600">
                      Running
                    </Badge>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Simulated decision
                  </Label>
                  <Select
                    value={simDecision}
                    onValueChange={(v) => {
                      if (v) setSimDecision(v as SimDecision);
                    }}
                    disabled={simRunning}
                  >
                    <SelectTrigger className="h-9 text-xs bg-background shadow-sm border-border/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved" className="text-xs">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />{" "}
                          Approved path
                        </span>
                      </SelectItem>
                      <SelectItem value="rejected" className="text-xs">
                        <span className="flex items-center gap-2">
                          <XCircle className="h-3.5 w-3.5 text-destructive" />{" "}
                          Rejected path
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  {!simRunning ? (
                    <Button
                      size="sm"
                      className="h-8 flex-1 gap-1.5 bg-blue-600 text-xs text-white hover:bg-blue-700"
                      onClick={startSimulation}
                    >
                      <Play className="h-3.5 w-3.5" /> Run
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 flex-1 gap-1.5 text-xs"
                      onClick={stopSimulation}
                    >
                      <Pause className="h-3.5 w-3.5" /> Pause
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5 text-xs"
                    onClick={resetSimulation}
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Reset
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <h4 className="mb-3 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  <Layers className="h-3 w-3" /> Execution steps
                </h4>
                <div className="space-y-0">
                  {simSteps.map((step, i) => (
                    <div key={step.nodeId} className="relative flex gap-3">
                      {i < simSteps.length - 1 && (
                        <div
                          className={`absolute left-[11px] top-6 h-[calc(100%-8px)] w-0.5 ${
                            step.status === "completed"
                              ? "bg-emerald-500"
                              : step.status === "active"
                                ? "animate-pulse bg-blue-500"
                                : "bg-border"
                          }`}
                        />
                      )}
                      <div
                        className={`z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                          step.status === "completed"
                            ? "border-emerald-500 bg-emerald-500"
                            : step.status === "active"
                              ? "animate-pulse border-blue-500 bg-blue-500"
                              : "border-border bg-background"
                        }`}
                      >
                        {step.status === "completed" ? (
                          <Check className="h-3 w-3 text-white" />
                        ) : step.status === "active" ? (
                          <div className="h-2 w-2 rounded-full bg-white" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                        )}
                      </div>
                      <div className="flex-1 pb-5">
                        <div className="text-xs font-medium">{step.label}</div>
                        <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span className="font-mono">{step.timestamp}</span>
                          {step.duration !== undefined &&
                            step.status === "completed" && (
                              <span className="font-mono text-emerald-600">
                                +{step.duration}ms
                              </span>
                            )}
                        </div>
                        {step.detail && step.status !== "pending" && (
                          <div className="mt-1 rounded border border-border/40 bg-muted/50 px-2 py-1 font-mono text-[10px] text-muted-foreground">
                            {step.detail}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {simSteps.length === 0 && (
                    <p className="py-6 text-center text-xs text-muted-foreground">
                      Choose a path and click Run to simulate.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </aside>

        <main
          className="relative min-h-[480px] min-w-0 flex-1 bg-muted/10"
          ref={reactFlowWrapper}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onSelectionChange={onSelectionChange}
            nodeTypes={workflowFlowNodeTypes}
            fitView
            fitViewOptions={{ padding: 0.15 }}
            proOptions={{ hideAttribution: true }}
            minZoom={0.2}
            maxZoom={1.5}
            defaultEdgeOptions={{
              type: "smoothstep",
              style: { stroke: "#94a3b8", strokeWidth: 1.5 },
            }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={16}
              size={1}
              className="opacity-80"
            />
            <Controls
              className="overflow-hidden rounded-md border border-border/60 bg-background shadow-sm [&_svg]:fill-foreground"
              showInteractive={false}
            />
            <MiniMap
              className="mb-4 mr-4 overflow-hidden rounded-lg border border-border/60 bg-background shadow-sm"
              nodeColor={(n) => {
                if (n.data && "simStatus" in n.data && n.data.simStatus === "active")
                  return "#2563eb";
                if (n.data && "simStatus" in n.data && n.data.simStatus === "completed")
                  return "#10b981";
                if (n.type === "start") return "#10b981";
                if (n.type === "end") return "#ef4444";
                if (n.type === "gateway") return "#f59e0b";
                return "#cbd5e1";
              }}
            />
          </ReactFlow>
        </main>

        <aside className="flex w-[360px] shrink-0 flex-col border-l border-border/40 bg-background/80 backdrop-blur-xl">
          {selectedNode ? (
            <>
              <div className="flex h-14 shrink-0 items-center justify-between border-b border-border/40 px-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded border border-primary/20 bg-primary/10 text-primary">
                    <Settings className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-semibold tracking-tight">Properties</span>
                </div>
                <Badge variant="outline" className="font-mono text-[9px] uppercase">
                  {selectedNode.type}
                </Badge>
              </div>

              <div className="flex items-center gap-4 border-b border-border/40 px-4 pb-0 pt-3">
                <button
                  type="button"
                  className={`pb-2 text-xs font-medium transition-colors border-b-2 ${
                    activeTab === "settings"
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab("settings")}
                >
                  General
                </button>
                {selectedNode.type === "task" && (
                  <>
                    <button
                      type="button"
                      className={`flex items-center gap-1.5 pb-2 text-xs font-medium transition-colors border-b-2 ${
                        activeTab === "actions"
                          ? "border-primary text-foreground"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => setActiveTab("actions")}
                    >
                      Execution
                      <Badge variant="secondary" className="h-4 px-1 text-[9px] bg-muted">
                        {isTaskFlowData(selectedNode.data, selectedNode.type)
                          ? selectedNode.data.actions.length
                          : 0}
                      </Badge>
                    </button>
                    <button
                      type="button"
                      className={`flex items-center gap-1.5 pb-2 text-xs font-medium transition-colors border-b-2 ${
                        activeTab === "variables"
                          ? "border-primary text-foreground"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => setActiveTab("variables")}
                    >
                      <Variable className="h-3 w-3" /> Mapping
                    </button>
                  </>
                )}
                {selectedNode.type === "gateway" && (
                  <button
                    type="button"
                    className={`flex items-center gap-1.5 pb-2 text-xs font-medium transition-colors border-b-2 ${
                      activeTab === "conditions"
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setActiveTab("conditions")}
                  >
                    <Split className="h-3 w-3" /> Conditions
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="space-y-6 p-5">
                  {activeTab === "settings" && (
                    <div className="space-y-5">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                          Node label
                        </Label>
                        <Input
                          value={
                            "label" in selectedNode.data
                              ? selectedNode.data.label
                              : ""
                          }
                          onChange={(e) => updateSelectedNode("label", e.target.value)}
                          className="h-9 border-border/60 bg-background text-sm font-medium shadow-sm focus-visible:ring-1 focus-visible:ring-primary"
                        />
                      </div>
                      {selectedNode.type === "task" &&
                        isTaskFlowData(selectedNode.data, selectedNode.type) && (
                          <>
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                Task type
                              </Label>
                              <Select
                                value={selectedNode.data.taskType}
                                onValueChange={(v) =>
                                  v && updateSelectedNode("taskType", v)
                                }
                              >
                                <SelectTrigger className="h-9 border-border/60 bg-background text-xs font-medium shadow-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="approval">
                                    <span className="flex items-center gap-2">
                                      <User className="h-3.5 w-3.5 text-blue-500" />{" "}
                                      User task (manual)
                                    </span>
                                  </SelectItem>
                                  <SelectItem value="task">
                                    <span className="flex items-center gap-2">
                                      <Settings2 className="h-3.5 w-3.5 text-amber-500" />{" "}
                                      Service task (auto)
                                    </span>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {selectedNode.data.taskType === "approval" && (
                              <div className="space-y-1.5">
                                <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                  Assignee / group
                                </Label>
                                <Select
                                  value={selectedNode.data.assignee ?? ""}
                                  onValueChange={(v) => v && updateSelectedNode("assignee", v)}
                                >
                                  <SelectTrigger className="h-9 border-border/60 bg-background text-xs shadow-sm">
                                    <SelectValue placeholder="Select assignee..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {ASSIGNEE_OPTIONS.map((o) => (
                                      <SelectItem key={o.value} value={o.value}>
                                        {o.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </>
                        )}
                      {selectedNode.type === "gateway" && (
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                            Routing logic
                          </Label>
                          <div className="mt-1 flex items-start gap-2 rounded-md border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-relaxed text-amber-800 dark:text-amber-400/80">
                            <Split className="mt-0.5 h-4 w-4 shrink-0" />
                            Exclusive (XOR) gateway. Configure conditions per outgoing branch in
                            the Conditions tab.
                          </div>
                        </div>
                      )}
                      <Separator className="bg-border/50" />
                      <Button
                        variant="ghost"
                        className="h-8 w-full justify-start px-2.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => {
                          setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
                          setSelectedNode(null);
                        }}
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Delete node
                      </Button>
                    </div>
                  )}

                  {activeTab === "conditions" && selectedNode.type === "gateway" && (
                    <div className="space-y-5">
                      <p className="text-[11px] leading-relaxed text-muted-foreground">
                        Define conditions per outgoing path. First match at runtime selects the
                        branch (demo).
                      </p>
                      {getOutgoingEdges().map((edge) => {
                        const handleId = edge.sourceHandle ?? "right";
                        const conditions = getGatewayConditions(handleId);
                        const targetNode = nodes.find((n) => n.id === edge.target);
                        const edgeLabel =
                          (typeof edge.label === "string" ? edge.label : null) ??
                          (targetNode && "label" in targetNode.data
                            ? targetNode.data.label
                            : edge.target);
                        const isYes = String(edge.label ?? "").toLowerCase() === "yes";
                        const isNo = String(edge.label ?? "").toLowerCase() === "no";
                        return (
                          <div key={edge.id} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-2 w-2 rounded-full ${
                                  isYes
                                    ? "bg-emerald-500"
                                    : isNo
                                      ? "bg-destructive"
                                      : "bg-amber-500"
                                }`}
                              />
                              <span className="text-xs font-semibold">{edgeLabel}</span>
                              <ArrowRight className="h-3 w-3 text-muted-foreground" />
                              <span className="truncate text-xs text-muted-foreground">
                                {targetNode && "label" in targetNode.data
                                  ? targetNode.data.label
                                  : ""}
                              </span>
                            </div>
                            <div className="ml-4 space-y-2 border-l-2 border-border/40 pl-3">
                              {conditions.length === 0 && (
                                <p className="py-1 text-[10px] italic text-muted-foreground">
                                  No conditions — used as default path.
                                </p>
                              )}
                              {conditions.map((cond) => (
                                <WorkflowConditionRow
                                  key={cond.id}
                                  condition={cond}
                                  formFields={formFields}
                                  onChange={(key, value) =>
                                    updateCondition(handleId, cond.id, key, value)
                                  }
                                  onRemove={() => removeCondition(handleId, cond.id)}
                                />
                              ))}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 gap-1 px-2 text-[11px] text-muted-foreground hover:text-primary"
                                onClick={() => addCondition(handleId)}
                              >
                                <Plus className="h-3 w-3" /> Add condition
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                      {getOutgoingEdges().length === 0 && (
                        <div className="rounded-lg border border-border/40 bg-muted/30 p-4 text-center">
                          <AlertTriangle className="mx-auto mb-2 h-5 w-5 text-amber-500" />
                          <div className="text-xs font-medium">No outgoing connections</div>
                          <p className="mt-0.5 text-[10px] text-muted-foreground">
                            Connect the gateway to downstream nodes first.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "actions" &&
                    selectedNode.type === "task" &&
                    isTaskFlowData(selectedNode.data, selectedNode.type) && (
                      <div className="space-y-4">
                        <p className="text-[11px] leading-relaxed text-muted-foreground">
                          Ordered execution steps when this task activates.
                        </p>
                        <div className="space-y-2.5">
                          {selectedNode.data.actions.map((act, idx) => {
                            const meta = ACTION_TYPE_META[act.type];
                            const TypeIcon = meta.icon;
                            return (
                              <div
                                key={act.id}
                                className="group relative overflow-hidden rounded-md border border-border/60 bg-background shadow-sm transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary"
                              >
                                <div className="absolute bottom-0 left-0 top-0 flex w-6 flex-col items-center justify-between border-r border-border/40 bg-muted/40 py-2">
                                  <span className="font-mono text-[9px] font-bold text-muted-foreground/60">
                                    {idx + 1}
                                  </span>
                                  <GripVertical className="h-3 w-3 cursor-grab text-muted-foreground/30 hover:text-muted-foreground" />
                                </div>
                                <div className="space-y-2 py-2 pl-8 pr-2">
                                  <div className="flex items-center justify-between">
                                    <Select
                                      value={act.type}
                                      onValueChange={(v) =>
                                        v && updateAction(act.id, "type", v as WorkflowActionType)
                                      }
                                    >
                                      <SelectTrigger className="-ml-1 h-6 w-[140px] rounded border-transparent bg-transparent p-0 px-1 text-[11px] font-medium shadow-none hover:bg-muted/50 focus:ring-0">
                                        <span className="flex items-center gap-1.5">
                                          <TypeIcon className={`h-3.5 w-3.5 ${meta.color}`} />
                                          <SelectValue />
                                        </span>
                                      </SelectTrigger>
                                      <SelectContent>
                                        {(
                                          Object.entries(ACTION_TYPE_META) as [
                                            WorkflowActionType,
                                            (typeof ACTION_TYPE_META)["email"],
                                          ][]
                                        ).map(([k, v]) => (
                                          <SelectItem key={k} value={k} className="text-xs">
                                            <span className="flex items-center gap-1.5">
                                              <v.icon className={`h-3.5 w-3.5 ${v.color}`} />{" "}
                                              {v.label}
                                            </span>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-5 w-5 rounded-sm opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                                      onClick={() => removeAction(act.id)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <Input
                                    value={act.label}
                                    onChange={(e) =>
                                      updateAction(act.id, "label", e.target.value)
                                    }
                                    placeholder="Action description..."
                                    className="h-7 rounded-sm border-border/40 bg-muted/20 px-2 text-xs font-medium shadow-none placeholder:text-muted-foreground/50 focus-visible:ring-primary/50"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 h-9 w-full gap-1.5 border-dashed border-border/60 text-muted-foreground shadow-none hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                          onClick={addAction}
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span className="text-xs font-semibold">Add execution step</span>
                        </Button>
                      </div>
                    )}

                  {activeTab === "variables" &&
                    selectedNode.type === "task" &&
                    isTaskFlowData(selectedNode.data, selectedNode.type) && (
                      <div className="space-y-5">
                        <p className="text-[11px] leading-relaxed text-muted-foreground">
                          Map form and system variables into each action&apos;s parameters.
                        </p>
                        {formFields.length === 0 && (
                          <div className="flex items-start gap-2 rounded-md border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-800 dark:text-amber-400/80">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                            Add fields to the service form to use form variables in mappings.
                          </div>
                        )}
                        {selectedNode.data.actions.map((act, idx) => {
                          const meta = ACTION_TYPE_META[act.type];
                          const TypeIcon = meta.icon;
                          const fields = getActionFieldKeys(act.type);
                          const varMap = act.variableMap;
                          return (
                            <div key={act.id} className="space-y-2.5">
                              <div className="flex items-center gap-2">
                                <div className="flex h-5 w-5 items-center justify-center rounded border border-border/40 bg-muted">
                                  <span className="font-mono text-[9px] font-bold text-muted-foreground">
                                    {idx + 1}
                                  </span>
                                </div>
                                <TypeIcon className={`h-3.5 w-3.5 ${meta.color}`} />
                                <span className="truncate text-xs font-medium">{act.label}</span>
                              </div>
                              <div className="ml-7 space-y-2 border-l-2 border-border/30 pl-3">
                                {fields.map((fieldKey) => (
                                  <div key={fieldKey} className="space-y-1">
                                    <div className="flex items-center justify-between">
                                      <Label className="font-mono text-[10px] font-semibold text-muted-foreground">
                                        {fieldKey}
                                      </Label>
                                      <WorkflowVariablePicker
                                        formFields={formFields}
                                        onInsert={(v) =>
                                          updateActionVariable(
                                            act.id,
                                            fieldKey,
                                            (varMap[fieldKey] ?? "") + v
                                          )
                                        }
                                      />
                                    </div>
                                    <Input
                                      value={varMap[fieldKey] ?? ""}
                                      onChange={(e) =>
                                        updateActionVariable(act.id, fieldKey, e.target.value)
                                      }
                                      placeholder="{{variables}}"
                                      className="h-7 rounded-sm border-border/40 bg-background px-2 font-mono text-[11px] shadow-sm focus-visible:ring-primary/50"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                        {selectedNode.data.actions.length === 0 && (
                          <div className="rounded-lg border border-border/40 bg-muted/30 p-4 text-center">
                            <Variable className="mx-auto mb-2 h-5 w-5 text-muted-foreground/50" />
                            <div className="text-xs font-medium">No actions to map</div>
                            <p className="mt-0.5 text-[10px] text-muted-foreground">
                              Add execution steps in the Execution tab first.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center bg-muted/5 p-8 text-center">
              <div className="relative mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-border bg-background shadow-sm">
                <div className="absolute inset-0 bg-primary/5 opacity-50" />
                <MousePointerClick className="relative z-10 h-6 w-6 text-muted-foreground/50" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">No selection</h3>
              <p className="max-w-[220px] text-xs leading-relaxed text-muted-foreground">
                Select a node on the canvas to edit its properties.
              </p>
            </div>
          )}
        </aside>
      </div>

      {showHistory && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex h-[320px] flex-col border-t border-border/60 bg-background shadow-2xl">
          <div className="flex shrink-0 items-center justify-between border-b border-border/40 px-6 py-3">
            <div className="flex items-center gap-2.5">
              <History className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold">Simulation history</span>
              <Badge variant="secondary" className="text-[10px]">
                {MOCK_HISTORY.length} runs
              </Badge>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowHistory(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/40 text-muted-foreground">
                  <th className="px-6 py-2.5 text-left text-[10px] font-semibold uppercase tracking-widest">
                    Run
                  </th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-widest">
                    Steps
                  </th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-widest">
                    Duration
                  </th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-widest">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_HISTORY.map((run) => (
                  <tr
                    key={run.id}
                    className="cursor-pointer border-b border-border/20 transition-colors hover:bg-muted/30"
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-[10px] text-muted-foreground">{run.id}</code>
                        <span className="font-medium">{run.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={`border-0 text-[9px] ${
                          run.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {run.status === "completed" ? (
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                        ) : (
                          <XCircle className="mr-1 h-3 w-3" />
                        )}
                        {run.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {run.steps.map((step, i) => (
                          <div key={i} className="flex items-center gap-1">
                            <div
                              className={`h-1.5 w-1.5 rounded-full ${
                                step.type === "start"
                                  ? "bg-emerald-500"
                                  : step.type === "end"
                                    ? "bg-red-500"
                                    : step.type === "gateway"
                                      ? "bg-amber-500"
                                      : "bg-primary"
                              }`}
                            />
                            {i < run.steps.length - 1 && (
                              <div className="h-px w-3 bg-border" />
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">
                      {(run.duration / 1000).toFixed(1)}s
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(run.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export function WorkflowFlowDesigner(props: {
  serviceId: string;
  serviceName: string;
  formFields: FormField[];
  initialDefinition: WorkflowFlowDefinition;
  onSave: (def: WorkflowFlowDefinition) => void;
  backHref: string;
  variant?: "page" | "embedded";
}) {
  return (
    <ReactFlowProvider>
      <WorkflowFlowDesignerInner {...props} />
    </ReactFlowProvider>
  );
}

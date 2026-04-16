"use client";

import {
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";
import {
  Check,
  CheckCircle2,
  Circle,
  Play,
  Settings2,
  Square,
  User,
  X,
} from "lucide-react";
import type { TaskFlowData, WorkflowFlowNode } from "@/lib/workflow-flow-types";
import { ACTION_TYPE_META } from "./workflow-flow-config";

function StartFlowNode({ data, selected }: NodeProps<WorkflowFlowNode>) {
  const simStatus =
    "simStatus" in data ? data.simStatus : undefined;
  const ringClass =
    simStatus === "active"
      ? "animate-pulse border-emerald-500 ring-4 ring-emerald-500/40"
      : simStatus === "completed"
        ? "border-emerald-500 ring-4 ring-emerald-500/20"
        : selected
          ? "border-emerald-500 ring-4 ring-emerald-500/20"
          : "border-emerald-600/60 hover:border-emerald-500";

  return (
    <div
      className={`relative flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] bg-background shadow-sm transition-all ${ringClass}`}
    >
      <Play className="ml-0.5 h-4 w-4 text-emerald-600 opacity-80" />
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border-2 !border-background bg-emerald-500"
      />
      <div className="absolute -bottom-6 whitespace-nowrap text-[10px] font-medium text-muted-foreground">
        {"label" in data ? data.label : ""}
      </div>
      {simStatus === "completed" && (
        <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 shadow-sm">
          <Check className="h-2.5 w-2.5 text-white" />
        </div>
      )}
    </div>
  );
}

function EndFlowNode({ data, selected }: NodeProps<WorkflowFlowNode>) {
  const simStatus =
    "simStatus" in data ? data.simStatus : undefined;
  const ringClass =
    simStatus === "active"
      ? "animate-pulse border-emerald-500 ring-4 ring-emerald-500/40"
      : simStatus === "completed"
        ? "border-emerald-500 ring-4 ring-emerald-500/20"
        : selected
          ? "border-destructive ring-4 ring-destructive/20"
          : "border-destructive/80 hover:border-destructive";

  return (
    <div
      className={`relative flex h-12 w-12 items-center justify-center rounded-full border-[3.5px] bg-background shadow-sm transition-all ${ringClass}`}
    >
      <Square className="h-3.5 w-3.5 fill-destructive/20 text-destructive/80" />
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border-2 !border-background bg-destructive"
      />
      <div className="absolute -bottom-6 whitespace-nowrap text-[10px] font-medium text-muted-foreground">
        {"label" in data ? data.label : ""}
      </div>
      {simStatus === "completed" && (
        <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 shadow-sm">
          <Check className="h-2.5 w-2.5 text-white" />
        </div>
      )}
    </div>
  );
}

function TaskFlowNode({ data, selected }: NodeProps<WorkflowFlowNode>) {
  if (!("taskType" in data)) return null;
  const taskData = data as TaskFlowData;
  const actions = taskData.actions ?? [];
  const isApproval = taskData.taskType === "approval";
  const simStatus = taskData.simStatus;

  const borderClass =
    simStatus === "active"
      ? "border-blue-500 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/30"
      : simStatus === "completed"
        ? "border-emerald-500 ring-2 ring-emerald-500/20"
        : simStatus === "skipped"
          ? "border-muted-foreground/30 opacity-50"
          : selected
            ? "border-primary ring-2 ring-primary/20"
            : "border-border/80 hover:border-border";

  return (
    <div
      className={`flex min-w-[220px] max-w-[260px] flex-col rounded-lg border bg-background shadow-sm transition-all ${borderClass}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border-2 !border-background bg-muted-foreground"
      />

      <div className="flex items-center justify-between rounded-t-lg border-b border-border/40 bg-muted/20 px-3 py-2">
        <div className="flex items-center gap-2">
          {isApproval ? (
            <User className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          ) : (
            <Settings2 className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          )}
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
            {isApproval ? "User Task" : "Service Task"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {actions.length > 0 && (
            <div className="flex h-4 items-center justify-center rounded-sm border border-border/60 bg-background px-1.5 font-mono text-[9px] font-bold text-muted-foreground shadow-sm">
              {actions.length}
            </div>
          )}
          {simStatus === "completed" && (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          )}
          {simStatus === "active" && (
            <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 px-3 py-3">
        <div className="text-sm font-medium leading-tight text-foreground">
          {taskData.label}
        </div>
        {taskData.assignee && isApproval && (
          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 text-[8px] font-bold text-blue-600">
              {taskData.assignee.substring(0, 2).toUpperCase()}
            </div>
            <span className="truncate">{taskData.assignee}</span>
          </div>
        )}
      </div>

      {actions.length > 0 && (
        <div className="px-1.5 pb-1.5">
          <div className="flex flex-wrap gap-1 rounded-md border border-border/40 bg-muted/30 p-1.5">
            {actions.map((act) => {
              const meta = ACTION_TYPE_META[act.type];
              const TypeIcon = meta?.icon ?? Circle;
              const typeColor = meta?.color ?? "text-muted-foreground";
              const typeBg = meta?.bg ?? "bg-muted";
              return (
                <div
                  key={act.id}
                  title={act.label}
                  className={`flex h-5 w-5 items-center justify-center rounded border border-border/20 ${typeBg}`}
                >
                  <TypeIcon className={`h-3 w-3 ${typeColor}`} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border-2 !border-background bg-muted-foreground"
      />
    </div>
  );
}

function GatewayFlowNode({ data, selected }: NodeProps<WorkflowFlowNode>) {
  const simStatus =
    "simStatus" in data ? data.simStatus : undefined;
  const borderClass =
    simStatus === "active"
      ? "animate-pulse border-amber-500 ring-4 ring-amber-500/30"
      : simStatus === "completed"
        ? "border-emerald-500 ring-4 ring-emerald-500/20"
        : selected
          ? "border-amber-500 ring-4 ring-amber-500/20"
          : "border-amber-500/60 hover:border-amber-500";

  return (
    <div className="group relative flex h-12 w-12 items-center justify-center">
      <Handle
        type="target"
        position={Position.Left}
        className="absolute -left-1 z-10 !h-2 !w-2 !border-2 !border-background bg-amber-500"
      />
      <div
        className={`absolute inset-0 rotate-45 rounded-sm border-[1.5px] bg-background shadow-sm transition-all ${borderClass}`}
      />
      <X className="relative z-10 h-5 w-5 stroke-[3] text-amber-600/80" />
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        className="absolute -top-1 z-10 !h-2 !w-2 !border-2 !border-background bg-amber-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="absolute -right-1 z-10 !h-2 !w-2 !border-2 !border-background bg-amber-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="absolute -bottom-1 z-10 !h-2 !w-2 !border-2 !border-background bg-amber-500"
      />
      <div className="absolute -bottom-6 whitespace-nowrap text-[10px] font-medium text-muted-foreground">
        {"label" in data ? data.label : ""}
      </div>
      {simStatus === "completed" && (
        <div className="absolute -top-2 -right-2 z-20 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 shadow-sm">
          <Check className="h-2.5 w-2.5 text-white" />
        </div>
      )}
    </div>
  );
}

export const workflowFlowNodeTypes = {
  start: StartFlowNode,
  end: EndFlowNode,
  task: TaskFlowNode,
  gateway: GatewayFlowNode,
};

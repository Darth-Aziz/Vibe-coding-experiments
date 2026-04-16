"use client";

import { useTasheelStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  GitBranch,
  ArrowRight,
  Circle,
  Diamond,
  Link2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

function StageTypeDot({ type }: { type: string }) {
  if (type === "start")
    return <div className="h-2.5 w-2.5 rounded-full bg-success ring-2 ring-success/20" />;
  if (type === "end")
    return <div className="h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-destructive/20" />;
  if (type === "gateway")
    return <Diamond className="h-3 w-3 text-amber-500" />;
  return <Circle className="h-2.5 w-2.5 fill-primary/15 text-primary" />;
}

export default function WorkflowsListPage() {
  const workflows = useTasheelStore((s) => s.workflows);
  const services = useTasheelStore((s) => s.services);

  function getLinkedServices(workflowId: string) {
    return services.filter((s) => s.workflowId === workflowId);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Workflow Templates</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {workflows.length} workflow{workflows.length !== 1 ? "s" : ""} defined
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {workflows.map((wf) => {
          const linked = getLinkedServices(wf.id);
          const taskStages = wf.stages.filter((s) => s.type === "task");

          return (
            <Link key={wf.id} href={`/admin/workflows/${wf.id}`}>
              <Card className="cursor-pointer transition-all hover:border-border hover:shadow-md group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-6">
                    {/* Left — info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                          <GitBranch className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">
                            {wf.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">{wf.description}</p>
                        </div>
                      </div>

                      {/* Visual stage flow */}
                      <div className="flex items-center gap-1 mt-3 overflow-x-auto pb-1">
                        {wf.stages.map((stage, i) => (
                          <div key={stage.id} className="flex items-center">
                            <div className="flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5">
                              <StageTypeDot type={stage.type} />
                              <span className="whitespace-nowrap text-[11px] font-medium text-muted-foreground">
                                {stage.name}
                              </span>
                            </div>
                            {i < wf.stages.length - 1 && (
                              <ArrowRight className="mx-0.5 h-3 w-3 shrink-0 text-muted-foreground/40" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right — meta */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] font-mono">
                          {wf.stages.length} stages
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] font-mono">
                          {taskStages.length} tasks
                        </Badge>
                      </div>

                      {linked.length > 0 ? (
                        <div className="flex items-center gap-1 text-[11px] text-emerald-600">
                          <Link2 className="h-3 w-3" />
                          {linked.length} service{linked.length > 1 ? "s" : ""} linked
                        </div>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">Not linked</span>
                      )}

                      <span className="text-[10px] text-muted-foreground">
                        Created {formatDate(wf.createdAt)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}

        {workflows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <GitBranch className="mb-3 h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm font-medium text-muted-foreground">No workflows yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Create a service and design a workflow for it
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

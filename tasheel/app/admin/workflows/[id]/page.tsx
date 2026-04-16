"use client";

import { use } from "react";
import { useTasheelStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowLeft,
  GitBranch,
  Circle,
  Diamond,
  ArrowRight,
  Link2,
  User,
  ChevronRight,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

function StageIcon({ type }: { type: string }) {
  if (type === "start")
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 ring-4 ring-green-50">
        <div className="h-3 w-3 rounded-full bg-green-500" />
      </div>
    );
  if (type === "end")
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 ring-4 ring-red-50">
        <div className="h-3 w-3 rounded-full bg-red-500" />
      </div>
    );
  if (type === "gateway")
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 ring-4 ring-amber-50 rotate-45">
        <Diamond className="h-3.5 w-3.5 text-amber-600 -rotate-45" />
      </div>
    );
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 ring-4 ring-blue-50">
      <Circle className="h-3.5 w-3.5 text-blue-500 fill-blue-200" />
    </div>
  );
}

export default function EditWorkflowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const workflow = useTasheelStore((s) => s.workflows.find((w) => w.id === id));
  const services = useTasheelStore((s) => s.services);

  if (!workflow) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Workflow not found.</p>
      </div>
    );
  }

  const linkedServices = services.filter((s) => s.workflowId === id);
  const taskStages = workflow.stages.filter((s) => s.type === "task");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/workflows">
          <Button variant="ghost" size="sm" className="h-8">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
          </Button>
        </Link>
        <div className="h-5 w-px bg-border" />
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/admin/workflows" className="hover:text-foreground transition-colors">Workflows</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{workflow.name}</span>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-foreground">{workflow.stages.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total Stages</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{taskStages.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">User Tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-amber-600">
              {workflow.stages.filter((s) => s.type === "gateway").length}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Gateways</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-emerald-600">{linkedServices.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Linked Services</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Stage breakdown */}
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-purple-500" />
                Workflow Stages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {workflow.stages.map((stage, i) => (
                  <div key={stage.id}>
                    <div className="flex items-center gap-4 py-3">
                      <StageIcon type={stage.type} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{stage.name}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <Badge
                            variant="secondary"
                            className={
                              stage.type === "start" ? "bg-green-50 text-green-700 text-[10px]" :
                              stage.type === "end" ? "bg-red-50 text-red-700 text-[10px]" :
                              stage.type === "gateway" ? "bg-amber-50 text-amber-700 text-[10px]" :
                              "bg-blue-50 text-blue-700 text-[10px]"
                            }
                          >
                            {stage.type}
                          </Badge>
                          {stage.assignee && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <User className="h-3 w-3" />
                              {stage.assignee}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">#{stage.order + 1}</span>
                    </div>
                    {i < workflow.stages.length - 1 && (
                      <div className="ml-[18px] h-4 w-px bg-border" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-sm font-medium">{workflow.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="text-sm">{workflow.description}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-sm">{formatDate(workflow.createdAt)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-1.5">
                <Link2 className="h-3.5 w-3.5 text-emerald-500" />
                Linked Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              {linkedServices.length === 0 ? (
                <p className="text-xs text-muted-foreground">No services use this workflow yet.</p>
              ) : (
                <div className="space-y-2">
                  {linkedServices.map((svc) => (
                    <Link
                      key={svc.id}
                      href={`/admin/services/${svc.id}`}
                      className="flex items-center justify-between rounded-lg border p-2.5 hover:bg-muted transition-colors group"
                    >
                      <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                        {svc.name}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/70" />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

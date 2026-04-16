"use client";

import { use } from "react";
import { useTasheelStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Circle, Clock, XCircle, Ban } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/status-badge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const request = useTasheelStore((s) => s.requests.find((r) => r.id === id));
  const service = useTasheelStore((s) =>
    s.services.find((svc) => svc.id === request?.serviceId)
  );
  const workflow = useTasheelStore((s) =>
    s.workflows.find((w) => w.id === service?.workflowId)
  );
  const router = useRouter();

  if (!request) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Request not found.</p>
      </div>
    );
  }

  const stages = workflow?.stages.filter((s) => s.type !== "start") ?? [];
  const currentStageIndex = workflow?.stages.findIndex((s) => s.id === request.currentStage) ?? -1;
  const canCancel = ["submitted", "in_review"].includes(request.status);

  function handleCancel() {
    useTasheelStore.getState().cancelRequest(id, "Cancelled by requester", "Ahmed Al-Rashid");
    toast.success("Request cancelled");
    router.push("/requester/requests");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/requester/requests">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">
              {request.ticketNumber}
            </h1>
            <StatusBadge status={request.status} />
          </div>
          <p className="mt-1 text-muted-foreground">{request.serviceName}</p>
        </div>
        {canCancel && (
          <Dialog>
            <DialogTrigger
              render={
                <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                  <Ban className="mr-2 h-4 w-4" /> Cancel Request
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel Request</DialogTitle>
                <DialogDescription>
                  Are you sure you want to cancel this request? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Keep Request</Button>
                <Button variant="destructive" onClick={handleCancel}>
                  Cancel Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Workflow Progress Tracker */}
      {stages.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Workflow Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start">
              {stages.map((stage, i) => {
                const stageIndex = workflow!.stages.indexOf(stage);
                const isCompleted = stageIndex < currentStageIndex;
                const isCurrent = stage.id === request.currentStage;
                const isRejected = request.status === "rejected" && isCurrent;
                const isCancelled = request.status === "cancelled";

                const historyEntry = request.history.find((h) => h.stageId === stage.id);

                return (
                  <div key={stage.id} className="flex flex-1 items-start">
                    <div className="flex flex-col items-center gap-1.5 w-full">
                      {isCompleted ? (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/15">
                          <CheckCircle className="h-5 w-5 text-success" />
                        </div>
                      ) : isCurrent && isRejected ? (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/15">
                          <XCircle className="h-5 w-5 text-destructive" />
                        </div>
                      ) : isCurrent && !isCancelled ? (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 ring-4 ring-primary/10">
                          <Clock className="h-5 w-5 animate-pulse text-primary" />
                        </div>
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                          <Circle className="h-5 w-5 text-muted-foreground/40" />
                        </div>
                      )}
                      <span className="text-xs font-medium text-center leading-tight max-w-[100px]">
                        {stage.name}
                      </span>
                      {historyEntry && (
                        <span className="text-[10px] text-muted-foreground text-center">
                          {historyEntry.actor}
                        </span>
                      )}
                    </div>
                    {i < stages.length - 1 && (
                      <div className="flex-1 pt-4 px-1">
                        <div
                          className={`h-0.5 w-full ${
                            isCompleted ? "bg-success/80" : "bg-border"
                          }`}
                          style={
                            !isCompleted
                              ? {
                                  backgroundImage:
                                    "repeating-linear-gradient(90deg, transparent, transparent 4px, var(--border) 4px, var(--border) 8px)",
                                }
                              : undefined
                          }
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submitted Form Data */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Submitted Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            {Object.entries(request.formData).map(([key, value]) => (
              <div key={key}>
                <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {key}
                </dt>
                <dd className="mt-0.5 text-sm text-foreground">
                  {Array.isArray(value) ? value.join(", ") : String(value)}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <Separator />

      {/* History Timeline */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Activity History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {[...request.history].reverse().map((entry, i) => (
              <div key={`${entry.timestamp}-${entry.action}`} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`mt-1.5 h-3 w-3 rounded-full ${
                    i === 0 ? "bg-primary" : "bg-muted-foreground/40"
                  }`} />
                  {i < request.history.length - 1 && (
                    <div className="my-1 w-px flex-1 bg-border" />
                  )}
                </div>
                <div className="pb-6">
                  <p className="text-sm font-medium text-foreground">
                    {entry.action}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {entry.stageName} &middot; {entry.actor}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(entry.timestamp)}
                  </p>
                  {entry.comment && (
                    <div className="mt-2 rounded-md border border-border bg-muted/50 px-3 py-2">
                      <p className="text-sm italic text-muted-foreground">
                        &ldquo;{entry.comment}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

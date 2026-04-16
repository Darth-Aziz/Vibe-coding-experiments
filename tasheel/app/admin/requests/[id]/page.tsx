"use client";

import { use, useState, useEffect } from "react";
import { useTasheelStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import {
  ArrowLeft, ChevronRight, CheckCircle, Circle, Clock, XCircle, Ban,
  ArrowRight, MessageSquare, Timer,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/status-badge";
import { toast } from "sonner";

export default function AdminRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const request = useTasheelStore((s) => s.requests.find((r) => r.id === id));
  const services = useTasheelStore((s) => s.services);
  const workflows = useTasheelStore((s) => s.workflows);
  const advanceRequest = useTasheelStore((s) => s.advanceRequest);
  const rejectRequest = useTasheelStore((s) => s.rejectRequest);

  const addRequestComment = useTasheelStore((s) => s.addRequestComment);

  const [comment, setComment] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const ssrNow = new Date("2026-04-15T12:00:00Z").getTime();
  const [now, setNow] = useState(ssrNow);
  useEffect(() => {
    const id = requestAnimationFrame(() => setNow(Date.now()));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!request) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Request not found.</p>
      </div>
    );
  }

  const service = services.find((s) => s.id === request.serviceId);
  const workflow = workflows.find((w) => w.id === service?.workflowId);
  const stages = workflow?.stages.filter((s) => s.type !== "start") ?? [];
  const currentStageIndex = workflow?.stages.findIndex((s) => s.id === request.currentStage) ?? -1;
  const canAdvance = ["submitted", "in_review"].includes(request.status);
  const isOpen = !["completed", "cancelled", "rejected"].includes(request.status);

  const elapsed = (now - new Date(request.createdAt).getTime()) / 3600000;
  const responseBreached = service ? elapsed > service.sla.responseTime : false;
  const resolutionBreached = service ? elapsed > service.sla.resolutionTime : false;

  function handleAdvance() {
    advanceRequest(request!.id, "Approved", "Sarah Mitchell", comment || undefined);
    setComment("");
    toast.success("Request advanced to next stage");
  }

  function handleReject() {
    rejectRequest(request!.id, rejectReason);
    setRejectReason("");
    toast.info("Request rejected");
  }

  function handleComment() {
    if (!comment.trim()) return;
    addRequestComment(request!.id, comment, "Ahmed Al-Rashid");
    setComment("");
    toast.success("Comment added");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/requests">
          <Button variant="ghost" size="sm" className="h-8">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
          </Button>
        </Link>
        <div className="h-5 w-px bg-border" />
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/admin/requests" className="transition-colors hover:text-foreground">Requests</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">{request.ticketNumber}</span>
        </div>
      </div>

      {/* SLA Breach Banner */}
      {isOpen && resolutionBreached && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
          <Timer className="h-5 w-5 text-destructive" />
          <div>
            <p className="text-sm font-medium text-destructive">SLA Breached</p>
            <p className="text-xs text-destructive/90">Resolution time exceeded by {Math.round(elapsed - (service?.sla.resolutionTime ?? 0))}h</p>
          </div>
        </div>
      )}

      {/* Title + Actions */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{request.ticketNumber}</h1>
            <StatusBadge status={request.status} />
          </div>
          <p className="text-muted-foreground mt-1">{request.serviceName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            by {request.requesterName} &middot; {formatDateTime(request.createdAt)}
          </p>
        </div>
      </div>

      {/* Admin Action Bar */}
      {canAdvance && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-3 flex items-center gap-2">
            <Button size="sm" onClick={handleAdvance} className="gap-1.5">
              <ArrowRight className="h-3.5 w-3.5" /> Advance
            </Button>
            <Dialog>
              <DialogTrigger render={
                <Button size="sm" variant="outline" className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive">
                  <Ban className="h-3.5 w-3.5" /> Reject
                </Button>
              } />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reject Request</DialogTitle>
                  <DialogDescription>Provide a reason for rejection. This will be visible to the requester.</DialogDescription>
                </DialogHeader>
                <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Reason for rejection..." />
                <DialogFooter>
                  <Button variant="destructive" onClick={handleReject} disabled={!rejectReason.trim()}>Reject</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button size="sm" variant="ghost" onClick={handleComment} disabled={!comment.trim()} className="gap-1.5 ml-auto">
              <MessageSquare className="h-3.5 w-3.5" /> Add Comment
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Workflow Tracker */}
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

                return (
                  <div key={stage.id} className="flex flex-1 items-start">
                    <div className="flex flex-col items-center gap-1.5 w-full">
                      {isCompleted ? (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/15">
                          <CheckCircle className="h-5 w-5 text-success" />
                        </div>
                      ) : isRejected ? (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/15">
                          <XCircle className="h-5 w-5 text-destructive" />
                        </div>
                      ) : isCurrent ? (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 ring-4 ring-primary/10">
                          <Clock className="h-5 w-5 animate-pulse text-primary" />
                        </div>
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                          <Circle className="h-5 w-5 text-muted-foreground/40" />
                        </div>
                      )}
                      <span className="text-xs font-medium text-center max-w-[90px]">{stage.name}</span>
                    </div>
                    {i < stages.length - 1 && (
                      <div className="flex-1 pt-4 px-1">
                        <div className={`h-0.5 w-full ${isCompleted ? "bg-success/80" : "bg-border"}`} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Two-column: data + timeline */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left: Request Data + SLA */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Request Data</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                {Object.entries(request.formData).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-xs text-muted-foreground uppercase tracking-wider">{key}</dt>
                    <dd className="text-sm mt-0.5">{Array.isArray(value) ? value.join(", ") : String(value)}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          {service && isOpen && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <Timer className="h-4 w-4 text-muted-foreground" /> SLA Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Response SLA</p>
                    <p className="text-sm font-medium">{service.sla.responseTime}h</p>
                  </div>
                  {responseBreached ? (
                    <Badge variant="destructive">Breached</Badge>
                  ) : (
                    <Badge variant="success">On Track</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Resolution SLA</p>
                    <p className="text-sm font-medium">{service.sla.resolutionTime}h</p>
                  </div>
                  {resolutionBreached ? (
                    <Badge variant="destructive">Breached</Badge>
                  ) : (
                    <Badge variant="success">
                      {Math.round(service.sla.resolutionTime - elapsed)}h remaining
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Timeline + Comment input */}
        <div className="space-y-4">
          {canAdvance && (
            <div className="flex gap-2">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add an internal comment..."
                className="text-sm"
                rows={2}
              />
            </div>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {[...request.history].reverse().map((entry, i) => (
                  <div key={`${entry.timestamp}-${entry.action}`} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`mt-1.5 h-2.5 w-2.5 rounded-full ${i === 0 ? "bg-primary" : "bg-muted-foreground/40"}`} />
                      {i < request.history.length - 1 && <div className="my-1 w-px flex-1 bg-border" />}
                    </div>
                    <div className="pb-5">
                      <p className="text-sm font-medium">{entry.action}</p>
                      <p className="text-xs text-muted-foreground">{entry.actor} &middot; {formatDateTime(entry.timestamp)}</p>
                      {entry.comment && (
                        <div className="mt-1.5 rounded-md border border-border bg-muted/50 px-3 py-2">
                          <p className="text-sm italic text-muted-foreground">&ldquo;{entry.comment}&rdquo;</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

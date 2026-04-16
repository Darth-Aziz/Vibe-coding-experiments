"use client";

import { use, useState } from "react";
import { useTasheelStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServiceRequestFormFields } from "@/components/shared/service-request-form-fields";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatSlaSummary, getCategoryColor } from "@/lib/utils";
import { Clock, CheckCircle, ArrowRight, Circle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export default function ServiceRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const service = useTasheelStore((s) => s.services.find((svc) => svc.id === id));
  const workflows = useTasheelStore((s) => s.workflows);
  const submitRequest = useTasheelStore((s) => s.submitRequest);
  const router = useRouter();

  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  if (!service) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Service not found.</p>
      </div>
    );
  }

  const linkedWorkflow = workflows.find((w) => w.id === service.workflowId);
  const stages = linkedWorkflow?.stages.filter((s) => s.type !== "start") ?? [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newErrors: Record<string, boolean> = {};
    const sortedFields = [...service!.formFields].sort((a, b) => a.order - b.order);
    for (const field of sortedFields) {
      if (!field.required) continue;
      const v = formData[field.label];
      let missing = false;
      if (field.type === "checkbox") {
        missing = !Array.isArray(v) || v.length === 0;
      } else {
        missing = v === undefined || v === null || v === "";
      }
      if (missing) newErrors[field.label] = true;
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields");
      return;
    }

    const now = new Date().toISOString();
    const firstTaskStage = linkedWorkflow?.stages.find((s) => s.type === "task");

    const created = submitRequest({
      serviceId: service!.id,
      serviceName: service!.name,
      requesterId: "usr_ahmed",
      requesterName: "Ahmed Al-Rashid",
      status: "submitted",
      currentStage: firstTaskStage?.id ?? "s2",
      formData,
      history: [
        {
          stageId: firstTaskStage?.id ?? "s2",
          stageName: firstTaskStage?.name ?? "Submit",
          action: "Submitted",
          actor: "Ahmed Al-Rashid",
          timestamp: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    });
    setTicketNumber(created.ticketNumber);
    setShowSuccess(true);
  }

  function updateField(label: string, value: unknown) {
    setFormData((prev) => ({ ...prev, [label]: value }));
    setErrors((prev) => ({ ...prev, [label]: false }));
  }

  const sortedFields = [...service.formFields].sort((a, b) => a.order - b.order);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-xl border border-border bg-accent/60 p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">{service.name}</h1>
        <p className="mt-1 text-muted-foreground">{service.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className={getCategoryColor(service.category)}>
            {service.category.toUpperCase()}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatSlaSummary(service.sla)}
          </span>
        </div>
      </div>

      {stages.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Workflow Stages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {stages.map((stage, i) => (
                <div key={stage.id} className="flex items-center">
                  <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
                    <Circle className="h-2.5 w-2.5 text-muted-foreground/60" />
                    <span className="whitespace-nowrap text-xs font-medium text-muted-foreground">
                      {stage.name}
                    </span>
                  </div>
                  {i < stages.length - 1 && (
                    <ArrowRight className="mx-1 h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Submit Request</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <ServiceRequestFormFields
              fields={sortedFields}
              formData={formData}
              onFieldChange={updateField}
              errors={errors}
            />

            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={sortedFields.length === 0}>
                Submit Request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-7 w-7 text-green-600" />
            </div>
            <DialogTitle className="text-center">Request Submitted!</DialogTitle>
            <DialogDescription className="text-center">
              Your ticket number is{" "}
              <span className="font-mono text-lg font-bold text-foreground">{ticketNumber}</span>
              <br />
              You can track your request in &ldquo;My Requests&rdquo;.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-3 pt-2">
            <Button variant="outline" onClick={() => router.push("/requester")}>
              Back to Catalog
            </Button>
            <Button onClick={() => router.push("/requester/requests")}>
              View My Requests
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

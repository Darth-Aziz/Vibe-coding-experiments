"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StudioStepper } from "./studio-stepper";
import { StepDetails } from "./step-details";
import { StepFormBuilder } from "./step-form-builder";
import { StudioWorkflowStep } from "./studio-workflow-step";
import { StepReview } from "./step-review";
import { useTasheelStore } from "@/lib/store";
import { Service, ServiceCategory, ServiceVisibility } from "@/lib/types";
import { extractStagesFromFlow, getMinimalDefaultFlowDefinition } from "@/lib/workflow-graph-utils";
import { generateId } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, ChevronRight, Rocket, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface StudioLayoutProps {
  existingService?: Service;
}

export function StudioLayout({ existingService }: StudioLayoutProps) {
  const router = useRouter();
  const addService = useTasheelStore((s) => s.addService);
  const updateService = useTasheelStore((s) => s.updateService);
  const addWorkflow = useTasheelStore((s) => s.addWorkflow);
  const updateWorkflow = useTasheelStore((s) => s.updateWorkflow);
  const linkWorkflowToService = useTasheelStore((s) => s.linkWorkflowToService);
  const workflows = useTasheelStore((s) => s.workflows);

  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(
    existingService ? new Set([1, 2, 3]) : new Set()
  );

  const [serviceId] = useState(existingService?.id ?? generateId());
  const serviceLive = useTasheelStore((s) => s.services.find((x) => x.id === serviceId));
  const [name, setName] = useState(existingService?.name ?? "");
  const [description, setDescription] = useState(existingService?.description ?? "");
  const [category, setCategory] = useState<ServiceCategory>(existingService?.category ?? "general");
  const [icon, setIcon] = useState(existingService?.icon ?? "FileText");
  const [visibility, setVisibility] = useState<ServiceVisibility>(
    existingService?.visibility ?? "internal"
  );
  const [responseTime, setResponseTime] = useState(String(existingService?.sla.responseTime ?? 4));
  const [resolutionTime, setResolutionTime] = useState(String(existingService?.sla.resolutionTime ?? 24));
  const [formFields, setFormFields] = useState(existingService?.formFields ?? []);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(existingService?.updatedAt ?? null);
  const [isPublishPending, setIsPublishPending] = useState(false);

  const buildServiceObject = useCallback((): Service => ({
    id: serviceId,
    name: name.trim(),
    description: description.trim(),
    category,
    icon,
    visibility,
    status: existingService?.status ?? "draft",
    sla: {
      responseTime: parseInt(responseTime) || 4,
      resolutionTime: parseInt(resolutionTime) || 24,
    },
    formFields,
    workflowId: serviceLive?.workflowId ?? existingService?.workflowId ?? null,
    createdAt: existingService?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }), [serviceId, name, description, category, icon, visibility, responseTime, resolutionTime, formFields, existingService, serviceLive?.workflowId]);

  useEffect(() => {
    if (step !== 3) return;
    const st = useTasheelStore.getState();
    let svc = st.services.find((s) => s.id === serviceId);
    if (!svc) {
      const draft = buildServiceObject();
      addService(draft);
      svc = useTasheelStore.getState().services.find((s) => s.id === serviceId);
    }
    if (!svc || svc.workflowId) return;
    const wfId = `wf-${Date.now()}`;
    const def = getMinimalDefaultFlowDefinition();
    const stages = extractStagesFromFlow(def.nodes, def.edges);
    addWorkflow({
      id: wfId,
      name: `${name.trim() || "Service"} Workflow`,
      description: `Workflow for ${name.trim() || "service"}`,
      flowDefinition: def,
      stages,
      createdAt: new Date().toISOString(),
    });
    linkWorkflowToService(serviceId, wfId);
  }, [step, serviceId, name, addService, addWorkflow, linkWorkflowToService, buildServiceObject]);

  const persistDraft = useCallback(
    (opts?: { silent?: boolean }) => {
      if (!name.trim()) return;
      const svc = buildServiceObject();
      const exists = useTasheelStore.getState().services.some((s) => s.id === serviceId);
      if (exists) {
        updateService(serviceId, svc);
      } else {
        addService(svc);
      }
      const ts = new Date().toISOString();
      setLastSavedAt(ts);
      if (!opts?.silent) {
        toast.success("Draft saved");
      }
    },
    [addService, buildServiceObject, name, serviceId, updateService]
  );

  const validateStep1 = useCallback((): boolean => {
    if (name.trim().length < 3) { toast.error("Service name must be at least 3 characters"); return false; }
    if (description.trim().length < 10) { toast.error("Description must be at least 10 characters"); return false; }
    const rt = parseInt(responseTime);
    const rst = parseInt(resolutionTime);
    if (!rt || rt < 1) { toast.error("Response time must be at least 1 hour"); return false; }
    if (!rst || rst < 1) { toast.error("Resolution time must be at least 1 hour"); return false; }
    if (rst <= rt) { toast.error("Resolution time must be greater than response time"); return false; }
    return true;
  }, [name, description, responseTime, resolutionTime]);

  const goNext = useCallback(() => {
    if (step === 1 && !validateStep1()) return;
    setCompletedSteps((prev) => new Set([...prev, step]));
    setStep((s) => Math.min(s + 1, 4));
  }, [step, validateStep1]);

  useEffect(() => {
    if (!name.trim()) return undefined;
    const t = window.setTimeout(() => {
      persistDraft({ silent: true });
    }, 1200);
    return () => window.clearTimeout(t);
  }, [name, description, category, icon, visibility, responseTime, resolutionTime, formFields, persistDraft]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        persistDraft({ silent: false });
        return;
      }
      if (e.key !== "Enter") return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const el = document.activeElement;
      if (el instanceof HTMLTextAreaElement) return;
      if (el instanceof HTMLElement && el.closest('[data-slot="dialog-content"]')) return;
      if (el instanceof HTMLElement && el.isContentEditable) return;
      e.preventDefault();
      if (step >= 4) return;
      goNext();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [persistDraft, step, goNext]);

  function goPrev() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function saveWorkflowMetadata(svc: Service) {
    if (!svc.workflowId) return;
    updateWorkflow(svc.workflowId, {
      name: `${svc.name} Workflow`,
      description: `Workflow for ${svc.name}`,
    });
  }

  function handleSaveDraft() {
    if (!name.trim()) { toast.error("Service name is required"); return; }
    const svc = buildServiceObject();
    if (existingService) {
      updateService(serviceId, svc);
    } else {
      addService(svc);
    }
    setLastSavedAt(new Date().toISOString());
    saveWorkflowMetadata(svc);
    toast.success("Service saved as draft");
    router.push("/admin/services");
  }

  async function handlePublish() {
    if (!validateStep1()) { setStep(1); return; }
    setIsPublishPending(true);
    try {
      const svc = { ...buildServiceObject(), status: "published" as const };
      if (existingService) {
        updateService(serviceId, svc);
      } else {
        addService(svc);
      }
      setLastSavedAt(new Date().toISOString());
      saveWorkflowMetadata(svc);
      await new Promise((r) => setTimeout(r, 1200));
      toast.success("Service published and available to requesters");
      router.push("/admin/services");
    } finally {
      setIsPublishPending(false);
    }
  }

  const reviewWorkflow = serviceLive?.workflowId
    ? workflows.find((w) => w.id === serviceLive.workflowId)
    : null;

  const draftStatus = serviceLive?.status ?? existingService?.status ?? "draft";
  const displayServiceName = name.trim() || existingService?.name || "New Service";

  return (
    <div className="flex h-screen flex-col bg-muted/40">
      {/* Spec §9: sticky bar — left breadcrumb / center stepper / right actions (desktop grid). */}
      <div className="sticky top-0 z-30 border-b border-border bg-background shadow-sm">
        <div className="grid grid-cols-1 gap-2 px-4 py-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-4 lg:px-6 lg:py-2">
          <div className="flex min-h-[3rem] min-w-0 flex-wrap items-center gap-2 lg:min-h-14">
            <Link href="/admin/services">
              <Button variant="ghost" size="sm" className="h-8 shrink-0 gap-1.5 text-muted-foreground">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            </Link>
            <div className="flex min-w-0 flex-1 items-center gap-1 text-sm">
              <Link
                href="/admin/services"
                className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
              >
                Services
              </Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
              <span className="truncate font-semibold text-foreground">{displayServiceName}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-[10px] font-medium uppercase tracking-wide">
                {draftStatus}
              </Badge>
              {lastSavedAt && (
                <span className="text-[11px] text-muted-foreground">
                  Saved {format(new Date(lastSavedAt), "MMM d, h:mm a")}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-center overflow-x-auto border-y border-border/60 py-2 lg:border-0 lg:py-1">
            <StudioStepper currentStep={step} completedSteps={completedSteps} onStepClick={setStep} />
          </div>

          <div className="flex min-h-[3rem] flex-wrap items-center justify-end gap-2 lg:min-h-14">
            <span className="hidden text-right text-[11px] text-muted-foreground xl:inline">
              ⌘S save · Enter next
            </span>
            <Button variant="outline" size="sm" onClick={handleSaveDraft} className="h-9 gap-1.5">
              <Save className="h-3.5 w-3.5" /> Save Draft
            </Button>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {step === 1 && (
          <StepDetails
            name={name} setName={setName}
            description={description} setDescription={setDescription}
            category={category} setCategory={setCategory}
            icon={icon} setIcon={setIcon}
            visibility={visibility} setVisibility={setVisibility}
            responseTime={responseTime} setResponseTime={setResponseTime}
            resolutionTime={resolutionTime} setResolutionTime={setResolutionTime}
          />
        )}
        {step === 2 && (
          <StepFormBuilder
            fields={formFields}
            onFieldsChange={setFormFields}
            serviceName={name || "New Service"}
          />
        )}
        {step === 3 && (
          <StudioWorkflowStep
            serviceId={serviceId}
            serviceName={name}
            formFields={formFields}
          />
        )}
        {step === 4 && (
          <StepReview
            service={buildServiceObject()}
            formFields={formFields}
            workflowStages={reviewWorkflow?.stages ?? []}
            workflowName={reviewWorkflow?.name}
            onEdit={setStep}
            onPublish={handlePublish}
            isPublishing={isPublishPending}
          />
        )}
      </div>

      <div className="flex h-14 items-center justify-between border-t border-border bg-background px-6">
        <Button variant="ghost" onClick={goPrev} disabled={step === 1} className="gap-1.5 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Previous
        </Button>
        {step < 4 ? (
          <Button onClick={goNext} className="h-9 gap-1.5">
            Next Step <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handlePublish}
            disabled={isPublishPending}
            className="h-9 gap-1.5 bg-emerald-600 hover:bg-emerald-700"
          >
            {isPublishPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Rocket className="h-4 w-4" />
            )}{" "}
            Publish Service
          </Button>
        )}
      </div>
    </div>
  );
}

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Service, Workflow, ServiceRequest, RequestStatus } from "./types";
import { mockServices, mockWorkflows, mockRequests } from "./mock-data";
import { generateId, generateTicketNumber } from "./utils";

interface TasheelStore {
  services: Service[];
  addService: (service: Service) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;
  duplicateService: (id: string) => Service | null;
  publishService: (id: string) => void;
  unpublishService: (id: string) => void;
  archiveService: (id: string) => void;

  workflows: Workflow[];
  addWorkflow: (workflow: Workflow) => void;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void;
  linkWorkflowToService: (serviceId: string, workflowId: string) => void;

  requests: ServiceRequest[];
  submitRequest: (request: Omit<ServiceRequest, "id" | "ticketNumber">) => ServiceRequest;
  advanceRequest: (requestId: string, action: string, actorName?: string, comment?: string) => void;
  rejectRequest: (requestId: string, comment: string, actorName?: string) => void;
  reassignRequest: (requestId: string, newAssignee: string, actorName?: string) => void;
  cancelRequest: (requestId: string, reason: string, actorName?: string) => void;
  addRequestComment: (requestId: string, comment: string, actor: string) => void;

  currentPortal: "admin" | "requester";
  setPortal: (portal: "admin" | "requester") => void;

  resetToDefaults: () => void;
}

export const useTasheelStore = create<TasheelStore>()(
  persist(
    (set, get) => ({
      services: mockServices,

      addService: (service) =>
        set((state) => ({ services: [...state.services, service] })),

      updateService: (id, updates) =>
        set((state) => ({
          services: state.services.map((s) =>
            s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
          ),
        })),

      deleteService: (id) =>
        set((state) => ({
          services: state.services.filter((s) => s.id !== id),
        })),

      duplicateService: (id) => {
        const state = get();
        const original = state.services.find((s) => s.id === id);
        if (!original) return null;
        const now = new Date().toISOString();
        const copy: Service = {
          ...original,
          id: generateId(),
          name: `Copy of ${original.name}`,
          status: "draft",
          formFields: original.formFields.map((f) => ({ ...f })),
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ services: [...s.services, copy] }));
        return copy;
      },

      publishService: (id) =>
        set((state) => ({
          services: state.services.map((s) =>
            s.id === id
              ? { ...s, status: "published" as const, updatedAt: new Date().toISOString() }
              : s
          ),
        })),

      unpublishService: (id) =>
        set((state) => ({
          services: state.services.map((s) =>
            s.id === id
              ? { ...s, status: "draft" as const, updatedAt: new Date().toISOString() }
              : s
          ),
        })),

      archiveService: (id) =>
        set((state) => ({
          services: state.services.map((s) =>
            s.id === id
              ? { ...s, status: "archived" as const, updatedAt: new Date().toISOString() }
              : s
          ),
        })),

      workflows: mockWorkflows,

      addWorkflow: (workflow) =>
        set((state) => ({ workflows: [...state.workflows, workflow] })),

      updateWorkflow: (id, updates) =>
        set((state) => ({
          workflows: state.workflows.map((w) =>
            w.id === id ? { ...w, ...updates } : w
          ),
        })),

      linkWorkflowToService: (serviceId, workflowId) =>
        set((state) => ({
          services: state.services.map((s) =>
            s.id === serviceId
              ? { ...s, workflowId, updatedAt: new Date().toISOString() }
              : s
          ),
        })),

      requests: mockRequests,

      submitRequest: (request) => {
        const newRequest: ServiceRequest = {
          ...request,
          id: generateId(),
          ticketNumber: generateTicketNumber(),
        };
        set((state) => ({ requests: [...state.requests, newRequest] }));
        return newRequest;
      },

      advanceRequest: (requestId, action, actorName = "Sarah Mitchell", comment) => {
        const state = get();
        const request = state.requests.find((r) => r.id === requestId);
        if (!request) return;

        const service = state.services.find((s) => s.id === request.serviceId);
        const workflow = state.workflows.find((w) => w.id === service?.workflowId);
        if (!workflow) return;

        const currentStageIndex = workflow.stages.findIndex(
          (s) => s.id === request.currentStage
        );
        if (currentStageIndex === -1) return;

        const nextStage = workflow.stages[currentStageIndex + 1];
        if (!nextStage) return;

        const nextStatus: RequestStatus =
          nextStage.type === "end" ? "completed" : "in_review";

        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  currentStage: nextStage.id,
                  status: nextStatus,
                  updatedAt: new Date().toISOString(),
                  history: [
                    ...r.history,
                    {
                      stageId: nextStage.id,
                      stageName: nextStage.name,
                      action,
                      actor: actorName,
                      timestamp: new Date().toISOString(),
                      comment,
                    },
                  ],
                }
              : r
          ),
        }));
      },

      rejectRequest: (requestId, comment, actorName = "Sarah Mitchell") => {
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  status: "rejected" as const,
                  updatedAt: new Date().toISOString(),
                  history: [
                    ...r.history,
                    {
                      stageId: r.currentStage,
                      stageName: "Rejected",
                      action: "Request Rejected",
                      actor: actorName,
                      timestamp: new Date().toISOString(),
                      comment,
                    },
                  ],
                }
              : r
          ),
        }));
      },

      reassignRequest: (requestId, newAssignee, actorName = "Sarah Mitchell") => {
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  updatedAt: new Date().toISOString(),
                  history: [
                    ...r.history,
                    {
                      stageId: r.currentStage,
                      stageName: "Reassigned",
                      action: `Reassigned to ${newAssignee}`,
                      actor: actorName,
                      timestamp: new Date().toISOString(),
                    },
                  ],
                }
              : r
          ),
        }));
      },

      cancelRequest: (requestId, reason, actorName = "Sarah Mitchell") => {
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  status: "cancelled" as const,
                  updatedAt: new Date().toISOString(),
                  history: [
                    ...r.history,
                    {
                      stageId: r.currentStage,
                      stageName: "Cancelled",
                      action: "Request Cancelled",
                      actor: actorName,
                      timestamp: new Date().toISOString(),
                      comment: reason,
                    },
                  ],
                }
              : r
          ),
        }));
      },

      addRequestComment: (requestId, comment, actor) => {
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  updatedAt: new Date().toISOString(),
                  history: [
                    ...r.history,
                    {
                      stageId: r.currentStage,
                      stageName: "Comment",
                      action: "Comment Added",
                      actor,
                      timestamp: new Date().toISOString(),
                      comment,
                    },
                  ],
                }
              : r
          ),
        }));
      },

      currentPortal: "admin",
      setPortal: (portal) => set({ currentPortal: portal }),

      resetToDefaults: () =>
        set({
          services: mockServices,
          workflows: mockWorkflows,
          requests: mockRequests,
        }),
    }),
    {
      name: "tasheel-store",
    }
  )
);

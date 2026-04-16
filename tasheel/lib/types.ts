export type ServiceCategory = 'it' | 'hr' | 'facilities' | 'finance' | 'general';

/** Who can see the service in the requester catalog (when published). */
export type ServiceVisibility = 'internal' | 'public';

export type RequestStatus = 'submitted' | 'in_review' | 'approved' | 'rejected' | 'completed' | 'cancelled';

export interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'file' | 'number' | 'email';
  label: string;
  /** Optional longer helper shown between label and control (spec). */
  description?: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  options?: string[];
  order: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  icon: string;
  /** Defaults to internal when omitted (persisted clients). */
  visibility?: ServiceVisibility;
  status: 'draft' | 'published' | 'archived';
  sla: {
    responseTime: number;
    resolutionTime: number;
  };
  formFields: FormField[];
  workflowId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowStage {
  id: string;
  name: string;
  type: 'start' | 'task' | 'gateway' | 'end';
  assignee?: string;
  order: number;
}

import type { WorkflowFlowDefinition } from "./workflow-flow-types";

export interface Workflow {
  id: string;
  name: string;
  description: string;
  /** React Flow graph from the visual designer. */
  flowDefinition: WorkflowFlowDefinition | null;
  stages: WorkflowStage[];
  createdAt: string;
}

export interface RequestHistoryEntry {
  stageId: string;
  stageName: string;
  action: string;
  actor: string;
  timestamp: string;
  comment?: string;
}

export interface ServiceRequest {
  id: string;
  ticketNumber: string;
  serviceId: string;
  serviceName: string;
  requesterId: string;
  requesterName: string;
  status: RequestStatus;
  currentStage: string;
  formData: Record<string, unknown>;
  history: RequestHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'requester' | 'approver';
  department: string;
  jobTitle: string;
  managerId?: string;
  managerName?: string;
  avatar?: string;
  isActive: boolean;
}

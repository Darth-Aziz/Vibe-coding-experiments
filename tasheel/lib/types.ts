/** Workspace preferences persisted with the demo store. */
export interface WorkspaceSettings {
  platformName: string;
  ticketPrefix: string;
  defaultResponseSlaHours: number;
}

export type ServiceCategory = 'it' | 'hr' | 'facilities' | 'finance' | 'general';

/** Who can see the service in the requester catalog (when published). */
export type ServiceVisibility = 'internal' | 'public';

export type RequestStatus = 'submitted' | 'in_review' | 'approved' | 'rejected' | 'completed' | 'cancelled';

export interface FormField {
  id: string;
  type:
    | 'text'
    | 'textarea'
    | 'select'
    | 'radio'
    | 'checkbox'
    | 'date'
    | 'time'
    | 'file'
    | 'number'
    | 'email'
    | 'url'
    | 'tel';
  label: string;
  /** Optional longer helper shown between label and control (spec). */
  description?: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  options?: string[];
  order: number;
  /** Min character length (text-like types). */
  minLength?: number;
  /** Max character length (text-like types). */
  maxLength?: number;
  /** Min value for number fields. */
  min?: number;
  /** Max value for number fields. */
  max?: number;
  /** Step for number fields. */
  step?: number;
  /**
   * Default country (ISO 3166-1 alpha-2) for `tel` fields — flag + dial code in the picker.
   */
  phoneDefaultCountry?: string;
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
  /** Owning queue (usually matches service category). */
  queueKey?: ServiceCategory;
  /** Agent currently responsible (round-robin or manual). Null/omit = unassigned pool. */
  assignedToId?: string | null;
  assignedToName?: string | null;
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

import type { LucideIcon } from "lucide-react";
import {
  Database,
  Globe,
  Mail,
  MessageSquare,
} from "lucide-react";
import type { WorkflowActionType } from "@/lib/workflow-flow-types";

export const ACTION_TYPE_META: Record<
  WorkflowActionType,
  { icon: LucideIcon; label: string; color: string; bg: string }
> = {
  email: {
    icon: Mail,
    label: "Send Email",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
  },
  webhook: {
    icon: Globe,
    label: "Webhook POST",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10",
  },
  update_record: {
    icon: Database,
    label: "Update Record",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  slack: {
    icon: MessageSquare,
    label: "Slack Alert",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
};

export const CONDITION_OPERATORS: { value: string; label: string }[] = [
  { value: "equals", label: "== equals" },
  { value: "not_equals", label: "!= not equals" },
  { value: "contains", label: "contains" },
  { value: "gt", label: "> greater than" },
  { value: "lt", label: "< less than" },
  { value: "gte", label: ">= greater or equal" },
  { value: "lte", label: "<= less or equal" },
  { value: "is_empty", label: "is empty" },
  { value: "is_not_empty", label: "is not empty" },
];

export const SYSTEM_VARIABLES_LIST: {
  id: string;
  name: string;
  label: string;
  group: string;
}[] = [
  { id: "sys_submitter", name: "sys.submitter_name", label: "Submitter Name", group: "System" },
  { id: "sys_email", name: "sys.submitter_email", label: "Submitter Email", group: "System" },
  { id: "sys_date", name: "sys.submission_date", label: "Submission Date", group: "System" },
  { id: "sys_id", name: "sys.request_id", label: "Request ID", group: "System" },
  { id: "sys_status", name: "sys.current_status", label: "Current Status", group: "System" },
  { id: "wf_approver", name: "wf.last_approver", label: "Last Approver", group: "Workflow" },
  { id: "wf_decision", name: "wf.approval_decision", label: "Approval Decision", group: "Workflow" },
  { id: "wf_comments", name: "wf.approval_comments", label: "Approval Comments", group: "Workflow" },
];

export const ASSIGNEE_OPTIONS = [
  { value: "Manager", label: "Line Manager" },
  { value: "IT Team", label: "IT Team" },
  { value: "HR Team", label: "HR Team" },
  { value: "Security", label: "Security Dept" },
  { value: "System", label: "System" },
] as const;

export function getActionFieldKeys(type: WorkflowActionType): string[] {
  switch (type) {
    case "email":
      return ["to", "subject", "body"];
    case "webhook":
      return ["url", "method", "payload"];
    case "update_record":
      return ["field", "value"];
    case "slack":
      return ["channel", "message"];
    default:
      return ["value"];
  }
}

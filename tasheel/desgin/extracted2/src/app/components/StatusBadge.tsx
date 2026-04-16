import { Badge } from "./ui/badge";

const statusConfig: Record<string, "success" | "warning" | "danger" | "info" | "default" | "secondary" | "outline"> = {
  Draft: "outline",
  Published: "success",
  Archived: "secondary",
  Submitted: "info",
  'In Review': "warning",
  Approved: "success",
  Rejected: "danger",
  Completed: "success",
  Active: "success",
  Pending: "warning",
  Failed: "danger",
};

export function StatusBadge({ status }: { status: string }) {
  const variant = statusConfig[status] || "default";
  const displayStatus = status || "Unknown";
  return (
    <Badge variant={variant}>
      {displayStatus}
    </Badge>
  );
}

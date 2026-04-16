import { Badge, badgeVariants } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

const STATUS_MAP: Record<string, BadgeVariant> = {
  draft: "outline",
  published: "success",
  archived: "secondary",
  submitted: "info",
  in_review: "warning",
  approved: "success",
  rejected: "danger",
  completed: "success",
  cancelled: "secondary",
  active: "success",
  pending: "warning",
  failed: "danger",
};

function normalizeKey(status: string): string {
  return status.trim().toLowerCase().replace(/\s+/g, "_");
}

function resolveVariant(status: string): BadgeVariant {
  const key = normalizeKey(status);
  return STATUS_MAP[key] ?? "secondary";
}

function formatLabel(status: string): string {
  return status
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = resolveVariant(status);
  const label = formatLabel(status);

  return (
    <Badge variant={variant} className={cn(className)}>
      {label}
    </Badge>
  );
}

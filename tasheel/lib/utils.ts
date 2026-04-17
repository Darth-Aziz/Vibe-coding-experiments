import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import type { Service, ServiceVisibility } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

export function generateTicketNumber(prefix = "TSH"): string {
  const year = new Date().getFullYear()
  const seq = Math.floor(Math.random() * 9000) + 1000
  const clean = prefix.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() || "TSH"
  return `${clean}-${year}-${seq}`
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy")
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy 'at' h:mm a")
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    it: "bg-primary/10 text-primary",
    hr: "bg-secondary text-secondary-foreground",
    facilities: "bg-warning/10 text-warning-foreground",
    finance: "bg-success/10 text-success-foreground",
    general: "bg-muted text-foreground",
  }
  return colors[category] ?? colors.general
}

export function resolveServiceVisibility(
  visibility: ServiceVisibility | undefined
): ServiceVisibility {
  return visibility ?? "internal"
}

export function serviceVisibilityLabel(
  visibility: ServiceVisibility | undefined
): string {
  return resolveServiceVisibility(visibility) === "public" ? "Public" : "Internal only"
}

/** Human-readable SLA line for review cards and catalog. */
export function formatSlaSummary(sla: Service["sla"]): string {
  const r = sla.responseTime
  const res = sla.resolutionTime
  const fmt = (h: number) =>
    h % 24 === 0 && h >= 24 ? `${h / 24} day${h === 24 ? "" : "s"}` : `${h} hour${h === 1 ? "" : "s"}`
  return `Response ${fmt(r)}, resolution ${fmt(res)}`
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    published: "bg-success/10 text-success-foreground",
    archived: "bg-secondary text-secondary-foreground",
    submitted: "bg-info/10 text-info-foreground",
    in_review: "bg-warning/10 text-warning-foreground",
    approved: "bg-success/10 text-success-foreground",
    rejected: "bg-destructive/10 text-destructive",
    completed: "bg-success/10 text-success-foreground",
    cancelled: "bg-muted text-muted-foreground",
  }
  return colors[status] ?? colors.draft
}

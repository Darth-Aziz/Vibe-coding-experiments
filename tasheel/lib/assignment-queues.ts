import type { ServiceCategory, ServiceRequest } from "./types";
import { ADMIN_PERSONA } from "./admin-persona";

export type AssignmentAgent = { id: string; name: string };

export const QUEUE_LABELS: Record<ServiceCategory, string> = {
  it: "IT operations",
  hr: "HR desk",
  facilities: "Facilities",
  finance: "Finance",
  general: "General",
};

/** Per-queue round-robin pools (order defines rotation). */
export const ROUND_ROBIN_POOLS: Record<ServiceCategory, AssignmentAgent[]> = {
  it: [
    { id: ADMIN_PERSONA.id, name: ADMIN_PERSONA.name },
    { id: "usr_fatima", name: "Fatima Al-Saud" },
  ],
  hr: [
    { id: "usr_layla", name: "Layla Ahmad" },
    { id: ADMIN_PERSONA.id, name: ADMIN_PERSONA.name },
  ],
  facilities: [
    { id: "usr_maryam", name: "Maryam Al-Otaibi" },
    { id: ADMIN_PERSONA.id, name: ADMIN_PERSONA.name },
  ],
  finance: [
    { id: "usr_hassan", name: "Hassan Malik" },
    { id: ADMIN_PERSONA.id, name: ADMIN_PERSONA.name },
  ],
  general: [
    { id: ADMIN_PERSONA.id, name: ADMIN_PERSONA.name },
    { id: "usr_fatima", name: "Fatima Al-Saud" },
    { id: "usr_layla", name: "Layla Ahmad" },
  ],
};

export function pickNextAssignee(
  category: ServiceCategory,
  cursor: number
): { agent: AssignmentAgent; nextCursor: number } {
  const pool = ROUND_ROBIN_POOLS[category];
  if (pool.length === 0) {
    return {
      agent: { id: ADMIN_PERSONA.id, name: ADMIN_PERSONA.name },
      nextCursor: cursor + 1,
    };
  }
  const idx = cursor % pool.length;
  return { agent: pool[idx], nextCursor: cursor + 1 };
}

/** Queue for filters (handles older persisted rows missing `queueKey`). */
export function resolveRequestQueue(
  req: ServiceRequest,
  services: { id: string; category: ServiceCategory }[]
): ServiceCategory {
  if (req.queueKey) return req.queueKey;
  const svc = services.find((s) => s.id === req.serviceId);
  return svc?.category ?? "general";
}

export function getAllAssignableAgents(): AssignmentAgent[] {
  const seen = new Set<string>();
  const out: AssignmentAgent[] = [];
  for (const pool of Object.values(ROUND_ROBIN_POOLS)) {
    for (const a of pool) {
      if (!seen.has(a.id)) {
        seen.add(a.id);
        out.push(a);
      }
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

/** Ensures the current assignee appears as a Select option (handles legacy / edited data). */
export function getAssigneeOptionsForRequest(req: ServiceRequest): AssignmentAgent[] {
  const base = getAllAssignableAgents();
  const id = req.assignedToId;
  if (id == null || id === "") return base;
  if (base.some((a) => a.id === id)) return base;
  const name = req.assignedToName?.trim() || "Unknown agent";
  return [...base, { id, name }].sort((a, b) => a.name.localeCompare(b.name));
}

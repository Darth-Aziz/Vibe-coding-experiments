# Admin Portal PRD — Overview & Scope

## 1. Product summary

The **Admin portal** is a browser-based **service operations console** for Tasheel: configure services (catalog + forms + workflows), monitor and triage **service requests**, and manage **workspace demo settings**. In the current implementation, **all data persists in the user’s browser** via `localStorage` (Zustand `persist`); there is **no server-side multi-user backend** in this repo.

## 2. Goals

1. **Catalog management**: Create, edit, publish, and organize **services** with SLAs, visibility, dynamic **request forms**, and **workflow** linkage.
2. **Request operations**: View, filter, sort, and act on **requests** with **SLA awareness**, **team queues**, **assignment** (round-robin on create + manual override), and workflow stage context.
3. **Operational clarity**: Dashboard **at-a-glance** metrics, **needs attention** signals, and **deep links** into filtered lists.
4. **Demo hygiene**: **Export** and **reset** workspace data; configurable **platform name**, **ticket prefix**, and **default SLA** reference values.

## 3. Primary persona

| Persona | Role | Needs |
|--------|------|--------|
| **Service admin / operations** (demo: Abdulaziz Alhuwayhsan) | Owns catalog, workflows, and triage | Fast navigation, filters, assignment, SLA visibility |

Persona constants live in `lib/admin-persona.ts` and drive **“My tickets”** filters and round-robin pool membership.

## 4. In scope (this codebase)

- All routes under `/admin/*` as implemented.
- Client-side state: services, workflows, requests, workspace settings, assignment round-robin cursors.
- **Requester portal** is **out of admin PRD detail** except where admin actions depend on it (e.g. new submissions).

## 5. Explicit non-goals (current demo)

- Real authentication, RBAC, or audit log backend.
- Email / Slack notifications.
- Multi-tenant org model.
- Server-side workflow execution engine (routing is **simulated** via store transitions).
- Import of exported JSON via UI (Settings copy mentions import conceptually; **only Export** is implemented in UI).

## 6. Core entities (conceptual)

| Entity | Purpose |
|--------|---------|
| **Service** | Published or draft catalog item: metadata, SLA, form fields, optional `workflowId`. |
| **Workflow** | Template: ordered **stages** (`start`, `task`, `gateway`, `end`), optional `flowDefinition` for visual designer, optional `assignee` on stages. |
| **Service request** | Ticket: links to service, requester, `status`, `currentStage`, `history`, **queue** (`queueKey`), **assignee** (`assignedToId` / `assignedToName`). |
| **Workspace settings** | `platformName`, `ticketPrefix`, `defaultResponseSlaHours`. |

## 7. Request statuses (admin-visible)

`submitted`, `in_review`, `approved`, `rejected`, `completed`, `cancelled` — used in filters, badges, and SLA calculations (breach logic typically ignores terminal states).

## 8. Service statuses

`draft`, `published`, `archived` — list filters and publish/unpublish actions on overview.

## 9. Categories (fixed taxonomy)

`it`, `hr`, `facilities`, `finance`, `general` — used for service classification, **assignment queue** resolution, and requester browsing. Categories page is **informational** (counts per category); **CRUD for categories** is not implemented.

## 10. Success metrics (product)

- Admin can **find** a request in &lt; 30 seconds via search + scope chips + URL shareable filters.
- Admin can **reassign** without leaving the list (row menu) or from the **detail** page.
- Admin can **publish** a new service end-to-end via the **studio** without data loss (autosave + explicit save).

## 11. Related documents

- [01-shell-navigation.md](./01-shell-navigation.md)
- [02-dashboard.md](./02-dashboard.md)
- [03-services-and-studio.md](./03-services-and-studio.md)
- [04-workflows.md](./04-workflows.md)
- [05-requests-assignments.md](./05-requests-assignments.md)
- [06-categories-settings-data.md](./06-categories-settings-data.md)

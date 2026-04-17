# Admin Portal PRD — Requests, Queues & Assignments

## 1. Request list (`/admin/requests`)

### 1.1 Purpose

Operate the **inbox**: filter by work ownership, **team queue** (category), SLA presets, service, status, text search, sort; act via **row menu**; share views via URL.

**Suspense:** Inner list is wrapped in `Suspense` for `useSearchParams`.

### 1.2 URL query parameters

| Param | Values | Default | Notes |
|-------|--------|---------|-------|
| `q` | string | — | Search ticket #, service name, requester, assignee name |
| `service` | service id or `all` | `all` | |
| `status` | request status or `all` | `all` | Choosing status **clears** `filter`, `work`, `queue` |
| `sort` | `date` \| `sla` | `date` | `sla` sorts open tickets by **remaining** resolution hours |
| `filter` | `pending` \| `breached` | — | Presets; clears other competing params per button |
| `work` | `all` \| `me` \| `unassigned` \| **user id** | `all` | **Me** = `assignedToId === ADMIN_PERSONA.id` |
| `queue` | `all` \| `it` \| `hr` \| `facilities` \| `finance` \| `general` | `all` | Matches `resolveRequestQueue(req, services)` |

**`router.replace`** with `scroll: false` keeps UX stable.

### 1.3 Work scope chips

1. **All open queues** — clears `filter`, `work`, `queue`
2. **My tickets** — `work=me`
3. **Unassigned** — `work=unassigned` (`assignedToId` null or `""`)
4. **Team queues** — one chip per category; sets `queue`, clears `filter`

### 1.4 SLA & status chips

- **Pending review** → `filter=pending` (`submitted` or `in_review`)
- **SLA breached** → `filter=breached` (non-terminal + resolution elapsed)

### 1.5 Dropdown filters + search

- **All Services** select
- **All Statuses** select
- **Sort:** Newest submitted vs SLA urgency
- **SearchBar** bound to `q`

### 1.6 Table columns

Ticket # (link), Service, Requester, **Queue** (label from `QUEUE_LABELS`), **Assignee**, Status, Current Stage (from workflow), SLA cell (remaining / breached styling), Submitted date, actions ⋮.

### 1.7 Row actions (dropdown)

Requirements vary by row; typical items include:

- Open detail (eye icon)
- **Advance** (when `submitted` or `in_review`)
- **Reject** (dialog reason)
- **Assign to…** submenu: **Me**, **Unassigned**, full agent list (`getAllAssignableAgents`)
- **View Service** link

Toasts on success.

---

## 2. Assignment & queues (product rules)

### 2.1 Queue key

- On **new** submissions (`submitRequest` in store): `queueKey` = service **`category`** (fallback `general`).
- **Legacy rows** without `queueKey`: `resolveRequestQueue` falls back to service category by `serviceId`, then `general`.

### 2.2 Round-robin on create

- Per category, `assignmentRoundRobinCursor` rotates through `ROUND_ROBIN_POOLS[category]`.
- New request gets `assignedToId` / `assignedToName` from `pickNextAssignee`.
- **Ticket number** uses `workspaceSettings.ticketPrefix` + generator.

### 2.3 Manual reassignment

- `reassignRequest(id, { id, name })`
- Empty `id` → **release** to unassigned (`assignedToId` / `assignedToName` null) + history entry.

### 2.4 Assignee select safety

- Request detail **Select** uses `getAssigneeOptionsForRequest` so **orphan** assignee ids (not in pool) still appear as an option (persisted data).

---

## 3. Request detail (`/admin/requests/[id]`)

### 3.1 Header

- Breadcrumb: Requests → ticket number
- Title: ticket number
- Description: service name, requester, created time
- Actions: `StatusBadge`

### 3.2 Queue & assignment card

- **Team queue** label
- Copy on round-robin + override
- **Assignee** `Select`: unassign + agents (with “(you)” for admin persona)

### 3.3 SLA breach banner

If request **open** and **resolution** SLA breached: destructive banner with hours over.

### 3.4 Admin action bar (when `canAdvance`)

`canAdvance` = status in `submitted`, `in_review`.

- **Advance** → `advanceRequest` (moves to next workflow stage; completes if next is `end`)
- **Reject** → dialog with required reason → `rejectRequest`
- **Add Comment** → `addRequestComment` (requires non-empty comment textarea)

Comment textarea also shown in column layout when `canAdvance`.

### 3.5 Workflow progress

Horizontal tracker over non-start stages: completed / current (pulsing) / rejected / upcoming.

**Note:** Stage index uses full `workflow.stages` including start for `currentStageIndex` comparisons in tracker implementation.

### 3.6 Request data

Renders `formData` key/value; arrays joined with comma.

### 3.7 SLA status card

For open requests with service: response + resolution targets; badges **Breached** vs **On Track** / remaining hours.

### 3.8 Activity timeline

Reverse-chronological `history`: action, actor, timestamp, optional quoted comment.

---

## 4. Store: request lifecycle (admin-relevant)

| Action | Effect |
|--------|--------|
| `advanceRequest` | Requires workflow; finds current stage index; moves to **next** stage; if next `type === "end"` → `completed`, else `in_review`; appends history |
| `rejectRequest` | `rejected` + history |
| `reassignRequest` | Updates assignee + history |
| `cancelRequest` | Present in store (UI surface may be limited) |
| `addRequestComment` | History entry “Comment Added” |

---

## 5. Functional requirements

1. **FR-R1:** List filters MUST be reconstructible from URL alone (deep links).
2. **FR-R2:** `work=me` MUST match dashboard “assigned to you” definition.
3. **FR-R3:** New requester submissions MUST receive queue + assignee from round-robin (store), independent of admin UI.
4. **FR-R4:** Reassignment MUST write **auditable** history entries.
5. **FR-R5:** SLA breach visuals on list + detail MUST use service-linked resolution hours for non-terminal requests.

## 6. Known limitations

- **Agent directory** is static pools in `assignment-queues.ts`, not admin-configurable UI.
- **Advance** is linear stage walk; gateways do not branch per business rules in store logic.

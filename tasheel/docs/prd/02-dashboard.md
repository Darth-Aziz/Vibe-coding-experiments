# Admin Portal PRD — Dashboard (`/admin`)

## 1. Purpose

Provide an **operational overview**: publishing health of the catalog, volume of work, **SLA risk**, and fast paths into **filtered request lists** and **service management**.

## 2. Page structure

### 2.1 Page header

- **Title:** Dashboard
- **Description:** Overview of services, publishing health, and latest request activity.

### 2.2 Needs attention strip

**Visibility:** Shown if **any** of:

- `myOpenTicketCount > 0` — open requests (`submitted` or `in_review`) **assigned to** `ADMIN_PERSONA.id`
- `pendingReviewCount > 0` — all requests in `submitted` or `in_review`
- `breachedCount > 0` — open requests whose **resolution SLA** (from linked service) is **elapsed**

**Chips (links):**

| Chip | Condition | Target URL |
|------|-----------|------------|
| **N assigned to you** | my open assigned count | `/admin/requests?work=me` |
| **N pending review** | pending count | `/admin/requests?filter=pending` |
| **N SLA breached** | breached count | `/admin/requests?filter=breached` |

**SLA breach rule:** For each request, resolve service by `serviceId`; if status **not** in `completed`, `cancelled`, `rejected`, compute remaining resolution hours vs `createdAt`; if `remaining <= 0`, count as breached.

### 2.3 KPI cards (4-up grid)

Each card is a **link** with icon, label, large numeric value, hover “View →”.

| Label | Value | Link |
|-------|-------|------|
| Total Services | `services.length` | `/admin/services` |
| Published | count `status === "published"` | `/admin/services?status=published` |
| Draft | count `status === "draft"` | `/admin/services?status=draft` |
| Total Requests | `requests.length` | `/admin/requests` |

### 2.4 Recent requests

**Header:** “Recent Requests” + **View all** → `/admin/requests` (if any requests).

**Data:** Sort all requests by `createdAt` descending; take **6**.

**Empty state:** Icon inbox, title “No requests yet”, CTA **Create a service** → `/admin/services/new`.

**Table columns:**

| Column | Behavior |
|--------|----------|
| Ticket | Monospace link → `/admin/requests/[id]` |
| Service | `serviceName` |
| Requester | `requesterName` |
| Status | `StatusBadge` + optional **SLA line** for non-terminal statuses (breached / warning / ok coloring) |
| Date | Relative **time since** (`Xm ago`, `Xh ago`, `Yesterday`, or formatted date) |

**SLA sub-line:** For non-terminal requests with a resolved service, show e.g. `SLA: Nh left` or `SLA: Breached (overdue)` with icon when breached.

### 2.5 Bottom CTAs

- **Create Service** (primary) → `/admin/services/new`
- **View All Services** (outline) → `/admin/services`

## 3. Time model

- Initial `now` uses a fixed SSR-friendly anchor then updates via `requestAnimationFrame` to live `Date.now()` for SLA and relative times.

## 4. Functional requirements

1. **FR-D1:** Needs-attention counts MUST reconcile with the same definitions used on the requests list (`filter=pending`, `filter=breached`, `work=me`).
2. **FR-D2:** KPI deep links MUST pass query params consumed by `/admin/services` or `/admin/requests` (see respective PRDs).
3. **FR-D3:** Recent table MUST deep-link to request detail without losing context.

## 5. Non-functional

- Dashboard MUST render with **zero requests** (empty state) without error.
- No additional network calls; reads Zustand store only.

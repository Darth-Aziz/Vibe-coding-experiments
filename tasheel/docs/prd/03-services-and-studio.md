# Admin Portal PRD — Services Catalog & Studio

## 1. Services list (`/admin/services`)

### 1.1 Purpose

Search and filter the **service catalog**, inspect **setup health** (form + workflow), open **studio** or **workflow designer**, and manage rows via **row actions**.

### 1.2 Filters & URL state

All filters persist via **`router.replace`** on the current pathname (shareable URLs).

| Query param | Values | Default | Behavior |
|-------------|--------|---------|----------|
| `q` | string | — | Case-insensitive match on **name** or **description** (description missing → treated as `""`) |
| `cat` | `all` \| category key | `all` | Category match |
| `status` | `all` \| `draft` \| `published` \| `archived` | `all` | Service status match |

### 1.3 Toolbar

- **Search input** with icon; updates `q` (clears param when empty).
- **Category chips:** All, IT Support, HR, Facilities, Finance, General — set `cat`.
- **Status chips:** All statuses, Draft, Published, Archived — set `status`.

### 1.4 Table

**Row click:** `router.push(/admin/services/{id}/studio)` — primary path to edit.

**Columns:**

| Column | Source / rule |
|--------|----------------|
| Service Name | `name` |
| Category | `category` (raw key) |
| Visibility | `serviceVisibilityLabel(visibility)` (defaults if omitted) |
| Status | `StatusBadge` |
| Setup | Icons: form fields count &gt; 0 (green/gray); `workflowId` truthy (green/gray); tooltips |
| Requests | Count of requests where `serviceId` matches |
| SLA | `formatSlaSummary(sla)` |
| Last Modified | `updatedAt` localized short date |
| Actions | ⋮ menu (stops row click propagation) |

### 1.5 Row actions (dropdown)

| Action | Behavior |
|--------|----------|
| Configure | Link → `/admin/services/{id}/studio` |
| Workflow editor | Link → `/admin/services/{id}/workflow` |
| Duplicate | `duplicateService`; toast; navigate to new service studio |
| Delete | `deleteService`; toast |

### 1.6 Empty state

- If **no services at all:** “No services yet” + CTA create.
- If **filtered empty:** “No matching services” + guidance to clear filters.

### 1.7 Page header CTA

**Create service** → `/admin/services/new`.

---

## 2. Service overview (`/admin/services/[id]`)

### 2.1 Purpose

**Read-oriented** service hub: metrics, SLA summary, form field list, workflow strip, quick actions, publish/unpublish.

### 2.2 Not found

`EmptyState` with link back to `/admin/services`.

### 2.3 Header actions

- **Publish** if `draft` → `publishService`, toast.
- **Unpublish** if `published` → `unpublishService`, toast.
- **Open in Studio** → `/admin/services/[id]/studio`.

### 2.4 Metrics (4 cards)

- Total requests for service
- Open requests (not terminal)
- Average resolution hours (completed only; `—` if none)
- Completion rate % (completed / total; 100% if no requests)

### 2.5 Configuration cards

- **SLA:** response + resolution hours.
- **Request form:** sorted fields by `order`; show `type`, required asterisk.
- **Workflow:** horizontal strip of stages (excludes `start`); shows assignee label when present; or “No workflow linked.”

### 2.6 Sidebar

- **Details:** created, updated, service id.
- **Quick actions:**
  - Edit in Studio
  - Edit Form → `studio?step=2` (**see gap** in shell PRD)
  - Edit Workflow → `studio?step=3` + dedicated workflow editor link pattern
  - View Requests → `/admin/requests?service={id}` if any requests

---

## 3. Service studio — create & edit

**Routes:** `/admin/services/new`, `/admin/services/[id]/studio`  
**Component:** `StudioLayout` (`components/admin/service-studio/studio-layout.tsx`)

### 3.1 Layout

- Full viewport **sticky header**: Back, breadcrumb (Services → service name → Studio), **status badge**, last saved time, **stepper**, Save Draft, hints (⌘S / Enter).
- **Scrollable body:** step content.
- **Footer bar:** Previous / Next (steps 1–3) or **Publish Service** on step 4.

### 3.2 Steps

| Step | Name | Content |
|------|------|---------|
| 1 | Details | `StepDetails` — name, description, category, icon, visibility, response/resolution SLA |
| 2 | Form | `StepFormBuilder` — dynamic fields, drag/reorder, validation metadata |
| 3 | Workflow | `StudioWorkflowStep` — ties into service workflow (opens designer context) |
| 4 | Review | `StepReview` — summary; publish CTA |

**Stepper:** Clickable steps that are completed or ≤ current step.

### 3.3 Validation (step 1 / publish)

- Name **≥ 3** chars.
- Description **≥ 10** chars.
- Response time integer **≥ 1**.
- Resolution time integer **≥ 1** and **&gt;** response time.

### 3.4 Persistence behavior

- **Autosave (debounced ~1.2s):** When name non-empty, `persistDraft({ silent: true })` — upserts service via `addService` / `updateService`.
- **⌘/Ctrl+S:** `persistDraft` with toast “Draft saved”.
- **Enter key:** Advances next step unless in textarea, dialog, or contenteditable; blocked on step ≥ 4.
- **Save Draft button:** Requires name; writes service; syncs workflow metadata name/description; toast “Service saved as draft”; **navigate to `/admin/services`**.

### 3.5 Workflow auto-provision (step 3)

When entering step 3, if service exists in store but has **no** `workflowId`:

- Create workflow id `wf-{timestamp}`
- `getMinimalDefaultFlowDefinition()` + `extractStagesFromFlow`
- `addWorkflow`, `linkWorkflowToService`

### 3.6 Publish

- Sets `status: "published"`.
- Upserts service, updates workflow metadata, **artificial delay ~1.2s**, toast, **navigate to `/admin/services`**.

### 3.7 IDs

- New service: `generateId()` once per mount; stable for session.

---

## 4. Per-service workflow designer (`/admin/services/[id]/workflow`)

### 4.1 Purpose

Edit **BPMN-style flow** for the workflow linked to this service (or create + link if missing).

### 4.2 Save semantics

- **If workflow exists:** `updateWorkflow` with `flowDefinition` + derived `stages` from `extractStagesFromFlow`.
- **Else:** `addWorkflow` with new id, `linkWorkflowToService`, toast “created and linked”.

### 4.3 UI

- `PageHeader` with breadcrumbs: Services → service name → Workflow.
- `WorkflowFlowDesigner` component; badge shows linked state.

---

## 5. Legacy form route

`/admin/services/[id]/form` **server-redirects** to `/admin/services/[id]/studio` (canonical form design in studio step 2).

---

## 6. Functional requirements summary

1. **FR-S1:** Services list MUST support shareable filter URLs (`q`, `cat`, `status`).
2. **FR-S2:** Row click MUST open studio; actions MUST not trigger row navigation.
3. **FR-S3:** Studio MUST autosave draft services without forcing publish.
4. **FR-S4:** Publishing MUST set published status and return operator to catalog list.
5. **FR-S5:** Workflow designer saves MUST update both graph definition and linear `stages` used for request routing in store logic.

## 7. Data resilience

List filtering uses defensive defaults for **missing description** and **missing formFields** (persisted skew).

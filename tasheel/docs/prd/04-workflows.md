# Admin Portal PRD — Workflow Templates

## 1. Workflow list (`/admin/workflows`)

### 1.1 Purpose

Browse **workflow templates**: stage flow preview, linkage to services, counts, created date. Entry point to **read-only detail** and hint to attach workflows **from the service studio**.

### 1.2 Page header

- **Title:** Workflow templates
- **Description:** Dynamic count + guidance to open a card or attach in studio.

### 1.3 Cards (one per workflow)

**Whole card** is a link → `/admin/workflows/[id]`.

**Content:**

- Icon + **name** + **description**
- **Stage strip:** ordered `stages` with type glyph (start / end / gateway / task) and **name**
- **Badges:** total stages, task-stage count
- **Linkage:** “N services linked” (emerald) or “Not linked”
- **Meta:** Created date (`formatDate`)

### 1.4 Empty state

If no workflows: empty state suggesting **Settings** reset/import if seed missing.

---

## 2. Workflow detail (`/admin/workflows/[id]`)

### 2.1 Purpose

**Inspect** a template: stage breakdown, assignee labels, linked services, metadata. This page does **not** embed the visual flow designer (designer is reached per-service under `/admin/services/[id]/workflow`).

### 2.2 Not found

Centered “Workflow not found.”

### 2.3 Header

- Breadcrumb: Workflows → workflow name
- Title: name
- Description: workflow description

### 2.4 Metric cards

- Total stages
- User tasks (`type === "task"`)
- Gateways count
- Linked services count

### 2.5 Stage list (main column)

Vertical list with:

- **Stage icon** by type (start green, end red, gateway diamond, task blue)
- **Name**
- **Type badge**
- Optional **assignee** with user icon
- **Order** index display (`order + 1` as #)

### 2.6 Linked services (sidebar / secondary)

Lists services where `workflowId === this workflow id` with links to `/admin/services/{id}`.

---

## 3. Stage model (requirements)

| Type | Meaning |
|------|---------|
| `start` | Flow entry |
| `task` | Human/manual step (may carry `assignee` string) |
| `gateway` | Branch/decision node |
| `end` | Terminal stage |

**Ordering:** `order` field; request routing in store advances by **array index** in `workflow.stages` (see requests PRD).

---

## 4. Relationship to services

- Services reference workflows via **`workflowId`** (nullable).
- **Studio** auto-creates a minimal workflow when entering workflow step if none linked.
- **Per-service workflow page** edits the linked workflow’s `flowDefinition` + `stages`.

---

## 5. Functional requirements

1. **FR-W1:** List MUST show accurate **service linkage** counts from live store.
2. **FR-W2:** Detail MUST list stages in store order with type and assignee.
3. **FR-W3:** Editing graph MUST remain possible only via **service-scoped** designer route (by current product design).

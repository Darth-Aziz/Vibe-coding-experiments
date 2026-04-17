# Admin Portal PRD — Categories, Settings & Data

## 1. Categories (`/admin/categories`)

### 1.1 Purpose

**Explain and quantify** the fixed service taxonomy: each category shows icon, human label, short description, and **count of services** in that category.

### 1.2 Category set (non-editable in UI)

| Key | Label | Theme |
|-----|-------|-------|
| `it` | IT Support | Technology / software |
| `hr` | HR | People operations |
| `facilities` | Facilities | Building / office |
| `finance` | Finance | Financial / accounting |
| `general` | General | General purpose |

### 1.3 Behavior

- Reads `services` from store; `count = services.filter(s => s.category === key).length`.
- **No CRUD:** categories cannot be added/renamed/archived in admin (code-level enum + labels).

### 1.4 Functional requirements

1. **FR-C1:** Counts MUST update live when services change category in studio.
2. **FR-C2:** Page MUST remain valid with zero services (all zeros).

---

## 2. Settings (`/admin/settings`)

### 2.1 Purpose

Configure **workspace branding / defaults** and perform **data export** or **destructive reset** of the demo.

### 2.2 General card

| Field | Storage | Behavior |
|-------|---------|----------|
| Platform Name | `workspaceSettings.platformName` | Free text; reflected in admin footer & header |
| Ticket Prefix | `workspaceSettings.ticketPrefix` | Max 12 chars; used when generating **new** ticket numbers |
| Default Response SLA (hours) | `workspaceSettings.defaultResponseSlaHours` | Integer ≥ 1; **informational** — copy states services keep their own SLA until aligned in studio |

All changes via `setWorkspaceSettings` (persisted with Zustand).

### 2.3 Data management card

**Export Data**

- Reads raw `localStorage` key **`tasheel-store`**
- Downloads JSON file `tasheel-data.json`
- Toast “Data exported”
- If key missing: no-op (no file)

**Import:** Not implemented in UI (despite descriptive copy mentioning import as a concept).

### 2.4 Danger zone — Reset

**Reset to Default Data** opens dialog:

- User must type **`RESET`** exactly to enable confirm button.
- On confirm:
  - `resetToDefaults()` (restores mock services, workflows, requests, default settings, assignment cursors)
  - `localStorage.removeItem("tasheel-store")`
  - Toast success
  - **Full page reload** (`window.location.reload()`)

---

## 3. Persistence model

### 3.1 Technology

- **Zustand** store with **`persist`** middleware.
- **Storage key:** `tasheel-store`
- **Browser-only** — clearing site data resets app to defaults on next load unless new data saved.

### 3.2 What is persisted

- `services`, `workflows`, `requests`
- `workspaceSettings`
- `assignmentRoundRobinCursor`
- `currentPortal` (and other root fields in store slice)

### 3.3 Schema drift

Some fields on `ServiceRequest` are **optional** in types (`queueKey`, assignee fields) so older JSON blobs do not crash the app; UI resolves queue via `resolveRequestQueue`.

---

## 4. Footer disclosure (admin layout)

Standard admin pages show footer: data stays in browser; point users to **Settings** for export/reset.

---

## 5. Functional requirements

1. **FR-ST1:** Settings changes MUST survive refresh (persist layer).
2. **FR-ST2:** Ticket prefix change MUST affect **only newly submitted** requests (existing ticket numbers unchanged).
3. **FR-ST3:** Reset MUST return store to deterministic demo baseline and clear persisted storage entry.
4. **FR-ST4:** Export MUST reflect exact persisted blob (including user edits).

---

## 6. Command palette overlap

**Reset Demo Data** in command palette also calls `resetToDefaults`, removes `tasheel-store`, navigates to `/admin` — similar outcome to Settings reset but **without** `RESET` typing gate (faster, less friction, higher risk).

**Product recommendation:** Align confirmation UX between Settings and palette if this is unintended.

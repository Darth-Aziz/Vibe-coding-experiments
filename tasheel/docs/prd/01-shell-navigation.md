# Admin Portal PRD — Shell, Navigation & Global UX

## 1. Route inventory

| Path | Purpose |
|------|---------|
| `/admin` | Dashboard |
| `/admin/services` | Service catalog table |
| `/admin/services/new` | Create service (studio, full-screen) |
| `/admin/services/[id]` | Service overview & metrics |
| `/admin/services/[id]/studio` | Edit service (studio, full-screen) |
| `/admin/services/[id]/form` | **Redirects** to `/admin/services/[id]/studio` |
| `/admin/services/[id]/workflow` | Visual workflow designer for service-linked workflow |
| `/admin/workflows` | Workflow template gallery |
| `/admin/workflows/[id]` | Workflow detail (stage inspector) |
| `/admin/requests` | Request queue / inbox |
| `/admin/requests/[id]` | Request detail & actions |
| `/admin/categories` | Category directory (read-only taxonomy) |
| `/admin/settings` | Workspace settings & data tools |

## 2. Layout modes (`app/admin/layout.tsx`)

### 2.1 Standard admin chrome

**When:** Any admin route **except** studio routes.

**Structure:**

- **Sidebar** (desktop): persistent navigation + badges.
- **Header**: admin badge, platform name, **command palette** trigger, **mobile menu** trigger, user avatar menu.
- **Main**: scrollable content, max width container, **footer** note about local-only data.

### 2.2 Studio / full-screen mode

**When:** Path contains `/studio` **or** path is `/admin/services/new`.

**Structure:**

- **No** sidebar/header shell — the **studio** provides its own sticky top bar and footer actions.
- **Command palette** still mounted (global).

## 3. Sidebar (`components/shared/sidebar.tsx`)

### 3.1 Sections & items

1. **Dashboard** → `/admin`
2. **Services**
   - All Services → `/admin/services` (badge: total service count)
   - Create Service → `/admin/services/new`
   - Categories → `/admin/categories`
3. **Workflows**
   - Templates → `/admin/workflows` (badge: workflow count)
4. **Requests**
   - All Requests → `/admin/requests` (badge: count of `submitted` + `in_review`)

### 3.2 Active state

- `/admin` matches exactly.
- Other items active when `pathname === href` or `pathname.startsWith(href + "/")`.

### 3.3 Mobile navigation

- **Sheet** drawer triggered from header **Menu** button (`AdminShellProvider` / `useAdminShell`).
- Same nav blocks; closing sheet on navigate.

## 4. Header (`components/shared/header.tsx`)

### 4.1 Left cluster

- **Mobile**: “Open navigation menu” icon button.
- **Admin** pill + “Browser demo” badge (sm+).
- **Platform name** + subtitle “Service operations console” (hidden on very small widths).

### 4.2 Command palette

- **Search** button opens palette via `openCommandPalette()`.
- Keyboard hint: **⌘K** (Mac) or **Ctrl+K** (non-Mac), `suppressHydrationWarning` on kbd.

### 4.3 User menu

- Shows **ADMIN_PERSONA** name (md+).
- Avatar opens dropdown: name, email, job title; **Profile** disabled; **Sign out** disabled (demo).

## 5. Command palette (`components/shared/command-palette.tsx`)

**Open/close:** ⌘/Ctrl **K** toggles; **ESC** closes (per command footer). Controlled by `AdminShellContext` when inside admin shell; uncontrolled fallback when studio-only layout.

### 5.1 Groups

1. **Quick actions**
   - Create New Service → `/admin/services/new`
   - View All Requests → `/admin/requests`
   - **Reset Demo Data** → runs `resetToDefaults()`, removes `tasheel-store` from `localStorage`, hard navigation to `/admin`

2. **Navigation** — Dashboard, Services, Workflows, Requests, Categories, Settings, **Requester Portal** (`/requester`)

3. **Services** (if any) — first **8** services → `/admin/services/[id]`

4. **Recent Requests** (if any) — first **6** requests (store order slice, not re-sorted) → `/admin/requests/[id]`

### 5.2 Search behavior

- `CommandInput` filters command items (library default); empty state: “No results found.”

## 6. Global footer (standard layout)

Explains: data stays in browser; **Settings** for export/reset demo.

## 7. Accessibility & UX requirements

- Sidebar links use `aria-current="page"` when active.
- Command palette trigger has explicit `aria-label`.
- Mobile nav trigger has `aria-label="Open navigation menu"`.

## 8. Implementation notes / gaps

- **Studio deep links**: Service overview links to `/admin/services/[id]/studio?step=2|3` intent is “jump to form/workflow step”; **studio does not currently read `step` from the query string** — user lands on default step 1 unless product adds URL sync.

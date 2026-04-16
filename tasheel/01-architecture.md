# Tasheel (تسهيل) — Technical Architecture Document

## 1. Project Overview

**Tasheel** is a two-sided service management platform that demonstrates enterprise-grade service catalog, dynamic form building, and BPMN-standard workflow management.

**Two portals, one app:**
- **Admin Portal** — create services, build forms, design BPMN workflows, publish services
- **Requester Portal** — browse service catalog, submit requests, track status through workflow stages

**Constraints:**
- Frontend-only (no backend, no database)
- Runs on localhost only
- Mock data via JSON / in-memory state
- Must be buildable in 2-3 days
- Will be modified live on stage using Cursor

---

## 2. Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 14 (App Router) | Simple routing, fast dev server, file-based pages |
| UI Library | shadcn/ui + Radix | Enterprise-clean components, accessible, customizable |
| Styling | Tailwind CSS 3.4 | Utility-first, fast iteration, great with AI tools |
| State Management | Zustand | Lightweight, no boilerplate, persists to localStorage |
| Workflow Designer | bpmn-js (Camunda) | Industry-standard BPMN 2.0, drag-and-drop canvas |
| Form Builder | @dnd-kit/core + custom | Drag-and-drop form field ordering, custom field types |
| Icons | Lucide React | Clean, consistent, works with shadcn/ui |
| Package Manager | npm | Standard, no config needed |

---

## 3. Folder Structure

```
tasheel/
├── app/
│   ├── layout.tsx                 # Root layout with sidebar navigation
│   ├── page.tsx                   # Landing / portal selector
│   │
│   ├── admin/
│   │   ├── layout.tsx             # Admin layout with admin sidebar
│   │   ├── page.tsx               # Admin dashboard (overview stats)
│   │   ├── services/
│   │   │   ├── page.tsx           # Service list (table view)
│   │   │   ├── new/
│   │   │   │   └── page.tsx       # Create new service
│   │   │   └── [id]/
│   │   │       ├── page.tsx       # Edit service details
│   │   │       ├── form/
│   │   │       │   └── page.tsx   # Form builder for this service
│   │   │       └── workflow/
│   │   │           └── page.tsx   # BPMN workflow designer for this service
│   │   └── workflows/
│   │       ├── page.tsx           # Workflow templates list
│   │       └── [id]/
│   │           └── page.tsx       # Edit workflow template
│   │
│   └── requester/
│       ├── layout.tsx             # Requester layout with requester nav
│       ├── page.tsx               # Service catalog (browse & search)
│       ├── services/
│       │   └── [id]/
│       │       └── page.tsx       # Service detail + submit request form
│       └── requests/
│           ├── page.tsx           # My requests list
│           └── [id]/
│               └── page.tsx       # Request detail + workflow status tracker
│
├── components/
│   ├── ui/                        # shadcn/ui components (button, card, table, etc.)
│   ├── admin/
│   │   ├── service-form.tsx       # Service creation/edit form
│   │   ├── form-builder.tsx       # Drag-and-drop form field builder
│   │   ├── field-config.tsx       # Field property editor (label, type, required, etc.)
│   │   ├── workflow-canvas.tsx    # bpmn-js wrapper component
│   │   ├── service-table.tsx      # Services data table
│   │   └── stats-cards.tsx        # Dashboard stat cards
│   ├── requester/
│   │   ├── service-catalog.tsx    # Service card grid with search/filter
│   │   ├── service-card.tsx       # Individual service card
│   │   ├── dynamic-form.tsx       # Renders form from field config
│   │   ├── request-tracker.tsx    # Visual workflow status tracker
│   │   └── request-table.tsx      # My requests table
│   └── shared/
│       ├── portal-selector.tsx    # Admin / Requester toggle
│       ├── sidebar.tsx            # Sidebar navigation
│       ├── header.tsx             # Top header bar
│       ├── status-badge.tsx       # Status indicator badges
│       └── search-bar.tsx         # Reusable search component
│
├── lib/
│   ├── store.ts                   # Zustand store (services, requests, workflows)
│   ├── mock-data.ts               # Pre-built mock services, requests, workflows
│   ├── types.ts                   # TypeScript interfaces
│   ├── bpmn-utils.ts              # BPMN XML helpers and default templates
│   └── utils.ts                   # General utilities (cn, formatDate, etc.)
│
├── public/
│   └── bpmn/
│       └── default-workflow.bpmn  # Default BPMN XML template
│
├── tailwind.config.ts
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

---

## 4. Data Models

### Service
```typescript
interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  icon: string;                    // Lucide icon name
  status: 'draft' | 'published' | 'archived';
  sla: {
    responseTime: number;          // hours
    resolutionTime: number;        // hours
  };
  formFields: FormField[];
  workflowId: string | null;       // linked BPMN workflow
  createdAt: string;
  updatedAt: string;
}

type ServiceCategory = 'it' | 'hr' | 'facilities' | 'finance' | 'general';
```

### Form Field
```typescript
interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'file' | 'number' | 'email';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];              // for select, radio, checkbox
  order: number;
}
```

### Workflow
```typescript
interface Workflow {
  id: string;
  name: string;
  description: string;
  bpmnXml: string;                 // BPMN 2.0 XML from bpmn-js
  stages: WorkflowStage[];         // extracted from BPMN for display
  createdAt: string;
}

interface WorkflowStage {
  id: string;
  name: string;
  type: 'start' | 'task' | 'gateway' | 'end';
  assignee?: string;
  order: number;
}
```

### Request
```typescript
interface ServiceRequest {
  id: string;
  ticketNumber: string;            // e.g., "TSH-2026-0042"
  serviceId: string;
  serviceName: string;
  requesterId: string;
  requesterName: string;
  status: RequestStatus;
  currentStage: string;            // current workflow stage ID
  formData: Record<string, any>;   // submitted form values
  history: RequestHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

type RequestStatus = 'submitted' | 'in_review' | 'approved' | 'rejected' | 'completed' | 'cancelled';

interface RequestHistoryEntry {
  stageId: string;
  stageName: string;
  action: string;
  actor: string;
  timestamp: string;
  comment?: string;
}
```

### Mock Users
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'requester' | 'approver';
  department: string;
  avatar?: string;
}
```

---

## 5. State Management (Zustand)

```typescript
// lib/store.ts — single store with slices

interface TasheelStore {
  // Services
  services: Service[];
  addService: (service: Service) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;
  publishService: (id: string) => void;

  // Workflows
  workflows: Workflow[];
  addWorkflow: (workflow: Workflow) => void;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void;
  linkWorkflowToService: (serviceId: string, workflowId: string) => void;

  // Requests
  requests: ServiceRequest[];
  submitRequest: (request: Omit<ServiceRequest, 'id' | 'ticketNumber'>) => void;
  advanceRequest: (requestId: string, action: string, comment?: string) => void;

  // UI State
  currentPortal: 'admin' | 'requester';
  setPortal: (portal: 'admin' | 'requester') => void;
}
```

State persists to localStorage via Zustand middleware. This means data survives page refreshes during the demo.

---

## 6. BPMN Integration Architecture

### How bpmn-js fits in:

```
Admin creates service
        │
        ▼
Admin opens workflow designer
        │
        ▼
bpmn-js canvas loads (drag-and-drop)
        │
        ▼
Admin draws: Start → Task → Gateway → Task → End
        │
        ▼
bpmn-js exports BPMN 2.0 XML
        │
        ▼
XML saved to workflow.bpmnXml in Zustand store
        │
        ▼
Stages extracted from XML for display in requester portal
        │
        ▼
When request submitted, status tracker shows progress through stages
```

### Key npm packages:
```json
{
  "bpmn-js": "^17.x",
  "bpmn-js-properties-panel": "^5.x",
  "@bpmn-io/properties-panel": "^3.x",
  "camunda-bpmn-moddle": "^7.x"
}
```

### Wrapper component approach:
```
workflow-canvas.tsx
├── Initializes bpmn-js Modeler in a ref'd div
├── Loads existing BPMN XML or default template
├── Provides toolbar: save, zoom, undo, redo, align
├── On save: exports XML → calls store.updateWorkflow()
├── Extracts stage names from XML for the status tracker
└── Cleanup on unmount (destroy modeler instance)
```

### Default BPMN template:
Pre-build a simple 4-stage workflow XML file:
`Start Event → User Task (Submit) → User Task (Review) → User Task (Approve) → End Event`

This loads automatically when admin creates a new workflow, giving them a starting point to modify rather than a blank canvas.

---

## 7. Form Builder Architecture

### How the form builder works:

```
Admin opens form builder for a service
        │
        ▼
Left panel: available field types (text, select, date, etc.)
        │
        ▼
Center: drag-and-drop canvas showing current form layout
        │
        ▼
Right panel: field properties (label, placeholder, required, options)
        │
        ▼
Admin drags fields from left to center, configures in right panel
        │
        ▼
Form config saved as FormField[] array in the service
        │
        ▼
Requester portal renders the form dynamically from this config
```

### Libraries:
- `@dnd-kit/core` + `@dnd-kit/sortable` for drag-and-drop
- No external form builder library — custom built with shadcn/ui components
- This keeps the codebase clean and easy to modify live during the demo

---

## 8. Page-by-Page Specification

### Landing Page (/)
Portal selector. Two cards: "Admin Portal" and "Requester Portal." Click to enter either view. Clean, centered, with the Tasheel logo.

### Admin Dashboard (/admin)
- 4 stat cards: Total Services, Published, Draft, Total Requests
- Recent requests table (last 5)
- Quick actions: Create Service, View All Services

### Service List (/admin/services)
- Data table with columns: Name, Category, Status, Requests, SLA, Actions
- Filter by category, status
- Search by name
- "Create Service" button

### Create/Edit Service (/admin/services/new or /admin/services/[id])
- Form: name, description, category (select), icon (icon picker), SLA response time, SLA resolution time
- Save as draft / Publish toggle
- Tabs or links to: Form Builder, Workflow Designer

### Form Builder (/admin/services/[id]/form)
- Three-panel layout: field palette | form preview | field properties
- Drag fields from palette to preview
- Click a field to edit its properties
- Reorder fields by dragging
- Preview shows exactly what requester will see

### Workflow Designer (/admin/services/[id]/workflow)
- Full bpmn-js canvas with toolbar
- Palette on left: start event, end event, task, exclusive gateway
- Properties panel on right: task name, assignee
- Save button exports BPMN XML
- "Link to Service" confirmation

### Service Catalog (/requester)
- Card grid showing published services
- Filter by category
- Search by name
- Each card shows: icon, name, description, category badge, SLA info

### Service Detail + Request Form (/requester/services/[id])
- Service info header (name, description, SLA)
- Dynamic form rendered from FormField[] config
- Submit button
- Success modal with ticket number

### My Requests (/requester/requests)
- Table: Ticket #, Service, Status, Submitted Date, Last Updated
- Filter by status
- Click to view detail

### Request Detail (/requester/requests/[id])
- Request info header
- Visual workflow tracker (horizontal stepper showing BPMN stages)
- Current stage highlighted
- History timeline: who did what, when, with comments
- Action buttons (if applicable): Cancel Request

---

## 9. Mock Data

Pre-build these services to make the demo feel real:

### Category: IT
1. **New Laptop Request** — form: employee name, department, laptop type (select: MacBook/ThinkPad/Dell), justification, urgency. Workflow: Submit → IT Review → Manager Approval → Procurement → Delivered.
2. **Software Access Request** — form: software name, license type, business justification. Workflow: Submit → IT Review → Approved.
3. **VPN Access Request** — form: employee name, reason, duration. Workflow: Submit → Security Review → Approved.

### Category: HR
4. **Employee Onboarding** — form: new hire name, start date, department, position, equipment needed. Workflow: Submit → HR Review → IT Setup → Manager Confirmation → Complete.
5. **Leave Request** — form: leave type (select: annual/sick/personal), start date, end date, reason. Workflow: Submit → Manager Approval → HR Record → Approved.

### Category: Facilities
6. **Meeting Room Booking** — form: room preference, date, time, attendees, AV equipment needed. Workflow: Submit → Availability Check → Confirmed.
7. **Maintenance Request** — form: location, issue type (select: electrical/plumbing/HVAC/furniture), description, priority. Workflow: Submit → Facilities Review → Assigned → Resolved.

Pre-build 8-10 sample requests in various stages for the "My Requests" view.

---

## 10. Routing Map

```
/                          → Portal selector
/admin                     → Admin dashboard
/admin/services            → Service list
/admin/services/new        → Create service
/admin/services/[id]       → Edit service
/admin/services/[id]/form  → Form builder
/admin/services/[id]/workflow → Workflow designer
/requester                 → Service catalog
/requester/services/[id]   → Service detail + request form
/requester/requests        → My requests list
/requester/requests/[id]   → Request detail + tracker
```

---

## 11. Demo Modification Targets

These are the changes you'll make LIVE on stage using Cursor:

### Quick wins (30 seconds each):
- Change a stat card value or label
- Add a new category badge color
- Change the SLA display format

### Medium modifications (1-2 minutes each):
- Add a new service to the catalog
- Add a new form field type (e.g., "phone number")
- Add a search bar to the service catalog
- Add an SLA breach indicator (red badge when overdue)

### Impressive modifications (2-3 minutes each):
- Add a new service with a custom form and link it to a workflow
- Add a status notification banner
- Add a "priority" column to the requests table with color coding
- Add an export button that generates a summary

---

## 12. Development Phases

### Day 1: Foundation
- Project setup (Next.js, Tailwind, shadcn/ui)
- Zustand store with mock data
- Root layout, sidebar, portal selector
- Admin: dashboard, service list table
- Requester: service catalog grid

### Day 2: Core Features
- Admin: service create/edit form
- Admin: form builder (drag-and-drop)
- Requester: dynamic form rendering
- Requester: request submission + confirmation
- Requester: my requests list + detail page with status tracker

### Day 3: BPMN + Polish
- Admin: bpmn-js workflow designer integration
- Link workflow to service
- Workflow stage extraction for status tracker
- Visual polish: animations, loading states, empty states
- Test full flow: create service → build form → design workflow → publish → submit request → track status
- Prepare demo branch and test live modifications

---

## 13. Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| No backend | Mock data in Zustand + localStorage | Demo simplicity, no server to crash on stage |
| bpmn-js Modeler (not Viewer) | Full editing capability | Admin needs to create/modify workflows |
| Custom form builder over library | @dnd-kit + shadcn/ui | Cleaner code, easier to modify live, no heavy dependencies |
| App Router over Pages Router | Next.js 14 convention | Cleaner file structure, layouts per portal |
| Single repo, two portals | Tab/route based switching | One `npm run dev`, one localhost, easy demo |
| localStorage persistence | Zustand persist middleware | Data survives page refreshes during demo |

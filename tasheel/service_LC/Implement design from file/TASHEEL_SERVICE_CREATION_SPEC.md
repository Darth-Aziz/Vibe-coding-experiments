# Tasheel Service Creation Lifecycle - Complete Implementation Specification

> **Purpose**: This is a line-by-line, pixel-perfect implementation reference for the entire Tasheel Service Creation lifecycle -- from the moment an admin clicks "Create Service" to the moment a requester submits a request against that service. It covers every screen, data model, animation, validation rule, keyboard shortcut, and cross-portal data flow. Intended for Cursor AI or any AI assistant to execute a complete, production-grade implementation.

---

## Table of Contents

1. [Architecture Overview & Data Flow](#1-architecture-overview--data-flow)
2. [Data Models & TypeScript Interfaces](#2-data-models--typescript-interfaces)
3. [ServiceContext - Global State Engine](#3-servicecontext---global-state-engine)
4. [Route Configuration](#4-route-configuration)
5. [Step 1: Service Details](#5-step-1-service-details)
6. [Step 2: Form Designer (Three-Panel IDE)](#6-step-2-form-designer-three-panel-ide)
7. [Step 3: Workflow Attachment](#7-step-3-workflow-attachment)
8. [Step 4: Review & Publish](#8-step-4-review--publish)
9. [Wizard Shell & Navigation Chrome](#9-wizard-shell--navigation-chrome)
10. [Admin Services List (Post-Publish)](#10-admin-services-list-post-publish)
11. [Requester Catalog (Dynamic Cards)](#11-requester-catalog-dynamic-cards)
12. [Requester Request Form (Dynamic Rendering)](#12-requester-request-form-dynamic-rendering)
13. [Requester My Requests & Detail View](#13-requester-my-requests--detail-view)
14. [Animation & Motion Patterns](#14-animation--motion-patterns)
15. [Keyboard Shortcuts](#15-keyboard-shortcuts)
16. [Toast Notification System](#16-toast-notification-system)
17. [Validation Rules](#17-validation-rules)
18. [Design System Tokens Reference](#18-design-system-tokens-reference)
19. [Edit Mode: Loading Existing Services](#19-edit-mode-loading-existing-services)
20. [End-to-End User Journey Walkthrough](#20-end-to-end-user-journey-walkthrough)
21. [Known Gaps & Future Enhancements](#21-known-gaps--future-enhancements)

---

## 1. Architecture Overview & Data Flow

### System Diagram

```
ADMIN PORTAL                                    REQUESTER PORTAL
============                                    ================

AdminServices.tsx                               RequesterCatalog.tsx
  |                                               |
  | click "Create Service"                        | reads services where
  | OR click row to edit                          | status === 'Published'
  v                                               |
AdminFormBuilder.tsx (4-Step Wizard)               | click card
  |                                               v
  | Step 1: Details (name, category, SLA...)     RequesterRequestForm.tsx
  | Step 2: Form Designer (fields, layout)        | dynamically renders form
  | Step 3: Workflow Attachment                   | fields from service.formFields[]
  | Step 4: Review & Publish                      |
  |                                               | submit
  | calls addService() or updateService()         v
  v                                             RequesterRequests.tsx
ServiceContext (React Context)                    | shows submitted requests
  |                                               |
  | in-memory state shared across portals         | click row
  |                                               v
  +---> AdminServices sees new/updated row      RequesterRequestDetail.tsx
  +---> RequesterCatalog sees new published card  | workflow progress + details
```

### Key Files

| File | Purpose | Route |
|------|---------|-------|
| `/src/app/context/ServiceContext.tsx` | Global state provider for services + submitted requests | N/A (wraps App) |
| `/src/app/pages/AdminServices.tsx` | Admin service catalog table with search/filter | `/admin/services` |
| `/src/app/pages/AdminFormBuilder.tsx` | 4-step service creation/edit wizard | `/admin/services/new` and `/admin/services/:id/form` |
| `/src/app/pages/RequesterCatalog.tsx` | Card grid of published services | `/requester` |
| `/src/app/pages/RequesterRequestForm.tsx` | Dynamic form rendered from service.formFields | `/requester/request/:id` |
| `/src/app/pages/RequesterRequests.tsx` | Table of submitted requests | `/requester/requests` |
| `/src/app/pages/RequesterRequestDetail.tsx` | Single request detail + workflow progress | `/requester/requests/:id` |

### Technology Stack

| Concern | Technology |
|---------|------------|
| Framework | React 18+ with TypeScript |
| Routing | react-router v7 (Data mode with `createBrowserRouter`) |
| Styling | Tailwind CSS v4 with CSS custom properties |
| UI Components | shadcn/ui (Button, Input, Card, Select, Switch, Badge, Separator, Label, Textarea, Table, DropdownMenu, Tabs) |
| Icons | lucide-react |
| Animation | motion/react (Framer Motion successor) |
| Toasts | sonner |
| Fonts | Inter (UI text), JetBrains Mono (data/mono values) |

---

## 2. Data Models & TypeScript Interfaces

### Service (the core entity)

```typescript
// /src/app/context/ServiceContext.tsx

export interface FormField {
  id: string;                    // unique, e.g. Date.now().toString()
  type: 'text' | 'textarea' | 'number' | 'email' | 'dropdown' | 'radio' | 'checkbox' | 'date' | 'file';
  label: string;                 // e.g. "Employee Name"
  required: boolean;             // red asterisk if true
  placeholder?: string;          // ghost text inside input
  helpText?: string;             // small muted text below field with AlertCircle icon
  description?: string;          // paragraph between label and input
  options?: string[];            // for dropdown, radio, checkbox types only
}

export interface WorkflowAttachment {
  id: string;                    // e.g. 'approval_path'
  name: string;                  // e.g. 'Standard Approval Path'
  type: 'approval_path' | 'auto_provision' | 'custom_wf';
}

export interface Service {
  id: string;                    // unique ID
  name: string;                  // "Hardware Refresh (Laptop)"
  category: string;              // "IT" | "HR" | "Facilities" | "Finance"
  status: 'Published' | 'Draft';
  requests: number;              // count of submitted requests
  sla: string;                   // "1 hour" | "4 hours" | "24 hours" | "48 hours" | "1 week"
  updated: string;               // formatted date string, e.g. "Apr 10, 2026"
  description?: string;          // rich text description
  icon?: string;                 // icon key: 'monitor' | 'briefcase' | 'box' | 'server'
  visibility?: string;           // 'internal' | 'public'
  formFields?: FormField[];      // <-- CRITICAL: the form fields designed in Step 2
  workflowId?: string;           // linked workflow ID from Step 3
}
```

### SubmittedRequest (requester-side)

```typescript
export interface SubmittedRequest {
  id: string;                    // unique
  ticket: string;                // formatted: "TSH-2026-XXXX"
  serviceId: string;             // links back to Service.id
  serviceName: string;           // denormalized for display
  status: 'Submitted' | 'In Review' | 'Approved' | 'Rejected' | 'Completed';
  submitted: string;             // formatted date
  formData: Record<string, any>; // key = field.id or field.label, value = user input
  workflowProgress?: WorkflowStep[];
}

export interface WorkflowStep {
  label: string;                 // "Submitted", "IT Review", "Manager Approval", etc.
  date: string;                  // "Apr 10" or empty if not yet reached
  done: boolean;
  current?: boolean;
}
```

---

## 3. ServiceContext - Global State Engine

### Current State (what exists)

The context currently provides:
- `services: Service[]` - array of services (7 default + any created)
- `addService(service: Service)` - prepends to array

### Required Enhancements

The context MUST be expanded to support:

```typescript
interface ServiceContextType {
  // --- Service CRUD ---
  services: Service[];
  addService: (service: Service) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;
  getServiceById: (id: string) => Service | undefined;

  // --- Submitted Requests ---
  requests: SubmittedRequest[];
  submitRequest: (request: SubmittedRequest) => void;
  getRequestsByServiceId: (serviceId: string) => SubmittedRequest[];
  getRequestById: (id: string) => SubmittedRequest | undefined;
}
```

### Default Services Enhancement

Each default service MUST include `formFields` so the requester form can render dynamically. Example for "New Laptop Request" (id: '1'):

```typescript
{
  id: '1',
  name: 'New Laptop Request',
  category: 'IT',
  status: 'Published',
  requests: 18,
  sla: '4 hours',
  updated: 'Apr 10, 2026',
  description: 'Request a new laptop for business use.',
  icon: 'monitor',
  visibility: 'internal',
  formFields: [
    { id: 'f1', type: 'text', label: 'Employee Name', required: true, placeholder: 'e.g. Jane Doe' },
    { id: 'f2', type: 'dropdown', label: 'Department', required: true, options: ['Engineering', 'Marketing', 'Sales', 'Human Resources'] },
    { id: 'f3', type: 'dropdown', label: 'Laptop Model', required: true, options: ['MacBook Pro 14"', 'MacBook Pro 16"', 'ThinkPad X1 Carbon', 'Dell XPS 15'] },
    { id: 'f4', type: 'textarea', label: 'Business Justification', required: true, placeholder: 'Explain the business need...', helpText: 'Include details about current device issues.' },
    { id: 'f5', type: 'radio', label: 'Urgency Level', required: true, options: ['Low', 'Medium', 'High'] },
  ],
  workflowId: 'approval_path',
}
```

### Default Submitted Requests

Seed 6 demo requests matching the existing `RequesterRequests.tsx` hardcoded data:

```typescript
const defaultRequests: SubmittedRequest[] = [
  {
    id: '42', ticket: 'TSH-2026-0042', serviceId: '1', serviceName: 'New Laptop Request',
    status: 'In Review', submitted: 'Apr 10, 2026',
    formData: { 'Employee Name': 'Ahmed Al-Rashid', 'Department': 'Engineering', 'Laptop Model': 'MacBook Pro 16"', 'Urgency Level': 'High', 'Business Justification': 'Current laptop is 4 years old and experiencing hardware failures.' },
    workflowProgress: [
      { label: 'Submitted', date: 'Apr 10', done: true },
      { label: 'IT Review', date: 'Apr 11', done: true },
      { label: 'Manager Approval', date: '', done: false, current: true },
      { label: 'Procurement', date: '', done: false },
      { label: 'Delivered', date: '', done: false },
    ]
  },
  { id: '41', ticket: 'TSH-2026-0041', serviceId: '3', serviceName: 'VPN Access', status: 'Approved', submitted: 'Apr 9, 2026', formData: {}, workflowProgress: [] },
  { id: '40', ticket: 'TSH-2026-0040', serviceId: '5', serviceName: 'Leave Request', status: 'Submitted', submitted: 'Apr 8, 2026', formData: {}, workflowProgress: [] },
  { id: '39', ticket: 'TSH-2026-0039', serviceId: '2', serviceName: 'Software Access', status: 'Completed', submitted: 'Apr 7, 2026', formData: {}, workflowProgress: [] },
  { id: '38', ticket: 'TSH-2026-0038', serviceId: '6', serviceName: 'Meeting Room Booking', status: 'Approved', submitted: 'Apr 7, 2026', formData: {}, workflowProgress: [] },
  { id: '37', ticket: 'TSH-2026-0037', serviceId: '7', serviceName: 'Expense Reimbursement', status: 'Rejected', submitted: 'Apr 5, 2026', formData: {}, workflowProgress: [] },
];
```

---

## 4. Route Configuration

### Current Routes (in `/src/app/routes.tsx`)

```typescript
// Admin routes
{ path: "services", Component: AdminServices },
{ path: "services/:id/form", Component: AdminFormBuilder },
{ path: "services/new", Component: AdminFormBuilder },
{ path: "workflows", Component: AdminWorkflow },

// Requester routes (need additions)
{ index: true, Component: RequesterCatalog },
```

### Required Route Additions

```typescript
// Under /requester children:
{ index: true, Component: RequesterCatalog },
{ path: "request/:id", Component: RequesterRequestForm },  // dynamic form
{ path: "requests", Component: RequesterRequests },          // my requests list
{ path: "requests/:id", Component: RequesterRequestDetail }, // single request detail
```

---

## 5. Step 1: Service Details

### Layout
- Full-width centered content area with `max-w-2xl`, padded `py-12 px-6`
- Background: `bg-muted/5`
- Single Card container with `p-6 space-y-6 shadow-sm border-border/50 bg-card`

### Fields

| Field | Component | Default Value | Validation |
|-------|-----------|---------------|------------|
| Service Name | `<Input>` | "Hardware Refresh (Laptop)" | Required, non-empty. Toast error on empty when advancing. |
| Description | `<Textarea>` with `min-h-[100px] resize-none` | Pre-filled description text | Optional |
| Category | `<Select>` | "IT" | Required (always has default) |
| SLA | `<Select>` | "4 hours" | Required (always has default) |
| Service Icon | 4 icon buttons in a flex row | "monitor" selected | Click to select; selected = `border-primary bg-primary/5 ring-1 ring-primary/20` |
| Internal Only | `<Switch>` in a bordered row | ON (internal) | Toggle between 'internal' / 'public' |

### Category Options
- IT Support, Human Resources, Facilities, Finance

### SLA Options
- 1 hour, 4 hours, 24 hours, 48 hours, 1 week

### Icon Options (with lucide-react components)
- `monitor` -> `Monitor`
- `briefcase` -> `Briefcase`
- `box` -> `Box`
- `server` -> `Server`

### State Shape

```typescript
const [serviceInfo, setServiceInfo] = useState({
  name: '',           // empty for new, pre-filled for edit
  category: 'IT',
  description: '',
  sla: '4 hours',
  icon: 'monitor',
  visibility: 'internal'
});
```

### Styling Details
- Labels: `text-xs uppercase tracking-widest text-muted-foreground font-semibold`
- Inputs: `bg-background h-10 font-medium`
- Icon button (unselected): `w-12 h-12 rounded-lg border border-border/60 bg-background text-muted-foreground hover:bg-muted`
- Icon button (selected): `border-primary bg-primary/5 text-primary ring-1 ring-primary/20`
- Internal Only row: `flex items-center justify-between p-4 rounded-lg border border-border/60 bg-muted/20`

---

## 6. Step 2: Form Designer (Three-Panel IDE)

This is the most complex step. It's a full three-panel layout filling the entire available height below the header.

### Layout Structure

```
+--[Left Sidebar 280px]--+--[Center Canvas flex-1]--+--[Right Sidebar 340px]--+
|                         |                          |                         |
| Component Palette       | Visual Form Preview      | Field Properties        |
| - Search bar            | - Dot-grid background    | - Label, placeholder    |
| - Categorized field     | - Form card with fields  | - Help text             |
|   types to click/add    | - Inline toolbar on      | - Required toggle       |
|                         |   hover (copy/delete)     | - Options editor        |
+-------------------------+--------------------------+-------------------------+
```

### Left Sidebar: Component Palette

**Container**: `w-[280px] bg-white dark:bg-card border-r border-border/40 flex flex-col h-full z-10 shrink-0`

**Search Bar** (top):
```
<div className="p-4">
  <div className="relative">
    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
    <Input placeholder="Search components..." className="h-9 pl-9 bg-muted/30 border-border/50 text-sm shadow-none" />
  </div>
</div>
```

**Field Categories** (scrollable body):

| Category | Fields |
|----------|--------|
| **Text Inputs** | Short Text (`text`, `Type`), Long Text (`textarea`, `AlignLeft`), Number (`number`, `Hash`), Email (`email`, `AtSign`) |
| **Choices** | Dropdown (`dropdown`, `ChevronDown`), Single Choice (`radio`, `Circle`), Multiple Choice (`checkbox`, `CheckSquare`) |
| **Advanced** | Date Picker (`date`, `Calendar`), File Upload (`file`, `FileText`) |

**Each field button**:
```
<button className="group flex items-center gap-3 px-3 py-2 bg-transparent rounded-lg text-sm hover:bg-muted/60 border border-transparent hover:border-border/50">
  <div className="w-8 h-8 rounded-md bg-muted/50 border border-border/30 flex items-center justify-center group-hover:text-primary group-hover:bg-primary/5 group-hover:border-primary/20">
    <Icon className="w-4 h-4" strokeWidth={2.5} />
  </div>
  <div className="flex flex-col">
    <span className="font-medium text-xs">{label}</span>
    <span className="text-[10px] text-muted-foreground">{description}</span>
  </div>
  <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 text-primary" />
</button>
```

**Click handler**: `addField(type)` -> creates a new `FormField` with defaults, appends to `fields[]`, auto-selects it.

### Center Canvas: Visual Form Preview

**Container**:
```
<main
  className="flex-1 overflow-y-auto flex justify-center relative"
  style={{
    backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)',
    backgroundSize: '24px 24px',
    backgroundColor: 'var(--muted)',
    backgroundBlendMode: 'multiply'
  }}
  onClick={() => setSelectedId(null)}  // deselect on canvas click
>
```

**Form Card**: `max-w-[760px] w-full py-12 px-8` containing:
- White card: `bg-white dark:bg-card shadow-sm border border-border/40 rounded-xl ring-1 ring-black/5`
- **Header section**: `px-10 pt-12 pb-8 border-b border-border/20`
  - Title: service name, `text-3xl font-semibold tracking-tight`
  - Description: `text-muted-foreground text-sm leading-relaxed`
- **Body section**: `p-6 space-y-2 min-h-[400px]`

**Each Field Row** (in the canvas):

```
<div
  onClick={() => setSelectedId(field.id)}
  onMouseEnter={() => setIsHoveredId(field.id)}
  onMouseLeave={() => setIsHoveredId(null)}
  className={`relative rounded-xl p-6 transition-all cursor-pointer ${
    isSelected
      ? 'bg-primary/[0.03] ring-2 ring-primary/60 shadow-sm z-10'
      : 'hover:bg-muted/40 ring-1 ring-transparent hover:ring-border/80'
  }`}
>
```

**Inline Toolbar** (appears on hover/select, positioned `absolute -top-3 right-4`):
- Copy button: `<Copy>` icon, calls `duplicateField(field)`
- Delete button: `<Trash2>` icon, calls `removeField(field.id)`
- Container: `bg-card shadow-md border border-border/60 rounded-md overflow-hidden`

**Drag Handle**: `<GripVertical>` icon, `absolute left-2 top-1/2`, opacity transitions on hover

**Field Rendering by Type**:

| Type | Rendered Preview |
|------|-----------------|
| `text`, `number`, `email` | `<Input>` with placeholder, `readOnly`, `pointer-events-none` |
| `textarea` | `<Textarea>` with `min-h-[100px] resize-none`, readOnly |
| `dropdown` | Fake select div with `<ChevronDown>` icon |
| `radio` | Vertical list of circles with labels |
| `checkbox` | Vertical list of rounded squares with labels |
| `date` | Input with `<Calendar>` icon positioned left |
| `file` | Dashed border drop zone: `border-2 border-dashed h-24` with `<FileText>` icon |

**Empty State** (when `fields.length === 0`):
```
<LayoutTemplate className="w-12 h-12 mb-4 opacity-20" />
<p className="text-sm font-medium">Your form is empty</p>
<p className="text-xs mt-1">Drag and drop fields from the left panel.</p>
```

**"Add Field" zone** at bottom of form body:
```
<div className="mt-4 mb-2 rounded-xl border-2 border-dashed border-border/40 h-20 flex flex-col items-center justify-center hover:bg-primary/5 hover:border-primary/40 hover:text-primary">
  <Plus className="w-5 h-5 mb-1 opacity-50" />
  <span className="text-[13px] font-medium">Add Field</span>
</div>
```

### Right Sidebar: Field Properties

**Container**: `w-[340px] bg-white dark:bg-card border-l border-border/40 flex flex-col h-full z-10 shrink-0 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]`

**When a field is selected**, the panel shows:

**Header**: `h-14 border-b border-border/40 flex items-center justify-between px-5 bg-muted/10`
- Left: Settings icon + "Properties" label
- Right: `<Badge variant="outline">` showing field type in mono uppercase

**Properties Form** (scrollable `p-5 space-y-7`):

1. **Field Label**: `<Input>` bound to `selected.label`
2. **Placeholder Text** (for text, textarea, number, email, dropdown): `<Input>` bound to `selected.placeholder`
3. **Help Text**: `<Textarea>` bound to `selected.helpText`
4. **Separator**
5. **Rules & Validation**:
   - Required Field toggle: `<Switch>` in a bordered row with label + description
6. **Choices** (only for dropdown, radio, checkbox):
   - Each option: inline editable `<input>` with `<GripHorizontal>` drag handle and `<Trash2>` delete
   - "Add Choice" button at bottom
   - Options are stored in `selected.options[]`

**When no field is selected**:
```
<div className="h-full flex flex-col items-center justify-center text-center p-8 bg-muted/5">
  <div className="w-16 h-16 rounded-full bg-background border shadow-sm flex items-center justify-center mb-4">
    <ToggleRight className="w-6 h-6 text-muted-foreground/40" />
  </div>
  <h3 className="text-sm font-semibold">No Selection</h3>
  <p className="text-xs text-muted-foreground max-w-[200px]">Click on any field in the center canvas to configure its settings here.</p>
</div>
```

### Field CRUD Operations

```typescript
const addField = (type: string) => {
  const newField: FormField = {
    id: Date.now().toString(),
    type,
    label: `New ${type} field`,
    required: false,
    placeholder: '',
    options: ['dropdown', 'radio', 'checkbox'].includes(type) ? ['Option 1', 'Option 2'] : undefined,
  };
  setFields([...fields, newField]);
  setSelectedId(newField.id);
};

const updateField = (id: string, updates: Partial<FormField>) => {
  setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
};

const removeField = (id: string) => {
  setFields(fields.filter(f => f.id !== id));
  if (selectedId === id) setSelectedId(null);
};

const duplicateField = (field: FormField) => {
  const newField = { ...field, id: Date.now().toString() };
  const index = fields.findIndex(f => f.id === field.id);
  const newFields = [...fields];
  newFields.splice(index + 1, 0, newField);
  setFields(newFields);
  setSelectedId(newField.id);
};
```

---

## 7. Step 3: Workflow Attachment

### Layout
- Centered content: `max-w-3xl w-full space-y-8`, background `bg-muted/5`, padded `py-12 px-6`

### Heading
- Title: "Attach Workflow" (`text-2xl font-semibold tracking-tight`)
- Subtitle: "Select the BPMN workflow that will execute when this service is requested."

### Workflow Cards

Grid: `grid grid-cols-1 md:grid-cols-2 gap-4`

| ID | Name | Icon | Description |
|----|------|------|-------------|
| `approval_path` | Standard Approval Path | `ShieldCheck` | Requires manager and IT approval. Automatically notifies users of status changes. |
| `auto_provision` | Auto-Provisioning | `Server` | No approvals required. Triggers backend webhook to grant immediate access. |
| `custom_wf` | Custom Hardware Workflow | `Workflow` | Your custom drafted workflow designed specifically for hardware requests. |

**Card styling**:
- Selected: `border-2 border-primary bg-primary/5 shadow-sm`
- Unselected: `border-2 border-border/50 bg-card hover:border-border hover:shadow-sm`
- Icon container (selected): `bg-primary text-primary-foreground`
- Icon container (unselected): `bg-muted text-muted-foreground`

**"Open Workflow Designer" button** centered below cards:
```
<Button variant="outline" className="gap-2 shadow-sm bg-card" onClick={() => navigate('/admin/workflows')}>
  <Workflow className="w-4 h-4 text-muted-foreground" />
  Open Workflow Designer
</Button>
```

### State
```typescript
const [selectedWorkflow, setSelectedWorkflow] = useState('approval_path');
```

---

## 8. Step 4: Review & Publish

### Layout
- Centered: `max-w-2xl w-full space-y-8`, background `bg-muted/5`, padded `py-12 px-6`

### Header Section (centered)
```
<div className="text-center">
  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
    <CheckCircle2 className="w-8 h-8" />
  </div>
  <h2>Ready to Publish</h2>
  <p>Review your service configuration below. Once published, it will be immediately available to your specified audience.</p>
</div>
```

### Review Card

`<Card className="divide-y divide-border/50 shadow-sm border-border/50 bg-card">`

**Top section** (`p-6 flex items-start gap-4`):
- Service icon (12x12 rounded-xl bg-muted with icon)
- Service name (text-lg font-semibold)
- Description (text-sm text-muted-foreground)
- Badges row: Category badge, SLA badge, Visibility badge

**Bottom section** (`p-6 grid grid-cols-2 gap-6`):
- Left: "Form Configuration" -> "{N} Custom Fields" with FileText icon
- Right: "Linked Workflow" -> workflow name with Workflow icon

### Publish Action

The "Publish Service" button in the header triggers:

```typescript
const handlePublish = () => {
  setIsPublishing(true);
  setTimeout(() => {
    const newService: Service = {
      id: Date.now().toString(),
      name: serviceInfo.name,
      category: serviceInfo.category,
      status: 'Published',
      requests: 0,
      sla: serviceInfo.sla,
      updated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: serviceInfo.description,
      icon: serviceInfo.icon,
      visibility: serviceInfo.visibility,
      formFields: fields,        // <-- CRITICAL: persist the designed form
      workflowId: selectedWorkflow,
    };
    addService(newService);
    toast.success('Service Published', {
      description: `${serviceInfo.name} is now live and available to requesters.`
    });
    navigate('/admin/services');
  }, 1200);
};
```

**Publishing state**: Button shows spinner + "Publishing..." text, disabled

---

## 9. Wizard Shell & Navigation Chrome

### Header Bar

`<header className="flex-none h-14 border-b border-border/40 bg-white/50 dark:bg-background/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">`

**Left section**:
- Back arrow button (`ArrowLeft`, 8x8, ghost) -> goes to previous step or `/admin/services`
- Vertical divider: `h-4 w-px bg-border/60`
- Breadcrumb: "Services" (clickable, navigates to /admin/services) / {service name}
- Draft badge: `h-5 px-1.5 text-[10px] uppercase font-mono bg-blue-500/10 text-blue-600`

**Center section** (absolute centered):
- 4-step stepper: Details -> Form -> Workflow -> Publish
- Each step: circle (20x20 rounded-full) + label
- Current step: `bg-primary text-primary-foreground` circle, `text-primary` label, `bg-primary/5` background
- Completed step: `bg-primary/20 text-primary` circle with Check icon, `text-foreground` label
- Future step: `bg-muted border border-border` circle, `text-muted-foreground/50` label
- Connectors between steps: `w-6 h-[1.5px] mx-1 rounded-full`, completed = `bg-primary/30`, pending = `bg-border/50`

**Right section**:
- Auto-save indicator: "Saved {time}" with Check icon, or "Saving..." with spinner
- Preview Form button (only on step 2): `variant="outline" size="sm"` with Eye icon
- Next Step button (steps 1-3): primary with ArrowRight icon
- Publish Service button (step 4): primary with Save icon, shows spinner when publishing

### Step Transition Animation

```typescript
<AnimatePresence mode="wait">
  <motion.div
    key={currentStep}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
    className="flex-1 flex w-full"
  >
    {/* step content */}
  </motion.div>
</AnimatePresence>
```

---

## 10. Admin Services List (Post-Publish)

### File: `/src/app/pages/AdminServices.tsx`

**Page layout**: `p-8 max-w-[1400px] mx-auto space-y-8`

**Header row**:
- Title: "Service Catalog" (`text-3xl font-semibold tracking-tight`)
- Subtitle: "Manage and configure your available services"
- "Create Service" button -> navigates to `/admin/services/new`

**Filters row**:
- Search input with Search icon, `max-w-sm`
- Category pill tabs: All | IT | HR | Facilities | Finance
  - Active: `bg-background text-foreground shadow-sm`
  - Inactive: `text-muted-foreground hover:text-foreground`
  - Container: `bg-muted/50 p-1 rounded-lg border border-border`

**Table** (inside Card with shadow-sm):

| Column | Width | Style |
|--------|-------|-------|
| Service Name | 300px | `font-medium` |
| Category | auto | `text-muted-foreground` |
| Status | auto | `<StatusBadge>` component |
| Requests | auto, right-aligned | `font-mono text-sm` |
| SLA | auto | `text-muted-foreground` |
| Last Modified | auto | `text-muted-foreground text-sm`, sortable icon |
| Actions | 70px | `<DropdownMenu>` with Configure + Duplicate |

**Row click**: navigates to `/admin/services/${s.id}/form` (edit mode)

**StatusBadge** maps:
- Published -> `success` (green)
- Draft -> `outline` (neutral)

---

## 11. Requester Catalog (Dynamic Cards)

### File: `/src/app/pages/RequesterCatalog.tsx`

**Critical behavior**: Only shows services where `status === 'Published'`. Services created and published through the wizard appear here instantly via `ServiceContext`.

**Page layout**: `p-6 max-w-6xl mx-auto`, font-family Inter

**Header**: Title "Service Catalog" + search input (w-64)

**Category filters**: Horizontal pill buttons
- Active: `bg-[#2563EB] text-white`
- Inactive: `bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]`
- Shape: `rounded-full`, fontSize 13, fontWeight 500

**Cards grid**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`

**Each card**:
```
<button onClick={() => navigate(`/requester/request/${s.id}`)}>
  - Icon (10x10 rounded-lg, bg-[#EFF6FF], icon color [#2563EB])
  - SLA badge (top-right): bg-slate-100 text-slate-600
  - Title: fontSize 16, fontWeight 600
  - Description: fontSize 13, color #6B7280
  - Category label: fontSize 12, color #9CA3AF
</button>
```

**Icon mapping**: Uses a `getIcon(iconName)` function that maps string keys to lucide components.

---

## 12. Requester Request Form (Dynamic Rendering)

### File: `/src/app/pages/RequesterRequestForm.tsx`

### CRITICAL CHANGE: Dynamic Form Rendering

The current implementation uses hardcoded fields. It MUST be rewritten to:

1. Read `serviceId` from URL params: `const { id } = useParams()`
2. Look up service from context: `const service = getServiceById(id)`
3. Dynamically render `service.formFields[]` into actual interactive form inputs
4. Collect all form data into `formData: Record<string, any>`
5. On submit, create a `SubmittedRequest` and call `submitRequest()`

### Layout
- `p-6 max-w-2xl mx-auto`, font-family Inter
- Back button: "Back to Catalog" with ArrowLeft icon, navigates to `/requester`
- Service info banner: `bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl p-4 mb-6`
  - Service name (fontSize 18, fontWeight 600)
  - Category + SLA (fontSize 13, color #6B7280)
- Form card: `bg-white border border-[#E5E7EB] rounded-xl p-6`

### Dynamic Field Rendering

For each `field` in `service.formFields`:

```typescript
{service.formFields?.map((field) => (
  <div key={field.id} className="space-y-1.5">
    <label>
      {field.label}
      {field.required && <span className="text-[#DC2626]"> *</span>}
    </label>

    {field.helpText && (
      <p className="text-xs text-muted-foreground">{field.helpText}</p>
    )}

    {/* Render based on field.type */}
    {field.type === 'text' && <input type="text" required={field.required} placeholder={field.placeholder} />}
    {field.type === 'email' && <input type="email" required={field.required} placeholder={field.placeholder} />}
    {field.type === 'number' && <input type="number" required={field.required} placeholder={field.placeholder} />}
    {field.type === 'textarea' && <textarea required={field.required} rows={4} placeholder={field.placeholder} />}
    {field.type === 'dropdown' && (
      <select required={field.required}>
        <option value="">Select...</option>
        {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    )}
    {field.type === 'radio' && (
      <div className="flex flex-col gap-2">
        {field.options?.map(opt => (
          <label key={opt} className="flex items-center gap-2">
            <input type="radio" name={field.id} value={opt} required={field.required} /> {opt}
          </label>
        ))}
      </div>
    )}
    {field.type === 'checkbox' && (
      <div className="flex flex-col gap-2">
        {field.options?.map(opt => (
          <label key={opt} className="flex items-center gap-2">
            <input type="checkbox" value={opt} /> {opt}
          </label>
        ))}
      </div>
    )}
    {field.type === 'date' && <input type="date" required={field.required} />}
    {field.type === 'file' && <input type="file" />}
  </div>
))}
```

### Form Submission

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const formDataObj: Record<string, any> = {};
  // Collect from controlled state or FormData API
  service.formFields?.forEach(field => {
    formDataObj[field.label] = formValues[field.id]; // from controlled state
  });

  const newRequest: SubmittedRequest = {
    id: Date.now().toString(),
    ticket: `TSH-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    serviceId: service.id,
    serviceName: service.name,
    status: 'Submitted',
    submitted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    formData: formDataObj,
    workflowProgress: [
      { label: 'Submitted', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), done: true },
      { label: 'Under Review', date: '', done: false, current: true },
      { label: 'Approved', date: '', done: false },
      { label: 'Completed', date: '', done: false },
    ],
  };

  submitRequest(newRequest);
  toast.success('Request submitted successfully!');
  setTimeout(() => navigate('/requester/requests'), 1500);
};
```

### Styling for Form Inputs (Requester Portal)
All inputs use this consistent styling:
```
className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-[#DBEAFE] outline-none"
style={{ fontSize: 14, height: 36 }}
```

Labels: `fontSize: 14, fontWeight: 500, color: '#374151'`

Submit button:
```
className="mt-2 px-5 py-2.5 rounded-lg text-white hover:opacity-90 disabled:opacity-50"
style={{ background: '#2563EB', fontSize: 14, fontWeight: 500 }}
```

---

## 13. Requester My Requests & Detail View

### RequesterRequests.tsx

**Must be refactored** to read from `ServiceContext.requests[]` instead of hardcoded data.

```typescript
const { requests } = useServices();
```

Table columns: Ticket (mono font), Service, Status (StatusBadge), Submitted

Row click -> navigates to `/requester/requests/${r.id}`

### RequesterRequestDetail.tsx

**Must be refactored** to read from context:

```typescript
const { id } = useParams();
const { getRequestById, getServiceById } = useServices();
const request = getRequestById(id);
const service = getServiceById(request?.serviceId);
```

Displays:
1. **Workflow Progress**: Horizontal stepper with circles and connecting lines
   - Done: green (`bg-[#059669]`) with CheckCircle
   - Current: blue (`bg-[#2563EB]`) with Circle
   - Future: gray (`bg-[#E5E7EB]`) with Circle
2. **Request Details**: Key-value pairs from `request.formData`
3. **History**: Timeline of events (hardcoded for now, can be dynamic later)

---

## 14. Animation & Motion Patterns

### Step Transitions (Wizard)
```typescript
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -10 }}
transition={{ duration: 0.2 }}
```

### Auto-save Indicator
- Fade in/out with `animate-in fade-in` Tailwind class
- Spinner: `w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin`

### Publish Button Spinner
- `w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin`

### Card Hover States
- Service catalog cards: `hover:shadow-md hover:border-[#D1D5DB]`
- Form field rows: `hover:bg-muted/40 ring-1 ring-transparent hover:ring-border/80`
- Workflow cards: `hover:border-border hover:shadow-sm`

---

## 15. Keyboard Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `Cmd/Ctrl + S` | Save draft (show saving indicator + success toast) | Any step |
| `Enter` | Advance to next step (unless focused on textarea) | Steps 1-3 |

### Implementation

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      setIsDraftSaving(true);
      setTimeout(() => {
        setIsDraftSaving(false);
        setDraftSavedAt(new Date());
        toast.success('Draft saved successfully', { description: 'Your changes have been safely stored.' });
      }, 600);
    }

    if (e.key === 'Enter' && currentStep < 4 && e.target instanceof HTMLElement && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      handleNextStep();
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [currentStep, serviceInfo.name]);
```

---

## 16. Toast Notification System

Uses `sonner` library. `<Toaster>` mounted in App.tsx with `position="top-center" richColors`.

| Event | Type | Title | Description |
|-------|------|-------|-------------|
| Draft saved | `toast.success` | "Draft saved successfully" | "Your changes have been safely stored." |
| Service published | `toast.success` | "Service Published" | "{name} is now live and available to requesters." |
| Validation error (empty name) | `toast.error` | "Service Name Required" | "Please provide a name before continuing." |
| Request submitted | `toast.success` | "Request submitted successfully!" | (none) |

---

## 17. Validation Rules

### Step 1 -> Step 2 Transition
- `serviceInfo.name` must be non-empty (trimmed)
- If empty: show error toast, prevent advancement

### Step 2 -> Step 3 Transition
- No blocking validation (empty forms are allowed)

### Step 3 -> Step 4 Transition
- No blocking validation (workflow is pre-selected)

### Publish (Step 4)
- No additional validation beyond Step 1 name check (already passed)

### Requester Form Submission
- HTML5 native `required` attribute on fields where `field.required === true`
- Browser handles validation, form won't submit without required fields filled

---

## 18. Design System Tokens Reference

### Colors (from `/src/styles/theme.css`)

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#2563eb` | Buttons, active states, selected items |
| `--foreground` | `#111827` | Primary text |
| `--muted-foreground` | `#6b7280` | Secondary text, labels |
| `--border` | `#e5e7eb` | Borders, dividers |
| `--muted` | `#f9fafb` | Subtle backgrounds |
| `--destructive` | `#ef4444` | Delete actions, required asterisks |
| `--success` | `#10b981` | Published status, completed states |
| `--warning` | `#f59e0b` | In Review, Pending states |

### Typography

| Context | Font | Weight |
|---------|------|--------|
| All UI text | Inter | 400/500/600/700 |
| Ticket numbers, field type badges, mono values | JetBrains Mono | 500 |

### Spacing Patterns

| Context | Value |
|---------|-------|
| Page padding | `p-6` (requester), `p-8` (admin) |
| Card padding | `p-5` to `p-6` |
| Section gaps | `space-y-6` to `space-y-8` |
| Field gaps in forms | `space-y-5` (requester), `space-y-2` (admin canvas) |

### Border Radius

| Context | Value |
|---------|-------|
| Cards | `rounded-xl` (12px) |
| Buttons | `rounded-lg` (8px) or `rounded-md` (6px) |
| Badges | `rounded-md` or `rounded-full` |
| Inputs | `rounded-lg` (8px) |
| Icons | `rounded-lg` or `rounded-full` |

---

## 19. Edit Mode: Loading Existing Services

### Route: `/admin/services/:id/form`

When navigating to an existing service (clicking a row in AdminServices), the wizard must:

1. Extract `id` from `useParams()`
2. Look up service: `const service = getServiceById(id)`
3. If found, pre-populate ALL wizard state:
   - `serviceInfo` -> from service name, category, description, sla, icon, visibility
   - `fields` -> from `service.formFields` (or `initialFields` as fallback)
   - `selectedWorkflow` -> from `service.workflowId` (or 'approval_path' as fallback)
4. Header should show the service name (not "New Service")
5. On publish, call `updateService(id, updates)` instead of `addService()`

### Route: `/admin/services/new`

Fresh wizard with empty/default values. On publish, calls `addService()`.

### Detection Logic

```typescript
const { id } = useParams();
const isEditMode = !!id;
const { getServiceById, addService, updateService } = useServices();

useEffect(() => {
  if (isEditMode) {
    const existing = getServiceById(id);
    if (existing) {
      setServiceInfo({
        name: existing.name,
        category: existing.category,
        description: existing.description || '',
        sla: existing.sla,
        icon: existing.icon || 'monitor',
        visibility: existing.visibility || 'internal',
      });
      if (existing.formFields?.length) setFields(existing.formFields);
      if (existing.workflowId) setSelectedWorkflow(existing.workflowId);
    }
  }
}, [id]);
```

---

## 20. End-to-End User Journey Walkthrough

### Journey A: Admin Creates a New Service

1. Admin navigates to `/admin/services`
2. Clicks "Create Service" button -> routed to `/admin/services/new`
3. **Step 1 (Details)**: Fills in service name, description, category, SLA, picks icon, toggles visibility
4. Clicks "Next Step" (or presses Enter) -> validates name is non-empty
5. **Step 2 (Form)**: Clicks field types in left palette to add fields to canvas. Clicks fields to select them and configure label/placeholder/required/options in right panel. Reorders, duplicates, deletes fields as needed.
6. Clicks "Next Step"
7. **Step 3 (Workflow)**: Clicks one of the three workflow cards to attach. Optionally clicks "Open Workflow Designer" to go design a custom one.
8. Clicks "Next Step"
9. **Step 4 (Publish)**: Reviews summary card showing all configuration. Clicks "Publish Service".
10. Spinner shows for 1.2s, success toast fires, redirected to `/admin/services`
11. New service appears as first row in the table with status "Published"

### Journey B: Requester Submits a Request

1. Requester navigates to `/requester` (catalog)
2. Sees the newly published service card in the grid
3. Clicks the card -> routed to `/requester/request/{serviceId}`
4. **Dynamic form** renders all fields designed by the admin in Step 2
5. Fills in all required fields, clicks "Submit Request"
6. Success toast fires, redirected to `/requester/requests` after 1.5s
7. New request appears at top of the "My Requests" table with status "Submitted"

### Journey C: Requester Tracks a Request

1. Requester navigates to `/requester/requests`
2. Clicks a request row -> routed to `/requester/requests/{requestId}`
3. Sees workflow progress stepper, request details (from formData), and history timeline

### Journey D: Admin Edits an Existing Service

1. Admin clicks a row in `/admin/services` -> routed to `/admin/services/{id}/form`
2. Wizard loads pre-populated with existing service data
3. Admin modifies any step, navigates through wizard
4. On publish, service is updated in-place (not duplicated)

---

## 21. Known Gaps & Future Enhancements

### Current Gaps (in-memory only)

| Gap | Impact | Fix |
|-----|--------|-----|
| No persistent storage | Services/requests lost on page refresh | Supabase integration |
| No drag-and-drop reorder for form fields | GripVertical handle is visual only | Implement react-dnd |
| No form field conditional logic | Can't show/hide fields based on answers | Add condition builder |
| No file upload handling | File input is visual only | Supabase Storage |
| No real workflow execution | Workflow attachment is selection only | Connect to workflow engine |
| Requester form has no controlled state management | Uses native form elements | Add react-hook-form |
| No service versioning | Edits overwrite, no history | Add version tracking |
| No role-based access | Both portals are open | Add auth + RBAC |
| No search in component palette (Step 2) | Search input exists but doesn't filter | Wire up filter logic |
| Preview Form button (Step 2) is non-functional | Button renders but no action | Add modal preview |

### Recommended Supabase Schema (for future)

```sql
-- Services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'Draft',
  description TEXT,
  sla TEXT,
  icon TEXT DEFAULT 'monitor',
  visibility TEXT DEFAULT 'internal',
  form_fields JSONB DEFAULT '[]',
  workflow_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Submitted requests table
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket TEXT NOT NULL UNIQUE,
  service_id UUID REFERENCES services(id),
  service_name TEXT NOT NULL,
  status TEXT DEFAULT 'Submitted',
  form_data JSONB DEFAULT '{}',
  workflow_progress JSONB DEFAULT '[]',
  submitted_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Appendix A: Complete File Dependency Map

```
/src/app/App.tsx
  imports: ServiceProvider, RouterProvider, Toaster

/src/app/routes.tsx
  imports: all page + layout components

/src/app/context/ServiceContext.tsx
  exports: Service, FormField, SubmittedRequest, ServiceProvider, useServices

/src/app/pages/AdminFormBuilder.tsx
  imports: motion, toast, lucide icons (25+), shadcn components (10+), useServices, useNavigate, useParams

/src/app/pages/AdminServices.tsx
  imports: useServices, StatusBadge, shadcn table/dropdown, useNavigate

/src/app/pages/RequesterCatalog.tsx
  imports: useServices, useNavigate, lucide icons

/src/app/pages/RequesterRequestForm.tsx
  imports: useServices (getServiceById), useParams, useNavigate, toast

/src/app/pages/RequesterRequests.tsx
  imports: useServices (requests), StatusBadge, useNavigate

/src/app/pages/RequesterRequestDetail.tsx
  imports: useServices (getRequestById), useParams, useNavigate, StatusBadge
```

## Appendix B: Icon String-to-Component Map

Used in RequesterCatalog and AdminFormBuilder:

```typescript
const iconMap: Record<string, LucideIcon> = {
  monitor: Monitor,
  laptop: Laptop,
  briefcase: Briefcase,
  box: Box,
  server: Server,
  users: Users,
  building: Building,
  wallet: Wallet,
  key: Key,
  'shield-check': ShieldCheck,
};

// Fallback: FileText
```

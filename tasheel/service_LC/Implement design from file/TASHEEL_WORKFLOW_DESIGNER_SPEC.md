# Tasheel Workflow Designer - Complete Implementation Specification

> **Purpose**: This document is a comprehensive, line-by-line implementation reference for the Tasheel Workflow Designer (`/src/app/pages/AdminWorkflow.tsx`). It is intended to be consumed by Cursor AI or any AI code assistant to understand, extend, debug, or refactor this module with full context. Every design decision, data structure, component, interaction pattern, and visual styling rule is documented below.

---

## Table of Contents

1. [Project Context & Architecture](#1-project-context--architecture)
2. [Technology Stack & Dependencies](#2-technology-stack--dependencies)
3. [Design System & Visual Language](#3-design-system--visual-language)
4. [File Structure & Routing](#4-file-structure--routing)
5. [Component Architecture](#5-component-architecture)
6. [Data Models & Type Definitions](#6-data-models--type-definitions)
7. [BPMN Node System](#7-bpmn-node-system)
8. [Edge System & Sequence Flows](#8-edge-system--sequence-flows)
9. [Three-Panel Studio Layout](#9-three-panel-studio-layout)
10. [Feature: Form Trigger System](#10-feature-form-trigger-system)
11. [Feature: Gateway Condition Builder](#11-feature-gateway-condition-builder)
12. [Feature: Execution Steps (Actions)](#12-feature-execution-steps-actions)
13. [Feature: Dynamic Variable Mapper](#13-feature-dynamic-variable-mapper)
14. [Feature: Variable Picker Component](#14-feature-variable-picker-component)
15. [Feature: Simulation Engine](#15-feature-simulation-engine)
16. [Feature: Run History Drawer](#16-feature-run-history-drawer)
17. [State Management](#17-state-management)
18. [Drag-and-Drop System](#18-drag-and-drop-system)
19. [Node Selection & Properties Panel Logic](#19-node-selection--properties-panel-logic)
20. [Animation & Motion Patterns](#20-animation--motion-patterns)
21. [Initial Demo Data (Seed Workflow)](#21-initial-demo-data-seed-workflow)
22. [Known Limitations & Future Enhancements](#22-known-limitations--future-enhancements)

---

## 1. Project Context & Architecture

### Application Overview

**Tasheel** is an enterprise service management platform with two portals:

| Portal | Layout | Navigation | Route Prefix |
|--------|--------|-----------|--------------|
| **Admin Portal** | `AdminLayout` - Dark sidebar (`#0F172A`) + light content area (`#F1F5F9`) | `AdminSidebar` with `NavLink` items | `/admin/*` |
| **Requester Portal** | `RequesterLayout` - Light navigation bar | `RequesterNav` top bar | `/requester/*` |

The Workflow Designer is a **full-screen studio experience** that lives inside the Admin Portal at route `/admin/workflows`. It intentionally **breaks out** of the standard `AdminLayout` sidebar pattern - it renders its own header, left sidebar, canvas, and right sidebar as a self-contained IDE-like workspace.

### Where This File Lives

```
/src/app/
  App.tsx                    # Root - renders <RouterProvider router={router} />
  routes.tsx                 # All route definitions
  layouts/
    AdminLayout.tsx          # Sidebar + <Outlet />
    RequesterLayout.tsx      # Top nav + <Outlet />
  components/
    AdminSidebar.tsx         # Dark sidebar nav
    RequesterNav.tsx         # Light top nav
    StatusBadge.tsx          # Reusable status badge
    ui/                      # shadcn/ui components (50+ files)
  pages/
    AdminWorkflow.tsx        # <<< THIS FILE - The Workflow Designer
    AdminDashboard.tsx       # Admin dashboard page
    AdminServices.tsx        # Services list page
    AdminFormBuilder.tsx     # Form configuration builder
    RequesterCatalog.tsx     # Service catalog for requesters
    ...
```

### Route Configuration

In `/src/app/routes.tsx`, the workflow designer is mounted as:

```tsx
{
  path: "/admin",
  Component: AdminLayout,   // Wraps with dark sidebar
  children: [
    { index: true, Component: AdminDashboard },
    { path: "services", Component: AdminServices },
    { path: "services/:id/form", Component: AdminFormBuilder },
    { path: "services/new", Component: AdminFormBuilder },
    { path: "workflows", Component: AdminWorkflow },  // <<< This route
  ],
}
```

**Important**: Even though `AdminWorkflow` renders inside `AdminLayout` (which has the dark sidebar), the workflow designer creates its own full `h-screen` flex layout that visually overrides the parent. The component fills the entire viewport.

---

## 2. Technology Stack & Dependencies

### Core Dependencies Used in This File

| Package | Version | Purpose |
|---------|---------|---------|
| `@xyflow/react` | `^12.10.2` | React Flow - The canvas graph library for node-based visual editing |
| `react-router` | `7.13.0` | Routing (uses `useNavigate` for back navigation) |
| `motion` | `12.23.24` | Animation library (imported as `motion/react`) |
| `lucide-react` | `0.487.0` | Icon library (30+ icons used) |
| `tailwindcss` | `4.1.12` | Utility-first CSS (v4 with `@theme inline` syntax) |

### shadcn/ui Components Used

All from `/src/app/components/ui/`:

- `Button` - All buttons (ghost, outline, primary, destructive variants)
- `Badge` - Status indicators, count badges, type labels
- `Input` - Text inputs for labels, values, search
- `Label` - Form field labels (uppercase tracking-widest style)
- `Separator` - Horizontal dividers
- `Select` / `SelectContent` / `SelectItem` / `SelectTrigger` / `SelectValue` - All dropdowns

### React Flow Imports

```tsx
import {
  ReactFlow,           // Main canvas component
  MiniMap,             // Bottom-right minimap
  Controls,            // Zoom controls
  Background,          // Dot grid background
  useNodesState,       // Node state hook (nodes, setNodes, onNodesChange)
  useEdgesState,       // Edge state hook (edges, setEdges, onEdgesChange)
  addEdge,             // Utility to add new edges
  Handle,              // Connection points on nodes
  Position,            // Enum: Top, Right, Bottom, Left
  Connection,          // Type for new connections
  Edge,                // Edge type
  NodeProps,           // Props type for custom nodes
  Node,                // Node type
  ReactFlowProvider,   // Context provider (MUST wrap component)
  MarkerType,          // Edge arrow markers
  BackgroundVariant,   // Background style enum (Dots, Lines, Cross)
  useReactFlow         // Hook for accessing React Flow instance (imported but not actively used)
} from '@xyflow/react';
```

### Lucide Icons Used (Complete List)

```tsx
ArrowLeft, Check, Save, Search, Play, Split, Mail, User, Settings, 
Layers, GripVertical, Trash2, GitBranch, Zap, Plus, Globe, Database, 
MessageSquare, Circle, X, Settings2, Square, MoreHorizontal, 
MousePointerClick, FileText, Link2, Variable, ChevronDown, 
ChevronRight, Clock, CheckCircle2, XCircle, AlertTriangle, 
RotateCcw, Braces, Hash, ToggleLeft, ArrowRight, Pause, 
SkipForward, StepForward, History, Eye, Timer, Workflow
```

---

## 3. Design System & Visual Language

### Typography

Defined in `/src/styles/fonts.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');
```

| Use Case | Font | Weight | Size |
|----------|------|--------|------|
| UI text, labels, headings | Inter | 400-700 | 10px - 14px |
| Data values, code, variable names, timestamps | JetBrains Mono | 500 | 9px - 11px |
| BPMN type labels (e.g., "USER TASK") | JetBrains Mono | 600 | 10px, uppercase, tracking-wider |
| Condition builder fields | JetBrains Mono | 500 | 11px |

### Color Palette (from `/src/styles/theme.css`)

```
Primary Brand:    #2563eb (--primary)
Background:       #ffffff (--background)
Foreground:       #111827 (--foreground)
Muted:            #f9fafb (--muted)
Muted Foreground: #6b7280 (--muted-foreground)
Border:           #e5e7eb (--border)
Destructive:      #ef4444 (--destructive)
Success:          #10b981 (--success)
Warning:          #f59e0b (--warning)
Info:             #3b82f6 (--info)
```

### Semantic Node Colors

| Element | Color | Usage |
|---------|-------|-------|
| Start Event | Emerald `#10b981` | Border, handle, minimap dot |
| End Event | Destructive `#ef4444` | Border (3.5px), handle, minimap dot |
| User Task | Blue `#2563eb` / `text-blue-600` | Icon, assignee avatar ring |
| Service Task | Amber `#f59e0b` / `text-amber-600` | Icon |
| Gateway (XOR) | Amber `#f59e0b` | Diamond border, handles, X marker |
| Approved edge | Emerald `#10b981` | Stroke, arrow marker |
| Rejected edge | Destructive `#ef4444` | Stroke, arrow marker |
| Default edge | Gray `#9ca3af` | Stroke, arrow marker |

### Simulation Status Colors

| Status | Node Styling | Edge Styling |
|--------|-------------|-------------|
| `active` | Blue ring + `animate-pulse` | Blue stroke `#2563eb`, strokeWidth 2.5, `animated: true` |
| `completed` | Emerald ring + green checkmark badge | Green stroke `#10b981` |
| `skipped` | `opacity-50`, muted border | `opacity: 0.3` |
| `pending` | Default styling | Default styling |

### Spacing & Layout Constants

| Element | Dimension |
|---------|-----------|
| Top header height | `h-14` (56px) |
| Left sidebar width | `w-[260px]` |
| Right properties panel width | `w-[360px]` |
| History drawer height | `h-[320px]` |
| Node palette item height | `py-2` with `w-8 h-8` icon box |
| Input heights | `h-9` (standard), `h-7` (compact), `h-6` (inline) |
| Badge heights | `h-5` (standard), `h-4` (small) |

### Glass-morphism & Surface Treatment

The designer uses a consistent frosted-glass UI language:

```
Top header:    bg-white/70 backdrop-blur-xl
Left sidebar:  bg-white/50 backdrop-blur-sm + shadow-[4px_0_24px_rgba(0,0,0,0.01)]
Right sidebar: bg-white/80 backdrop-blur-xl + shadow-[-4px_0_24px_rgba(0,0,0,0.02)]
Trigger panel: bg-white/90 backdrop-blur-xl
Canvas area:   bg-muted/10
```

Border opacity is consistently `border-border/40` or `border-border/60` for a lighter appearance.

---

## 4. File Structure & Routing

### Exports

The file exports a single named component:

```tsx
export function AdminWorkflow() {
  return (
    <ReactFlowProvider>
      <Designer />
    </ReactFlowProvider>
  );
}
```

**Critical**: `ReactFlowProvider` MUST wrap the `Designer` component. This provides the React Flow context that `useNodesState`, `useEdgesState`, and `useReactFlow` depend on.

### Internal Component Hierarchy

```
AdminWorkflow (exported)
  ReactFlowProvider
    Designer (main component, all state lives here)
      header (top navigation bar)
      AnimatePresence > motion.div (Form Trigger Panel - collapsible)
      div.flex-1.flex (three-column layout)
        aside.left (BPMN palette OR Simulation controls)
        main.center (ReactFlow canvas)
          ReactFlow
            Background (dots)
            Controls (zoom)
            MiniMap
        aside.right (Properties panel)
          Tabs: General | Execution | Mapping | Conditions
            ConditionRow (sub-component, per condition)
            VariablePicker (sub-component, floating popup)
      AnimatePresence > motion.div (History drawer - bottom sheet)
```

---

## 5. Component Architecture

### Top-Level Components Defined in This File

| Component | Type | Description |
|-----------|------|-------------|
| `AdminWorkflow` | Exported | Wrapper that provides `ReactFlowProvider` |
| `Designer` | Internal function | Main component containing all state and UI |
| `StartNode` | Custom node | BPMN Start Event (green circle) |
| `EndNode` | Custom node | BPMN End Event (red thick-bordered circle) |
| `TaskNode` | Custom node | BPMN User/Service Task (card with header) |
| `GatewayNode` | Custom node | BPMN Exclusive Gateway (amber diamond) |
| `VariablePicker` | Sub-component | Floating popup for inserting `{{variables}}` |
| `ConditionRow` | Sub-component | Single condition expression (field + operator + value) |

### Node Type Registration

```tsx
const nodeTypes = {
  start: StartNode,
  end: EndNode,
  task: TaskNode,
  gateway: GatewayNode,
};
```

This object is passed to `<ReactFlow nodeTypes={nodeTypes} />`. React Flow uses these keys to render the correct component for each node's `type` field.

---

## 6. Data Models & Type Definitions

### Action Object Shape

Each task node can have an array of actions. Each action has:

```typescript
interface Action {
  id: string;          // Unique ID, e.g., "a1", "act_1713264000000"
  type: string;        // One of: "email" | "webhook" | "update_record" | "slack"
  label: string;       // Human-readable description
  variableMap: {       // Dynamic variable mappings (key = parameter name, value = template string)
    [key: string]: string;  // e.g., { to: "{{form.manager_email}}", subject: "Approval: {{form.employee_name}}" }
  };
}
```

### Action Type Configuration (`ACTION_TYPES`)

```typescript
const ACTION_TYPES: Record<string, { icon: LucideIcon, label: string, color: string, bg: string }> = {
  email:         { icon: Mail,           label: 'Send Email',     color: 'text-blue-600 dark:text-blue-400',    bg: 'bg-blue-500/10' },
  webhook:       { icon: Globe,          label: 'Webhook POST',   color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10' },
  update_record: { icon: Database,       label: 'Update Record',  color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
  slack:         { icon: MessageSquare,  label: 'Slack Alert',    color: 'text-amber-600 dark:text-amber-400',  bg: 'bg-amber-500/10' },
};
```

### Action Parameter Fields by Type

The function `getActionFields(type)` returns the parameter names for each action type:

| Action Type | Parameters |
|-------------|-----------|
| `email` | `to`, `subject`, `body` |
| `webhook` | `url`, `method`, `payload` |
| `update_record` | `field`, `value` |
| `slack` | `channel`, `message` |
| (default) | `value` |

### Gateway Condition Shape

Each gateway node stores conditions per outgoing handle:

```typescript
// Stored in node.data.conditions
interface GatewayConditions {
  [handleId: string]: Condition[];  // e.g., { "top": [...], "bottom": [...] }
}

interface Condition {
  id: string;        // Unique ID, e.g., "c1", "cond_1713264000000"
  field: string;     // Variable path, e.g., "wf.approval_decision", "form.department"
  operator: string;  // One of the CONDITION_OPERATORS values
  value: string;     // Comparison value, e.g., "approved"
}
```

### Condition Operators (`CONDITION_OPERATORS`)

```typescript
const CONDITION_OPERATORS = [
  { value: 'equals',       label: '== equals' },
  { value: 'not_equals',   label: '!= not equals' },
  { value: 'contains',     label: 'contains' },
  { value: 'gt',           label: '> greater than' },
  { value: 'lt',           label: '< less than' },
  { value: 'gte',          label: '>= greater or equal' },
  { value: 'lte',          label: '<= less or equal' },
  { value: 'is_empty',     label: 'is empty' },         // No value input shown
  { value: 'is_not_empty', label: 'is not empty' },     // No value input shown
];
```

### Form Schema Shape

```typescript
interface FormField {
  id: string;      // e.g., "f1"
  name: string;    // Snake_case variable name, e.g., "employee_name"
  label: string;   // Display label, e.g., "Employee Name"
  type: string;    // "text" | "select" | "textarea" | "number" | "email" | "date"
}

interface AvailableForm {
  id: string;        // e.g., "form_laptop"
  name: string;      // e.g., "Hardware Refresh (Laptop)"
  fields: FormField[];
}
```

### System Variables (`SYSTEM_VARIABLES`)

These are always available regardless of linked form:

| Variable Name | Label | Group |
|--------------|-------|-------|
| `sys.submitter_name` | Submitter Name | System |
| `sys.submitter_email` | Submitter Email | System |
| `sys.submission_date` | Submission Date | System |
| `sys.request_id` | Request ID | System |
| `sys.current_status` | Current Status | System |
| `wf.last_approver` | Last Approver | Workflow |
| `wf.approval_decision` | Approval Decision | Workflow |
| `wf.approval_comments` | Approval Comments | Workflow |

### Simulation Types

```typescript
interface SimulationStep {
  nodeId: string;
  edgeId?: string;
  label: string;
  type: string;                                       // Node type: "start" | "task" | "gateway" | "end"
  status: 'pending' | 'active' | 'completed' | 'skipped';
  timestamp: string;                                  // Formatted time string
  duration?: number;                                  // Milliseconds
  detail?: string;                                    // Optional description of what happened
}

interface SimulationRun {
  id: string;           // e.g., "run_001"
  name: string;         // e.g., "Approval Path (Approved)"
  timestamp: string;    // ISO timestamp
  status: 'completed' | 'failed' | 'running';
  path: string[];       // Ordered node IDs traversed
  steps: SimulationStep[];
  duration: number;     // Total milliseconds
}
```

### Node Data Shapes (per type)

**Start Node:**
```typescript
{ label: string; simStatus?: 'active' | 'completed' | undefined }
```

**End Node:**
```typescript
{ label: string; simStatus?: 'active' | 'completed' | undefined }
```

**Task Node:**
```typescript
{
  label: string;
  taskType: 'approval' | 'task';    // 'approval' = User Task, 'task' = Service Task
  assignee?: string;                 // e.g., "Manager", "IT Team"
  actions: Action[];                 // Array of execution steps
  simStatus?: 'active' | 'completed' | 'skipped' | undefined;
}
```

**Gateway Node:**
```typescript
{
  label: string;
  conditions: {                     // Keyed by outgoing handle ID
    [handleId: string]: Condition[];
  };
  simStatus?: 'active' | 'completed' | undefined;
}
```

---

## 7. BPMN Node System

### Start Node (`StartNode`)

- **Shape**: 48x48 circle (`w-12 h-12 rounded-full`)
- **Border**: 1.5px emerald (`border-[1.5px] border-emerald-600/60`)
- **Icon**: `Play` (lucide), 16x16, emerald-600, slight right offset (`ml-0.5`)
- **Handle**: Single `source` handle on `Position.Right`, emerald-500
- **Label**: Positioned below (`absolute -bottom-6`), 10px, font-medium, muted-foreground
- **Selection**: `ring-4 ring-emerald-500/20 border-emerald-500`
- **Sim Active**: `ring-4 ring-emerald-500/40 border-emerald-500 animate-pulse`
- **Sim Completed**: Green checkmark badge at top-right corner (4x4 emerald circle with white Check icon)

### End Node (`EndNode`)

- **Shape**: 48x48 circle
- **Border**: 3.5px destructive (`border-[3.5px] border-destructive/80`) - thicker than start per BPMN spec
- **Icon**: `Square` (lucide), 14x14, destructive/80, filled at 20% opacity
- **Handle**: Single `target` handle on `Position.Left`, destructive color
- **Label**: Same as Start Node
- **Selection**: `ring-4 ring-destructive/20 border-destructive`
- **Sim states**: Same pattern as StartNode

### Task Node (`TaskNode`)

Most complex node. Card-based layout with 3 sections:

**Container:**
- `min-w-[220px] max-w-[260px]`
- `bg-background rounded-lg border shadow-sm`
- Handles: `target` on Left, `source` on Right (both `bg-muted-foreground`)

**Header section** (`px-3 py-2 border-b bg-muted/20 rounded-t-lg`):
- Left: Type icon + label in mono uppercase
  - User Task: `User` icon (blue-600) + "USER TASK"
  - Service Task: `Settings2` icon (amber-600) + "SERVICE TASK"
- Right: Action count badge (mono, 9px) + sim status indicator

**Body section** (`px-3 py-3`):
- Node label: `text-sm font-medium`
- Assignee (approval tasks only): Avatar circle (4x4, blue bg, 2-letter initials) + name

**Action indicators** (if actions exist, `px-1.5 pb-1.5`):
- Container: `bg-muted/30 rounded-md border p-1.5`
- Each action: 20x20 square with type-colored icon and bg

**Sim status styling:**
- `active`: Blue border + ring + shadow-lg with blue glow + pulsing dot
- `completed`: Emerald border + ring + `CheckCircle2` icon
- `skipped`: 50% opacity, muted border

### Gateway Node (`GatewayNode`)

- **Shape**: 48x48 diamond (achieved via `rotate-45` on inner div)
- **Outer container**: `w-12 h-12` flex center (not rotated, so handles align properly)
- **Inner diamond**: `absolute inset-0 rotate-45 rounded-sm border-[1.5px]`
- **Icon**: `X` (lucide), 20x20, amber-600/80, `stroke-[3]` - standard BPMN XOR marker
- **Handles** (4 total):
  - `target` on Left (`-left-1`)
  - `source` on Top (`-top-1`, id="top")
  - `source` on Right (`-right-1`, id="right")
  - `source` on Bottom (`-bottom-1`, id="bottom")
- All handles: `bg-amber-500 !border-2 !border-background`
- **Label**: Below diamond, same style as other nodes
- **Sim completed**: Green checkmark badge offset to `-top-2 -right-2`

---

## 8. Edge System & Sequence Flows

### Default Edge Configuration

```tsx
defaultEdgeOptions={{
  type: 'smoothstep',
  style: { stroke: '#9ca3af', strokeWidth: 1.5 },
}}
```

### Edge Styling Rules

| Edge Type | Stroke Color | Width | Animated | Label |
|-----------|-------------|-------|----------|-------|
| Default | `#9ca3af` (gray) | 1.5 | No | None |
| Approved path (Yes) | `#10b981` (emerald) | 1.5 | Yes | "Yes" |
| Rejected path (No) | `#ef4444` (destructive) | 1.5 | No | "No" |
| Sim: currently active | `#2563eb` (primary) | 2.5 | Yes | - |
| Sim: already traversed | `#10b981` | 1.5 | No | - |
| Sim: skipped path | Original color | 1.5 | No | opacity: 0.3 |

### Edge Label Styling

```typescript
labelStyle: { 
  fill: '#374151',      // Dark gray text
  fontSize: 11, 
  fontWeight: 600, 
  fontFamily: 'Inter' 
}
labelBgStyle: { 
  fill: '#ffffff',       // White background
  fillOpacity: 0.9, 
  stroke: '#e5e7eb',     // Light border
  strokeWidth: 1, 
  rx: 4, ry: 4           // Rounded corners
}
labelBgPadding: [6, 4]   // [horizontal, vertical]
```

### Arrow Markers

All edges use `MarkerType.ArrowClosed` with color matching the edge stroke:

```typescript
markerEnd: { type: MarkerType.ArrowClosed, color: '#9ca3af' }  // Default
markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }  // Approved
markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' }  // Rejected
```

---

## 9. Three-Panel Studio Layout

### Overall Structure

```
+-------------------------------------------------------------------+
| HEADER (h-14, sticky, backdrop-blur-xl, z-40)                     |
+-------------------------------------------------------------------+
| TRIGGER PANEL (collapsible, animated, z-30) - optional             |
+-------------------------------------------------------------------+
| LEFT SIDEBAR  |   CENTER CANVAS    |    RIGHT SIDEBAR              |
| w-[260px]     |   flex-1           |    w-[360px]                  |
| BPMN Palette  |   ReactFlow        |    Properties Panel           |
| or Sim Ctrls  |   + MiniMap         |    Tabs: General/Exec/Map/Cnd|
|               |   + Controls        |                              |
+-------------------------------------------------------------------+
| HISTORY DRAWER (fixed bottom, h-[320px], z-50) - optional          |
+-------------------------------------------------------------------+
```

### Header Bar

**Left side:**
- Back button (ghost icon, navigates to `/admin/services`)
- Vertical divider (`h-4 w-px bg-border/60`)
- Breadcrumb: "Services" (clickable) > "/" > "Hardware Refresh (Laptop)" (bold)
- Draft badge (blue-500/10 bg, mono, uppercase)

**Right side:**
- Form trigger indicator button (emerald when linked, muted when unlinked)
- Vertical divider
- Save status ("Saved" with green checkmark)
- Simulate / Exit Sim toggle button
- History button
- Publish button (primary color, filled)

### Left Sidebar (Design Mode)

- Search/filter input with `Search` icon
- Section header: "BPMN Elements" with `GitBranch` icon (10px, mono, uppercase, tracking-widest)
- 5 draggable palette items:
  1. Start Event (Circle icon)
  2. User Task (User icon)
  3. Service Task (Settings2 icon)
  4. Exclusive Gateway (Split icon)
  5. End Event (Square icon)
- Each item: icon box (32x32, bordered) + label + description + `GripVertical` on hover

### Left Sidebar (Simulation Mode)

Replaces the palette entirely:
- Title: "Simulation" with Play icon
- Running badge (animated pulse when active)
- Decision picker: Select dropdown with "Approved Path" or "Rejected Path"
- Control buttons: Run (blue-600) | Pause | Reset
- Step timeline: Vertical timeline with status dots, labels, timestamps, durations, details

### Center Canvas

```tsx
<ReactFlow
  nodes={nodes}
  edges={edges}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  onConnect={onConnect}
  onInit={setReactFlowInstance}
  onDrop={onDrop}
  onDragOver={onDragOver}
  onSelectionChange={onSelectionChange}
  onEdgeClick={onEdgeClick}
  nodeTypes={nodeTypes}
  fitView
  fitViewOptions={{ padding: 0.15 }}
  proOptions={{ hideAttribution: true }}
  minZoom={0.2}
  maxZoom={1.5}
/>
```

Canvas sub-elements:
- `Background`: Dots variant, gap 16, size 1, color `var(--color-border)`, opacity 0.8
- `Controls`: Bottom-left, styled with bg-background, rounded-md, no interactive toggle
- `MiniMap`: Bottom-right, with custom `nodeColor` function by type + sim status

### Right Properties Panel

**Empty state** (no node selected):
- Centered vertically
- 64x64 circle with `MousePointerClick` icon
- "No Selection" heading
- Helper text: "Click on any node in the canvas..."

**When node is selected:**
- Context header: Settings icon + "Properties" + node type badge
- Tab navigation (varies by node type):
  - **All nodes**: "General" tab
  - **Task nodes**: "General" | "Execution" (with count badge) | "Mapping" (with Variable icon)
  - **Gateway nodes**: "General" | "Conditions" (with Split icon)

---

## 10. Feature: Form Trigger System

### Purpose

Links a workflow to one of the existing forms created in the Form Builder. This determines:
1. Which form fields are available as variables throughout the workflow
2. What event triggers the workflow execution

### UI Location

Collapsible panel below the header, toggled by the "Link Form" button in the header.

### State Variables

```tsx
const [linkedFormId, setLinkedFormId] = useState<string | null>('form_laptop');  // Default to laptop form
const [triggerEvent, setTriggerEvent] = useState('on_submit');
const [showTriggerPanel, setShowTriggerPanel] = useState(false);
```

### Available Forms (Mock Data)

| Form ID | Name | Field Count |
|---------|------|-------------|
| `form_laptop` | Hardware Refresh (Laptop) | 7 fields |
| `form_access` | System Access Request | 3 fields |
| `form_leave` | Leave Request | 3 fields |

### Trigger Events

| Value | Label |
|-------|-------|
| `on_submit` | On Form Submission |
| `on_update` | On Record Update |
| `on_status_change` | On Status Change |
| `scheduled` | Scheduled (Cron) |

### Panel Layout

Three-column grid (`grid-cols-3 gap-4`):
1. **Linked Form** - Select dropdown with form names (FileText icon per item)
2. **Trigger Event** - Select dropdown with event types
3. **Available Fields** - Badge list showing first 4 field names + overflow count

### Integration Points

The `linkedFormId` flows into:
- `VariablePicker` component (determines which form fields appear)
- `ConditionRow` component (form fields available as condition sources)
- Header button styling (emerald when linked, muted when not)

---

## 11. Feature: Gateway Condition Builder

### Purpose

Allows admins to define conditional expressions for each outgoing path from an Exclusive (XOR) Gateway. At runtime, the engine evaluates these conditions to determine which path to take.

### UI Location

Right properties panel > "Conditions" tab (auto-selected when a gateway is clicked).

### Data Storage

Conditions are stored in `node.data.conditions` as a `Record<string, Condition[]>` keyed by handle ID:

```typescript
{
  conditions: {
    "top": [{ id: "c1", field: "wf.approval_decision", operator: "equals", value: "approved" }],
    "bottom": [{ id: "c2", field: "wf.approval_decision", operator: "equals", value: "rejected" }],
    "right": []  // Default path (no conditions)
  }
}
```

### Helper Functions

```typescript
getGatewayConditions(handleId: string): Condition[]      // Get conditions for a specific handle
updateGatewayConditions(handleId: string, conditions: Condition[])  // Set conditions for handle
addCondition(handleId: string): void                      // Add empty condition to handle
updateCondition(handleId: string, condId: string, key: string, value: string): void
removeCondition(handleId: string, condId: string): void
getOutgoingEdges(): Edge[]                                // Get all edges sourced from this gateway
```

### UI Rendering Logic

For each outgoing edge from the selected gateway:
1. **Path header**: Color dot (green for Yes, red for No, amber default) + edge label + arrow + target node label
2. **Condition list** (indented with `ml-4 border-l-2`):
   - Empty state: "No conditions - this will be the default path."
   - Each condition: `ConditionRow` component
   - "Add Condition" button (ghost style)

### ConditionRow Component

Props:
```typescript
{
  condition: { id: string, field: string, operator: string, value: string };
  onChange: (key: string, value: string) => void;
  onRemove: () => void;
  linkedFormId: string | null;
}
```

Layout: Horizontal flex with:
1. **Field selector** (flex-1): Combined list of form fields (`form.field_name`) and system variables (`sys.*`, `wf.*`)
2. **Operator selector** (w-[110px]): All 9 operators
3. **Value input** (w-[80px]): Hidden for `is_empty` / `is_not_empty` operators
4. **Remove button** (h-6 w-6): X icon, opacity-0 until group hover

### Empty Gateway State

If the gateway has no outgoing connections, shows a centered warning:
- `AlertTriangle` icon (amber)
- "No outgoing connections"
- Helper text about connecting nodes first

---

## 12. Feature: Execution Steps (Actions)

### Purpose

Each task node can have ordered execution steps (actions) that fire when the task activates. These are the "side effects" of a workflow step.

### UI Location

Right properties panel > "Execution" tab (only visible for task nodes).

### Action List Rendering

Each action renders as a card with:
- **Left gutter** (w-6): Step number (mono, 9px) + grip handle
- **Main content** (padded left):
  - Type selector (inline, transparent border): Icon + label dropdown
  - Label input (text input for description)
- **Remove button**: Ghost icon, opacity-0 until group hover

### Adding Actions

"Add Execution Step" button (dashed border, full-width):
- Creates action with: `{ id: act_${Date.now()}, type: 'email', label: 'New Action', variableMap: {} }`

### Action Management Functions

```typescript
addAction(): void
updateAction(actionId: string, key: string, value: any): void
updateActionVariable(actionId: string, varKey: string, varValue: string): void
removeAction(actionId: string): void
```

---

## 13. Feature: Dynamic Variable Mapper

### Purpose

Maps dynamic variables (form fields, system variables) into each action's parameters. For example, mapping `{{form.manager_email}}` into an email action's `to` field.

### UI Location

Right properties panel > "Mapping" tab (only visible for task nodes, identified by `Variable` icon).

### Template Syntax

Variables use double-curly-brace syntax: `{{namespace.variable_name}}`

Namespaces:
- `form.*` - Form field values (only available when a form is linked)
- `sys.*` - System context variables
- `wf.*` - Workflow runtime variables

### Rendering Logic

For each action on the selected task:
1. **Action header**: Step number badge + type icon + action label
2. **Parameter list** (indented with `ml-7 border-l-2`):
   - For each parameter (determined by `getActionFields(action.type)`):
     - Label (mono font, 10px)
     - "Insert Variable" button (opens `VariablePicker`)
     - Input field (mono font, 11px) - value can contain mixed text and `{{variables}}`

### No-Form Warning

If no form is linked, shows an amber warning:
- `AlertTriangle` icon
- "No form linked. Link a form in the trigger panel to access form field variables."

### Empty State

If the task has no actions:
- `Variable` icon (muted)
- "No actions to map"
- "Add execution steps in the Execution tab first."

---

## 14. Feature: Variable Picker Component

### Purpose

A floating popup component that lets users browse and insert template variables with a single click.

### Component Signature

```tsx
function VariablePicker({ 
  onInsert,       // (variable: string) => void - called with e.g. "{{form.employee_name}}"
  linkedFormId    // string | null - determines which form fields to show
}: Props)
```

### UI Design

- **Trigger**: Small text button: `{} Insert Variable` (Braces icon + text, primary color)
- **Popup**: Animated floating panel (260px wide, max-height 280px with scroll)
  - Appears **above** the trigger (`bottom-full mb-1`)
  - Entry animation: fade + slide up + slight scale (0.12s)
  - Exit animation: reverse

### Popup Content

**Section 1: Form Fields** (only shown if `linkedFormId` is set)
- Header: `FileText` icon + "FORM FIELDS" (9px, mono, uppercase)
- Each field: Code badge (`form.field_name` in primary color with bg) + display label
- Click inserts `{{form.field_name}}`

**Section 2: System & Workflow** (always shown)
- Header: `Settings` icon + "SYSTEM & WORKFLOW"
- System vars: Code badge in amber color scheme
- Click inserts `{{sys.variable_name}}` or `{{wf.variable_name}}`

### Insertion Behavior

On click, the selected variable string is **appended** to the current input value:
```tsx
onInsert={(v) => updateActionVariable(act.id, fieldKey, (varMap[fieldKey] || '') + v)}
```

---

## 15. Feature: Simulation Engine

### Purpose

A visual step-by-step simulation that animates the workflow execution across the canvas, highlighting nodes and edges as they activate, complete, or get skipped.

### UI State

```tsx
const [simMode, setSimMode] = useState(false);              // Whether sim UI is shown
const [simRunning, setSimRunning] = useState(false);         // Whether animation is running
const [simCurrentStep, setSimCurrentStep] = useState(-1);    // Current step index
const [simPath, setSimPath] = useState<string[]>([]);        // Interleaved node+edge IDs
const [simSteps, setSimSteps] = useState<SimulationStep[]>([]); // Step metadata
const [simDecision, setSimDecision] = useState<'approved' | 'rejected'>('approved');
const [showHistory, setShowHistory] = useState(false);
const simTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
```

### Simulation Paths

The engine currently supports two hardcoded paths based on the seed workflow:

**Approved path:**
```
1 -> e1-2 -> 2 -> e2-3 -> 3 -> e3-4 -> 4 -> e4-6 -> 6
(Start -> LM Approval -> Gateway -> IT Fulfillment -> Fulfilled)
Skipped: nodes 5, 7
```

**Rejected path:**
```
1 -> e1-2 -> 2 -> e2-3 -> 3 -> e3-5 -> 5 -> e5-7 -> 7
(Start -> LM Approval -> Gateway -> Notify Rejection -> Rejected)
Skipped: nodes 4, 6
```

### `startSimulation()` Algorithm

1. Set `simMode=true`, `simRunning=true`, `simCurrentStep=0`
2. Determine path based on `simDecision`
3. Compute `nodeIds` (filter out edge IDs from path)
4. Compute `skippedNodes` (nodes not in the chosen path)
5. Build `SimulationStep[]` with pending status, random durations (200-2200ms), and timestamps
6. Initialize node states: skipped nodes get `simStatus: 'skipped'`, others cleared
7. Initialize edge states: skipped edges get `opacity: 0.3`, all set to `animated: false`
8. Start recursive `runStep()` function with 1200ms intervals via `setTimeout`

### `runStep()` Per-Step Logic

For each step at index `stepIdx`:
1. Update `simCurrentStep`
2. Update `simSteps` status: previous = completed, current = active, future = pending
3. Update node `simStatus` in the `setNodes` updater:
   - Current node: `'active'`
   - Previous nodes: `'completed'`
   - Skipped nodes: `'skipped'`
4. Highlight edge: current edge gets blue stroke (2.5px, animated), traversed edges get green
5. Schedule next step after 1200ms

### `stopSimulation()`

- Stops the timer
- Marks all non-pending steps as completed
- Does NOT exit sim mode (user stays in sim view)

### `resetSimulation()`

- Clears all sim state
- Restores all nodes to `simStatus: undefined`
- Restores edges to `initialEdges` (complete reset)
- Exits sim mode (`simMode = false`)

### Cleanup

```tsx
useEffect(() => {
  return () => { if (simTimerRef.current) clearTimeout(simTimerRef.current); };
}, []);
```

---

## 16. Feature: Run History Drawer

### Purpose

Bottom-sheet drawer showing past simulation runs in a data table format.

### UI

- **Trigger**: "History" button in the header
- **Animation**: Slides up from bottom (`y: '100%' -> 0`) with spring physics (damping: 30, stiffness: 300)
- **Position**: `fixed bottom-0 left-0 right-0 h-[320px] z-50`
- **Close**: X button in header

### Table Columns

| Column | Content |
|--------|---------|
| Run | ID (mono) + name |
| Status | Badge with icon (CheckCircle2 / XCircle / Timer) + text |
| Path | Visual dot chain (colored by node type) connected by tiny lines |
| Duration | Formatted as seconds (1 decimal) |
| Steps | Step count |
| Timestamp | Localized date string |

### Mock Data

Two pre-populated runs:
1. `run_001`: "Approval Path (Approved)" - 4.5s, 5 steps, completed
2. `run_002`: "Rejection Path" - 7.7s, 5 steps, completed

---

## 17. State Management

All state lives in the `Designer` component (no external state management library). Here is the complete state inventory:

### React Flow State

```tsx
const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
```

### Selection State

```tsx
const [selectedNode, setSelectedNode] = useState<Node | null>(null);
const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
const [activeTab, setActiveTab] = useState<'settings' | 'actions' | 'conditions' | 'variables'>('settings');
```

### Form Trigger State

```tsx
const [linkedFormId, setLinkedFormId] = useState<string | null>('form_laptop');
const [triggerEvent, setTriggerEvent] = useState('on_submit');
const [showTriggerPanel, setShowTriggerPanel] = useState(false);
```

### Simulation State

```tsx
const [simMode, setSimMode] = useState(false);
const [simRunning, setSimRunning] = useState(false);
const [simCurrentStep, setSimCurrentStep] = useState(-1);
const [simPath, setSimPath] = useState<string[]>([]);
const [simSteps, setSimSteps] = useState<SimulationStep[]>([]);
const [simDecision, setSimDecision] = useState<'approved' | 'rejected'>('approved');
const [showHistory, setShowHistory] = useState(false);
const simTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
```

### Derived State

```tsx
const linkedForm = AVAILABLE_FORMS.find(f => f.id === linkedFormId);
```

---

## 18. Drag-and-Drop System

### How It Works

1. **Palette items** have `draggable` attribute and `onDragStart` handler
2. `onDragStart` stores node type and optional default data in `dataTransfer`:
   ```tsx
   event.dataTransfer.setData('application/reactflow', nodeType);
   event.dataTransfer.setData('application/reactflow-data', JSON.stringify(defaultData));
   ```
3. Canvas has `onDragOver` (prevents default, sets drop effect) and `onDrop`
4. `onDrop` reads the type and data, converts screen coordinates to flow coordinates, creates a new node

### Node ID Generation

```tsx
let id = 100;
const getId = () => `dndnode_${id++}`;
```

IDs start at 100 to avoid collision with the initial nodes (1-7). This counter is **module-level** (persists across renders but resets on page reload).

### Default Data per Palette Item

| Palette Item | Type | Default Data |
|-------------|------|-------------|
| Start Event | `start` | None (just `{ label: 'New start' }`) |
| User Task | `task` | `{ taskType: 'approval', actions: [] }` |
| Service Task | `task` | `{ taskType: 'task', actions: [] }` |
| Exclusive Gateway | `gateway` | None |
| End Event | `end` | None |

---

## 19. Node Selection & Properties Panel Logic

### Selection Handler

```tsx
const onSelectionChange = useCallback(({ nodes: selNodes }: { nodes: Node[] }) => {
  if (selNodes.length > 0) {
    setSelectedNode(selNodes[0]);
    setSelectedEdge(null);
    // Auto-select appropriate tab
    if (selNodes[0].type === 'gateway') setActiveTab('conditions');
    else if (selNodes[0].type === 'task') setActiveTab('settings');
    else setActiveTab('settings');
  } else {
    setSelectedNode(null);
  }
}, []);
```

### Edge Click Handler

```tsx
const onEdgeClick = useCallback((_: any, edge: Edge) => {
  setSelectedEdge(edge);
  setSelectedNode(null);
}, []);
```

### Tab Visibility Rules

| Node Type | Available Tabs |
|-----------|---------------|
| `start` | General |
| `end` | General |
| `task` | General, Execution, Mapping |
| `gateway` | General, Conditions |
| (none selected) | Empty state |

### Node Update Pattern

All node data updates flow through `updateSelectedNode`:

```tsx
const updateSelectedNode = (key: string, value: any) => {
  if (!selectedNode) return;
  // Update in React Flow's node array
  setNodes((nds) => nds.map((node) => {
    if (node.id === selectedNode.id) {
      return { ...node, data: { ...node.data, [key]: value } };
    }
    return node;
  }));
  // Also update local selectedNode state (for immediate UI response)
  setSelectedNode((prev) => prev ? { ...prev, data: { ...prev.data, [key]: value } } : null);
};
```

**Important**: Both `setNodes` AND `setSelectedNode` must be updated in sync. Updating only `setNodes` would cause the properties panel to show stale data until the next selection change.

---

## 20. Animation & Motion Patterns

### Library

`motion/react` (formerly Framer Motion), imported as:
```tsx
import { motion, AnimatePresence } from 'motion/react';
```

### Animated Elements

**Form Trigger Panel** (collapsible):
```tsx
initial={{ height: 0, opacity: 0 }}
animate={{ height: 'auto', opacity: 1 }}
exit={{ height: 0, opacity: 0 }}
transition={{ duration: 0.2 }}
```

**Variable Picker popup**:
```tsx
initial={{ opacity: 0, y: -4, scale: 0.97 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
exit={{ opacity: 0, y: -4, scale: 0.97 }}
transition={{ duration: 0.12 }}
```

**History Drawer** (bottom sheet):
```tsx
initial={{ y: '100%' }}
animate={{ y: 0 }}
exit={{ y: '100%' }}
transition={{ type: 'spring', damping: 30, stiffness: 300 }}
```

### CSS Animations

- `animate-pulse`: Used on sim-active nodes and "Running" badge
- Tailwind transitions: `transition-all`, `transition-colors`, `transition-opacity` used extensively

---

## 21. Initial Demo Data (Seed Workflow)

### Workflow: Hardware Refresh (Laptop) Approval Process

**Nodes (7):**

| ID | Type | Label | Position | Key Data |
|----|------|-------|----------|----------|
| 1 | start | Request Submitted | (50, 250) | - |
| 2 | task | Line Manager Approval | (180, 202) | taskType: approval, assignee: Manager, 2 actions |
| 3 | gateway | Is Approved? | (520, 236) | 2 condition groups (top=approved, bottom=rejected) |
| 4 | task | IT Fulfillment | (650, 80) | taskType: task, assignee: IT Team, 2 actions |
| 5 | task | Notify Rejection | (650, 340) | taskType: task, assignee: System, 2 actions |
| 6 | end | Fulfilled | (1000, 122) | - |
| 7 | end | Rejected | (1000, 382) | - |

**Edges (6):**

| ID | Source | Target | Handle | Label | Color |
|----|--------|--------|--------|-------|-------|
| e1-2 | 1 | 2 | - | - | Gray |
| e2-3 | 2 | 3 | - | - | Gray |
| e3-4 | 3 | 4 | top | Yes | Emerald (animated) |
| e3-5 | 3 | 5 | bottom | No | Red |
| e4-6 | 4 | 6 | - | - | Gray |
| e5-7 | 5 | 7 | - | - | Gray |

**Pre-configured Actions:**

Node 2 (Line Manager Approval):
1. Send Email: `to={{form.manager_email}}`, `subject=Approval Required: {{form.employee_name}}`, `body=Please review request {{sys.request_id}}`
2. Update Record: `field=status`, `value=pending_approval`

Node 4 (IT Fulfillment):
1. Webhook POST: `url=https://jira.company.com/api/issue`, `payload={"summary": "{{form.laptop_model}} for {{form.employee_name}}", "priority": "{{form.priority}}"}`
2. Slack Alert: `channel=#it-ops`, `message=New fulfillment: {{form.laptop_model}} for {{form.employee_name}} ({{sys.request_id}})`

Node 5 (Notify Rejection):
1. Send Email: `to={{sys.submitter_email}}`, `subject=Request {{sys.request_id}} Denied`, `body=Your request was rejected. Comments: {{wf.approval_comments}}`
2. Update Record: `field=status`, `value=rejected`

---

## 22. Known Limitations & Future Enhancements

### Current Limitations

1. **Form data is mocked**: `AVAILABLE_FORMS` is a hardcoded array. In production, this should fetch from the Form Builder's data store.
2. **Simulation paths are hardcoded**: The simulation engine knows about the seed workflow's topology. For dynamic workflows, it would need to traverse the graph at runtime.
3. **No edge properties panel**: Clicking an edge sets `selectedEdge` state but there's no UI to edit edge labels/conditions from the edge itself (only from the gateway's Conditions tab).
4. **No persistence**: All state is in-memory. Closing or refreshing loses changes.
5. **No undo/redo**: No history stack for node/edge changes.
6. **Single gateway type**: Only XOR (Exclusive) gateways. No AND (Parallel) or OR (Inclusive) gateways.
7. **No drag-to-reorder actions**: The `GripVertical` handle on actions is visual only; no actual drag-to-sort is implemented.
8. **Module-level ID counter**: `let id = 100` resets on page reload and could cause ID collisions if nodes are loaded from persistence.
9. **No validation**: No checks for disconnected nodes, missing conditions, or circular references.
10. **No dark mode node colors**: Node simulation status colors don't have dark mode variants for edge strokes.

### Suggested Enhancements

1. **Parallel Gateway (AND)**: Add a new node type with `+` marker for parallel execution paths that merge.
2. **SLA Timers**: Add timer boundary events to User Tasks for escalation deadlines.
3. **Version Diffing**: Compare draft vs. published workflow versions side-by-side.
4. **Real Graph Traversal for Simulation**: Use BFS/DFS to discover all paths dynamically, evaluating conditions.
5. **Supabase Persistence**: Save workflows as JSON to a Supabase `workflows` table.
6. **Action Drag Reordering**: Implement with `react-dnd` (already installed in package.json).
7. **Keyboard Shortcuts**: Delete key for selected node, Ctrl+Z for undo.
8. **Expression Builder**: Rich condition builder with AND/OR grouping, parentheses, nested conditions.
9. **Edge Label Editing**: Click-to-edit labels directly on edges.
10. **Node Validation Badges**: Red warning dots on nodes with missing required configuration.
11. **Form Field Type Awareness**: Show different operators based on field type (e.g., date comparisons for date fields).
12. **Webhook Response Mapping**: Map response data from webhook actions into workflow variables for downstream use.
13. **Conditional Action Execution**: Allow actions within a task to have their own conditions (execute this action only if X).
14. **Multi-language Support**: i18n for all UI strings.

---

## Appendix A: Complete Import List

```tsx
// React
import { useState, useCallback, useRef, useEffect } from 'react';

// Router
import { useNavigate } from 'react-router';

// React Flow (canvas library)
import {
  ReactFlow, MiniMap, Controls, Background,
  useNodesState, useEdgesState, addEdge, Handle, Position,
  Connection, Edge, NodeProps, Node, ReactFlowProvider,
  MarkerType, BackgroundVariant, useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Icons (Lucide)
import { 
  ArrowLeft, Check, Save, Search, Play, Split, Mail, User, 
  Settings, Layers, GripVertical, Trash2, GitBranch, Zap, Plus, 
  Globe, Database, MessageSquare, Circle, X, Settings2, Square, 
  MoreHorizontal, MousePointerClick, FileText, Link2, Variable, 
  ChevronDown, ChevronRight, Clock, CheckCircle2, XCircle, 
  AlertTriangle, RotateCcw, Braces, Hash, ToggleLeft, ArrowRight, 
  Pause, SkipForward, StepForward, History, Eye, Timer, Workflow
} from 'lucide-react';

// shadcn/ui
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

// Animation
import { motion, AnimatePresence } from 'motion/react';
```

## Appendix B: CSS Class Patterns Reference

### Label Pattern (used everywhere for section headers)
```
text-[10px] font-semibold text-muted-foreground uppercase tracking-widest
```

### Compact Input Pattern
```
h-7 text-[11px] font-mono bg-background shadow-sm border-border/60 px-2
```

### Standard Input Pattern
```
h-9 text-xs bg-background shadow-sm border-border/60
```

### Ghost Delete Button Pattern
```
opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10
```

### Dashed Add Button Pattern
```
w-full border-dashed border-border/60 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary
```

### Section Card Pattern
```
border border-border/60 rounded-md bg-background shadow-sm
```

---

*This document was generated on April 16, 2026 and reflects the current state of `/src/app/pages/AdminWorkflow.tsx` (approximately 950 lines).*

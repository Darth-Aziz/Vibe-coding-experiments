# Tasheel — Cursor Agent Prompts

## How to Use These Prompts

Each prompt below is a self-contained instruction set for Cursor. Copy and paste them one at a time, in order. Wait for each phase to complete before starting the next.

Save this file and the architecture document (01-architecture.md) in your project root. Reference them in Cursor by saying "read 01-architecture.md for full context."

---

## PROMPT 0 — Project Setup

```
I'm building an enterprise service management platform called "Tasheel" (تسهيل). Read the architecture document at 01-architecture.md for full context.

Set up the project from scratch:

1. Initialize a Next.js 14 project with App Router, TypeScript, and Tailwind CSS
2. Install these exact dependencies:
   - shadcn/ui (init with default config, New York style)
   - Add these shadcn components: button, card, input, label, select, table, tabs, badge, dialog, dropdown-menu, separator, toast, sheet, command, popover, calendar, checkbox, radio-group, textarea, switch, avatar, tooltip, progress
   - zustand (with persist middleware)
   - @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
   - bpmn-js bpmn-js-properties-panel @bpmn-io/properties-panel camunda-bpmn-moddle
   - lucide-react
   - date-fns

3. Create the folder structure exactly as specified in the architecture doc (section 3)
4. Set up tailwind.config.ts with a clean enterprise color palette:
   - Primary: slate-900 (dark navy)
   - Accent: blue-600
   - Success: emerald-600
   - Warning: amber-500
   - Danger: red-600
   - Background: white with slate-50 for secondary surfaces
   - Border: slate-200

5. Create lib/types.ts with ALL TypeScript interfaces from the architecture doc (section 4)
6. Create lib/store.ts with the full Zustand store from the architecture doc (section 5), including localStorage persist
7. Create lib/mock-data.ts with the 7 pre-built services and 10 sample requests from the architecture doc (section 9). Make the data realistic — real employee names, real dates, real descriptions.
8. Create lib/utils.ts with: cn() helper, formatDate(), generateTicketNumber(), getStatusColor()
9. Create lib/bpmn-utils.ts with a default BPMN XML template (Start → Submit → Review → Approve → End) and a helper function to extract stage names from BPMN XML

Make sure `npm run dev` starts cleanly on localhost:3000 with no errors.
```

---

## PROMPT 1 — Root Layout and Navigation

```
Read 01-architecture.md for context. Now build the root layout and navigation:

1. app/layout.tsx — Root layout with:
   - Clean sans-serif font (Geist or similar from next/font)
   - Toaster component for notifications
   - Full height layout

2. app/page.tsx — Portal selector landing page:
   - Centered layout with Tasheel logo/name at top
   - Two large cards side by side: "Admin Portal" (shield icon) and "Requester Portal" (user icon)
   - Each card has: icon, title, short description, "Enter" button
   - Cards link to /admin and /requester respectively
   - Clean, enterprise aesthetic. White background. Subtle shadows.

3. app/admin/layout.tsx — Admin layout with:
   - Left sidebar (240px wide, slate-900 background, white text)
   - Sidebar items: Dashboard, Services, Workflows
   - Active state highlighting
   - Tasheel logo at top of sidebar
   - "Switch to Requester" link at bottom
   - Main content area with white background and comfortable padding

4. app/requester/layout.tsx — Requester layout with:
   - Top navigation bar (white background, subtle bottom border)
   - Nav items: Service Catalog, My Requests
   - User avatar and name on the right ("Ahmed Al-Rashid")
   - "Switch to Admin" link
   - Main content area

5. components/shared/sidebar.tsx — Reusable admin sidebar
6. components/shared/header.tsx — Reusable requester header
7. components/shared/portal-selector.tsx — The landing page selector
8. components/shared/status-badge.tsx — Status badge component with color variants for: draft, published, archived, submitted, in_review, approved, rejected, completed

Make sure navigation works. Clicking through admin and requester portals should feel smooth.
```

---

## PROMPT 2 — Admin Dashboard and Service List

```
Read 01-architecture.md for context. Build the admin dashboard and service list:

1. app/admin/page.tsx — Admin Dashboard:
   - 4 stat cards in a row: Total Services (with icon), Published, Draft, Total Requests
   - Pull data from Zustand store
   - Below stats: "Recent Requests" section with a table showing last 5 requests
   - Table columns: Ticket #, Service, Requester, Status (with badge), Date
   - Quick action buttons: "Create New Service" and "View All Services"

2. app/admin/services/page.tsx — Service List:
   - Page header: "Services" title with "Create Service" button (primary)
   - Filter bar: category dropdown, status dropdown, search input
   - Data table using shadcn Table component
   - Columns: Service Name, Category (badge), Status (badge), Form Fields (count), Workflow (linked/not linked), Requests (count), Actions (dropdown: edit, form builder, workflow, delete)
   - Empty state if no services match filters
   - Click service name to navigate to edit page

3. components/admin/stats-cards.tsx — Stat card component
4. components/admin/service-table.tsx — Service table with sorting and filtering

Use the mock data from the store. Make it look polished — proper spacing, aligned columns, hover states on table rows.
```

---

## PROMPT 3 — Service Create/Edit

```
Read 01-architecture.md for context. Build service creation and editing:

1. app/admin/services/new/page.tsx — Create New Service:
   - Page header: "Create New Service" with breadcrumb (Services > New)
   - Form with shadcn components:
     - Service Name (text input)
     - Description (textarea)
     - Category (select: IT Support, HR, Facilities, Finance, General)
     - Icon (icon picker — show 12-16 common Lucide icons as a grid, click to select)
     - SLA Response Time (number input + "hours" label)
     - SLA Resolution Time (number input + "hours" label)
   - Two buttons at bottom: "Save as Draft" (secondary) and "Publish" (primary)
   - On save: add to Zustand store, redirect to service list
   - Toast notification on success

2. app/admin/services/[id]/page.tsx — Edit Service:
   - Same form as create, pre-filled with existing data
   - Additional tab navigation or links: "Details" (current), "Form Builder", "Workflow"
   - "Delete Service" button (danger, with confirmation dialog)
   - Status toggle: Draft ↔ Published

3. components/admin/service-form.tsx — Reusable service form component
4. components/admin/icon-picker.tsx — Icon selection grid

Form validation: name and category required. Show error states using shadcn form patterns.
```

---

## PROMPT 4 — Form Builder

```
Read 01-architecture.md for context. Build the drag-and-drop form builder:

1. app/admin/services/[id]/form/page.tsx — Form Builder page:
   - Page header: "Form Builder — [Service Name]" with breadcrumb
   - Three-panel layout:

   LEFT PANEL (200px) — "Field Palette":
   - Draggable field type cards: Text, Textarea, Number, Email, Select, Radio, Checkbox, Date, File Upload
   - Each card shows an icon and the field type name
   - Drag from here to the center panel

   CENTER PANEL (flex) — "Form Preview":
   - Drop zone for fields
   - Shows fields in order as they'll appear to the requester
   - Each field shows: drag handle, field label, field type indicator, remove button
   - Drag to reorder fields
   - Click a field to select it (highlight border)
   - Empty state: "Drag fields here to build your form"

   RIGHT PANEL (280px) — "Field Properties":
   - Shows when a field is selected in the center panel
   - Editable properties: Label, Placeholder, Required (toggle), Help text
   - For select/radio/checkbox: options list with add/remove
   - Preview of how the field will render
   - Empty state when no field selected: "Select a field to edit its properties"

2. components/admin/form-builder.tsx — Main form builder component
3. components/admin/field-palette.tsx — Draggable field type cards
4. components/admin/field-config.tsx — Field property editor panel
5. components/admin/form-preview.tsx — Center panel with drop zone

Use @dnd-kit/core and @dnd-kit/sortable for all drag-and-drop. Save form fields to the service in the Zustand store. Add a "Save Form" button and a "Preview as Requester" button that opens a dialog showing how the form looks.
```

---

## PROMPT 5 — BPMN Workflow Designer

```
Read 01-architecture.md for context. Build the BPMN workflow designer:

1. app/admin/services/[id]/workflow/page.tsx — Workflow Designer page:
   - Page header: "Workflow Designer — [Service Name]" with breadcrumb
   - Full-width bpmn-js canvas taking most of the page height (min 500px)
   - Toolbar above the canvas: Save, Undo, Redo, Zoom In, Zoom Out, Fit to Screen, Reset to Default
   - The bpmn-js modeler should load with:
     - If service has existing workflow: load the saved BPMN XML
     - If new: load the default template from lib/bpmn-utils.ts (Start → Submit → Review → Approve → End)
   - Left palette from bpmn-js: start events, end events, tasks, gateways
   - Properties panel on the right side showing task names and assignees

2. components/admin/workflow-canvas.tsx — bpmn-js React wrapper:
   - useRef for the canvas container div
   - useEffect to initialize BpmnModeler on mount
   - Load XML on init
   - Expose save function: exports XML from modeler, extracts stage names, saves to store
   - Cleanup: destroy modeler on unmount
   - Handle resize events
   - Style the canvas with a subtle grid background

3. Update lib/bpmn-utils.ts:
   - extractStagesFromXml(xml: string): WorkflowStage[] — parses BPMN XML to extract user tasks in order
   - getDefaultWorkflowXml(): string — returns the default 4-stage workflow

CRITICAL: bpmn-js needs CSS imports. Make sure to import:
- 'bpmn-js/dist/assets/diagram-js.css'
- 'bpmn-js/dist/assets/bpmn-js.css'
- 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'

The canvas should be interactive: users can drag elements, connect them with arrows, add gateways for conditional flows. This is the showpiece of the admin portal.
```

---

## PROMPT 6 — Requester Portal: Catalog and Request Form

```
Read 01-architecture.md for context. Build the requester portal:

1. app/requester/page.tsx — Service Catalog:
   - Page header: "Service Catalog" with search bar
   - Category filter pills: All, IT Support, HR, Facilities, Finance, General
   - Card grid (3 columns) showing ONLY published services
   - Each card: icon, service name, description (2 lines truncated), category badge, SLA info
   - Click card to navigate to service detail

2. app/requester/services/[id]/page.tsx — Service Detail + Request Form:
   - Service info header: icon, name, full description, SLA badges (response time, resolution time)
   - If service has a linked workflow: show workflow stages as a horizontal stepper preview (not interactive, just showing the stages the request will go through)
   - Dynamic form rendered from the service's FormField[] config
   - Each field renders the correct shadcn component based on its type
   - Form validation: required fields checked
   - Submit button
   - On submit: create request in store, show success dialog with ticket number
   - Success dialog: ticket number prominently displayed, "View Request" and "Back to Catalog" buttons

3. components/requester/service-catalog.tsx — Card grid component
4. components/requester/service-card.tsx — Individual service card
5. components/requester/dynamic-form.tsx — Renders form from FormField[] configuration
   - Map each field type to the correct shadcn component
   - Handle form state with React useState
   - Validate required fields on submit

Make the catalog visually appealing — proper card spacing, category colors, hover effects. The dynamic form should look exactly like a normal form, not like a "generated" form.
```

---

## PROMPT 7 — Request Tracking

```
Read 01-architecture.md for context. Build request tracking:

1. app/requester/requests/page.tsx — My Requests:
   - Page header: "My Requests" with status filter dropdown
   - Data table: Ticket #, Service Name, Status (badge), Current Stage, Submitted Date, Last Updated
   - Sort by date (newest first)
   - Click row to view detail
   - Empty state: "No requests yet. Browse the service catalog to get started."

2. app/requester/requests/[id]/page.tsx — Request Detail:
   - Request header: ticket number (large), service name, current status badge
   - Visual workflow tracker:
     - Horizontal stepper showing ALL stages from the linked BPMN workflow
     - Completed stages: green checkmark, solid line
     - Current stage: blue, pulsing dot
     - Future stages: gray, dashed line
     - Each stage shows: name, timestamp if completed, actor if completed
   - Submitted form data: display all form fields and their submitted values in a clean read-only layout
   - History timeline: vertical timeline showing each action taken
     - Each entry: actor name, action, timestamp, comment (if any)
     - Most recent at top
   - "Cancel Request" button (only if status is submitted or in_review)

3. components/requester/request-tracker.tsx — Visual workflow status tracker (horizontal stepper)
4. components/requester/request-table.tsx — Requests data table
5. components/requester/request-timeline.tsx — History timeline

The request tracker is the second showpiece after the BPMN canvas. Make it visually polished — smooth transitions between stages, clear indication of current position.
```

---

## PROMPT 8 — Polish and Demo Prep

```
Read 01-architecture.md for context. Final polish:

1. Loading states: Add skeleton loaders for tables and card grids
2. Empty states: Add illustrations or icons with helpful text for every empty list
3. Transitions: Add subtle page transitions and component mount animations
4. Responsive: Make sure everything looks good at 1280px+ (laptop/projector resolution)
5. Favicon: Add a simple favicon
6. Page titles: Add proper <title> to each page using Next.js metadata

7. Full flow test — verify this complete path works:
   a. Land on portal selector → choose Admin
   b. View dashboard stats
   c. Go to Services → Create New Service
   d. Fill in service details → Save as Draft
   e. Go to Form Builder → add 4-5 fields → Save
   f. Go to Workflow Designer → modify the default workflow → Save
   g. Publish the service
   h. Switch to Requester Portal
   i. Find the new service in catalog
   j. Open it → fill the dynamic form → Submit
   k. See success with ticket number
   l. Go to My Requests → find the request
   m. Open detail → see workflow tracker and history

8. Fix any bugs found during the full flow test
9. Commit everything to main branch with message "feat: Tasheel v1 — service management platform"

The app should feel complete and professional. No broken links, no console errors, no misaligned elements.
```

---

## PROMPT 9 — Demo Branch Setup

```
Create a clean demo branch for the live presentation:

1. git checkout -b demo/ready
2. Make sure everything runs: npm run dev → localhost:3000 → full flow works
3. git add . && git commit -m "demo: ready for live session"
4. git push origin demo/ready

Then create the live session branch from main:
1. git checkout main
2. git checkout -b demo/live-session
3. This is the branch I'll use on stage for live modifications

Document the exact demo modifications I'll make on stage:
- Quick: Change the accent color from blue-600 to indigo-600
- Quick: Add a "Priority" badge to service cards
- Medium: Add a new "Security" category with a new service "Building Access Card Request"
- Medium: Add a search bar to the My Requests page
- Impressive: Add an SLA countdown timer to the request detail page showing time remaining before SLA breach

For each modification, write the exact Cursor prompt I should use on stage.
```

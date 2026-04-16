# Tasheel — Design System Specification

## For Figma MCP Integration

This document defines the complete design system for Tasheel. Feed this to Figma (via MCP or manually) to generate the design system and screen designs.

---

## 1. Brand Identity

**Name:** Tasheel (تسهيل)
**Meaning:** "To make easy" — simplifying enterprise service management
**Personality:** Professional, trustworthy, efficient, clean
**Aesthetic:** Enterprise-refined minimalism. Think Stripe's dashboard meets Linear's clarity. No decoration for decoration's sake. Every element earns its space.

---

## 2. Color System

### Primary Palette
| Token | Hex | Usage |
|-------|-----|-------|
| primary-900 | #0F172A | Sidebar background, primary text |
| primary-800 | #1E293B | Sidebar hover states |
| primary-700 | #334155 | Secondary text, borders |
| primary-600 | #475569 | Muted text |
| primary-100 | #F1F5F9 | Page background (requester) |
| primary-50 | #F8FAFC | Card backgrounds, table alternating rows |

### Accent
| Token | Hex | Usage |
|-------|-----|-------|
| accent-600 | #2563EB | Primary buttons, links, active states |
| accent-500 | #3B82F6 | Hover states, focus rings |
| accent-100 | #DBEAFE | Light accent backgrounds, selected states |
| accent-50 | #EFF6FF | Very light accent tints |

### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| success-600 | #059669 | Published status, completed, approved |
| success-100 | #D1FAE5 | Success badge background |
| warning-500 | #F59E0B | Draft status, pending, in review |
| warning-100 | #FEF3C7 | Warning badge background |
| danger-600 | #DC2626 | Rejected, SLA breach, delete actions |
| danger-100 | #FEE2E2 | Danger badge background |
| info-600 | #0284C7 | Submitted status, informational |
| info-100 | #E0F2FE | Info badge background |

### Neutral
| Token | Hex | Usage |
|-------|-----|-------|
| white | #FFFFFF | Card backgrounds, main content area |
| gray-50 | #F9FAFB | Secondary backgrounds |
| gray-100 | #F3F4F6 | Tertiary backgrounds, dividers |
| gray-200 | #E5E7EB | Borders, separators |
| gray-300 | #D1D5DB | Input borders, disabled states |
| gray-400 | #9CA3AF | Placeholder text |
| gray-500 | #6B7280 | Secondary text |
| gray-700 | #374151 | Primary text |
| gray-900 | #111827 | Headings |

---

## 3. Typography

### Font Family
- **Primary:** "Inter" (headings, body text, UI labels)
- **Monospace:** "JetBrains Mono" (ticket numbers, code, IDs)

### Type Scale
| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| display | 30px | 700 | 1.2 | Portal selector titles |
| h1 | 24px | 600 | 1.3 | Page titles |
| h2 | 20px | 600 | 1.3 | Section headings |
| h3 | 16px | 600 | 1.4 | Card titles, table headers |
| body | 14px | 400 | 1.5 | Body text, descriptions |
| body-medium | 14px | 500 | 1.5 | Labels, emphasized body |
| small | 12px | 400 | 1.5 | Helper text, timestamps, captions |
| tiny | 11px | 500 | 1.4 | Badges, tags, overlines |
| mono | 13px | 500 | 1.5 | Ticket numbers (JetBrains Mono) |

---

## 4. Spacing System

Base unit: 4px

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, badge padding |
| sm | 8px | Compact internal spacing |
| md | 12px | Standard component padding |
| lg | 16px | Card padding, section gaps |
| xl | 24px | Content area padding |
| 2xl | 32px | Section separation |
| 3xl | 48px | Page-level spacing |

---

## 5. Border and Shadow

| Token | Value | Usage |
|-------|-------|-------|
| border-default | 1px solid #E5E7EB | Card borders, input borders |
| border-focus | 2px solid #3B82F6 | Focus rings |
| border-radius-sm | 6px | Badges, small buttons |
| border-radius-md | 8px | Buttons, inputs, cards |
| border-radius-lg | 12px | Large cards, modals |
| shadow-sm | 0 1px 2px rgba(0,0,0,0.05) | Cards, dropdowns |
| shadow-md | 0 4px 6px rgba(0,0,0,0.07) | Elevated cards, modals |
| shadow-lg | 0 10px 15px rgba(0,0,0,0.1) | Dialogs, popovers |

---

## 6. Component Specifications

### Buttons
| Variant | Background | Text | Border | Padding |
|---------|-----------|------|--------|---------|
| Primary | accent-600 | white | none | 10px 20px |
| Secondary | white | gray-700 | 1px gray-200 | 10px 20px |
| Danger | danger-600 | white | none | 10px 20px |
| Ghost | transparent | gray-500 | none | 10px 20px |

- Height: 36px (default), 32px (small), 40px (large)
- Border radius: 8px
- Font: 14px, weight 500
- Hover: darken background 10%
- Disabled: 50% opacity

### Cards
- Background: white
- Border: 1px solid gray-200
- Border radius: 12px
- Padding: 24px
- Shadow: shadow-sm
- Hover (if clickable): shadow-md, border-color gray-300

### Badges / Status Pills
| Status | Background | Text | Dot color |
|--------|-----------|------|-----------|
| Draft | warning-100 | warning-700 | warning-500 |
| Published | success-100 | success-700 | success-600 |
| Archived | gray-100 | gray-600 | gray-400 |
| Submitted | info-100 | info-700 | info-600 |
| In Review | warning-100 | warning-700 | warning-500 |
| Approved | success-100 | success-700 | success-600 |
| Rejected | danger-100 | danger-700 | danger-600 |
| Completed | success-100 | success-700 | success-600 |

- Height: 24px
- Padding: 4px 10px
- Border radius: 6px
- Font: 11px, weight 500
- Include a 6px colored dot before text

### Data Tables
- Header: gray-50 background, gray-500 text, 12px uppercase, weight 600
- Row: white background, hover gray-50
- Cell padding: 12px 16px
- Border: bottom 1px gray-100 between rows
- Text: 14px gray-700

### Inputs
- Height: 36px
- Border: 1px gray-300
- Border radius: 8px
- Padding: 8px 12px
- Focus: border accent-500, ring 2px accent-100
- Placeholder: gray-400
- Label: 14px weight 500, margin-bottom 6px

### Sidebar (Admin)
- Width: 240px
- Background: primary-900 (#0F172A)
- Text: white (active), gray-400 (inactive)
- Item padding: 10px 16px
- Active item: accent-600 background with rounded corners (6px)
- Hover: primary-800 background
- Logo area: 60px height, centered
- Section dividers: 1px primary-800

### Top Navigation (Requester)
- Height: 56px
- Background: white
- Border bottom: 1px gray-200
- Nav items: 14px gray-500, active accent-600 with bottom border accent-600
- Logo on left, user avatar on right

---

## 7. Iconography

Use Lucide React icons throughout. 

| Context | Size | Stroke width |
|---------|------|-------------|
| Navigation items | 20px | 1.5px |
| Button icons | 16px | 2px |
| Service card icons | 24px | 1.5px |
| Stat card icons | 20px | 1.5px |
| Inline text icons | 16px | 1.5px |

Service category icons:
- IT Support: `Monitor` or `Laptop`
- HR: `Users`
- Facilities: `Building`
- Finance: `Wallet`
- General: `FileText`

---

## 8. Page Layouts

### Portal Selector (/)
```
┌─────────────────────────────────────────────────┐
│                                                  │
│               [Tasheel Logo]                     │
│          Service Management Platform             │
│                                                  │
│    ┌──────────────┐    ┌──────────────┐         │
│    │   🛡️ Admin   │    │  👤 Requester │         │
│    │              │    │              │         │
│    │  Manage      │    │  Browse      │         │
│    │  services,   │    │  services,   │         │
│    │  workflows   │    │  submit      │         │
│    │  & forms     │    │  requests    │         │
│    │              │    │              │         │
│    │  [Enter →]   │    │  [Enter →]   │         │
│    └──────────────┘    └──────────────┘         │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Admin Dashboard (/admin)
```
┌────────┬──────────────────────────────────────────┐
│        │  Dashboard                                │
│ SIDE   │                                           │
│ BAR    │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│        │  │Total │ │Publi-│ │Draft │ │Total │    │
│ • Dash │  │Srvcs │ │shed  │ │      │ │Reqs  │    │
│ • Srvs │  │  7   │ │  5   │ │  2   │ │  42  │    │
│ • Work │  └──────┘ └──────┘ └──────┘ └──────┘    │
│        │                                           │
│        │  Recent Requests                          │
│        │  ┌────────────────────────────────────┐   │
│        │  │ Ticket   Service   Status   Date   │   │
│        │  │ TSH-042  Laptop   In Review  Apr 10│   │
│        │  │ TSH-041  VPN      Approved   Apr 9 │   │
│        │  │ TSH-040  Leave    Submitted  Apr 8 │   │
│        │  └────────────────────────────────────┘   │
│        │                                           │
│        │  [Create Service]  [View All Services]    │
└────────┴──────────────────────────────────────────┘
```

### Form Builder (/admin/services/[id]/form)
```
┌────────┬──────────────────────────────────────────┐
│        │  Form Builder — New Laptop Request        │
│ SIDE   │                                           │
│ BAR    │  ┌──────┐ ┌─────────────────┐ ┌───────┐  │
│        │  │FIELD │ │  FORM PREVIEW   │ │FIELD  │  │
│        │  │TYPES │ │                 │ │CONFIG │  │
│        │  │      │ │  [Employee Name]│ │       │  │
│        │  │ Aa   │ │  [Department]   │ │Label: │  │
│        │  │ ¶    │ │  [Laptop Type ▼]│ │[___]  │  │
│        │  │ #    │ │  [Justification]│ │       │  │
│        │  │ @    │ │  [Urgency ◉]    │ │Reqd:  │  │
│        │  │ ▼    │ │                 │ │[✓]    │  │
│        │  │ ◉    │ │  [+ Drop here]  │ │       │  │
│        │  │ ☑    │ │                 │ │Opts:  │  │
│        │  │ 📅   │ │                 │ │[___]  │  │
│        │  └──────┘ └─────────────────┘ └───────┘  │
│        │                                           │
│        │           [Save Form] [Preview]           │
└────────┴──────────────────────────────────────────┘
```

### Workflow Designer (/admin/services/[id]/workflow)
```
┌────────┬──────────────────────────────────────────┐
│        │  Workflow Designer — New Laptop Request    │
│ SIDE   │  [Save] [Undo] [Redo] [Zoom+] [Zoom-]    │
│ BAR    │                                           │
│        │  ┌────────────────────────────────────┐   │
│        │  │                                    │   │
│        │  │   ⚪ → [Submit] → [IT Review]      │   │
│        │  │                     ↓              │   │
│        │  │              [Manager Approval]     │   │
│        │  │                     ↓              │   │
│        │  │              [Procurement] → ⬤     │   │
│        │  │                                    │   │
│        │  │         bpmn-js canvas             │   │
│        │  │         (drag & drop)              │   │
│        │  │                                    │   │
│        │  └────────────────────────────────────┘   │
│        │                                           │
└────────┴──────────────────────────────────────────┘
```

### Requester Catalog (/requester)
```
┌──────────────────────────────────────────────────┐
│  [Logo]  Service Catalog   My Requests    [Avatar]│
├──────────────────────────────────────────────────┤
│                                                   │
│  Service Catalog                    [🔍 Search]   │
│  [All] [IT] [HR] [Facilities] [Finance]           │
│                                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │ 💻       │ │ 💻       │ │ 🔐       │         │
│  │ New      │ │ Software │ │ VPN      │         │
│  │ Laptop   │ │ Access   │ │ Access   │         │
│  │          │ │          │ │          │         │
│  │ IT • 4h  │ │ IT • 2h  │ │ IT • 1h  │         │
│  └──────────┘ └──────────┘ └──────────┘         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │ 👥       │ │ 👥       │ │ 🏢       │         │
│  │ Employee │ │ Leave    │ │ Meeting  │         │
│  │ Onboard  │ │ Request  │ │ Room     │         │
│  │          │ │          │ │          │         │
│  │ HR • 24h │ │ HR • 4h  │ │ Fac • 1h │         │
│  └──────────┘ └──────────┘ └──────────┘         │
│                                                   │
└──────────────────────────────────────────────────┘
```

### Request Detail with Workflow Tracker (/requester/requests/[id])
```
┌──────────────────────────────────────────────────┐
│  [Logo]  Service Catalog   My Requests    [Avatar]│
├──────────────────────────────────────────────────┤
│                                                   │
│  ← Back to My Requests                            │
│                                                   │
│  TSH-2026-0042              [In Review] badge     │
│  New Laptop Request                               │
│                                                   │
│  Workflow Progress                                 │
│  ✅──────✅──────🔵──────⚪──────⚪               │
│  Submit  IT Review  Manager  Procure  Delivered    │
│  Apr 10  Apr 11    Current                        │
│                                                   │
│  ┌─────────────────┐  ┌──────────────────────┐   │
│  │ Request Details  │  │  History              │   │
│  │                  │  │                       │   │
│  │ Employee: Ahmed  │  │  🔵 Apr 11 10:30am   │   │
│  │ Dept: Engineering│  │  IT team started      │   │
│  │ Type: MacBook Pro│  │  review               │   │
│  │ Urgency: High    │  │                       │   │
│  │                  │  │  ✅ Apr 10 2:15pm     │   │
│  │                  │  │  Request submitted    │   │
│  │                  │  │  by Ahmed Al-Rashid   │   │
│  └─────────────────┘  └──────────────────────┘   │
│                                                   │
└──────────────────────────────────────────────────┘
```

---

## 9. Figma MCP Prompt

Use this prompt with Figma MCP to generate the design system and initial screens:

```
Create a Figma design system and screens for "Tasheel" — an enterprise service management platform.

Design System:
- Create a color styles page with all colors from the specification (primary, accent, semantic, neutral)
- Create a typography page with all text styles (display through tiny)
- Create a components page with: buttons (4 variants x 3 sizes), badges (8 status variants), cards, inputs, tables, sidebar, top nav
- Use Inter font family throughout
- Use JetBrains Mono for ticket numbers and IDs

Screens to Design (1440x900 desktop):
1. Portal Selector — centered, two cards, clean and welcoming
2. Admin Dashboard — sidebar + 4 stat cards + recent requests table
3. Admin Service List — sidebar + data table with filters
4. Admin Service Create — sidebar + form
5. Admin Form Builder — sidebar + three-panel layout (palette | preview | config)
6. Admin Workflow Designer — sidebar + bpmn-js canvas with toolbar
7. Requester Service Catalog — top nav + category pills + card grid
8. Requester Request Form — top nav + service info + dynamic form
9. Requester My Requests — top nav + data table
10. Requester Request Detail — top nav + workflow tracker + details + history

Design Principles:
- White space is generous. Nothing feels cramped.
- Cards have subtle shadows and 1px borders
- Sidebar is dark (slate-900) with white text
- Main content area is always white
- Status badges use colored dots before text
- Tables have subtle row hover states
- The BPMN canvas area should show a light grid background
- The form builder uses visible drop zones with dashed borders
```

---

## 10. Animation and Interaction Notes

- Page transitions: fade in (200ms ease)
- Card hover: elevate shadow, slight border darken (150ms)
- Button click: scale(0.98) briefly (100ms)
- Badge: no animation, static
- Sidebar nav item: background color transition (150ms)
- Form builder drag: item follows cursor with slight rotation (3deg)
- Workflow tracker: completed stages animate in sequence on page load (staggered 150ms each)
- Toast notifications: slide in from top right, auto-dismiss after 4 seconds
- Modal/dialog: fade in background, scale in dialog (200ms)

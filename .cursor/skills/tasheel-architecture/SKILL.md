---
name: tasheel-architecture
description: Defines Tasheel system architecture, route map, key files, and data flow patterns. Use when planning features, changing store/types, or designing component hierarchies.
---

# Tasheel Architecture

## Tech Stack
Next.js 14 (App Router) + TypeScript + Tailwind CSS 3.4 + shadcn/ui + Zustand + bpmn-js + @dnd-kit + Lucide React + date-fns

## Data Flow
All data → Zustand store → localStorage persistence → Components read via selectors

## Route Map
/ → Portal selector
/admin → Dashboard (stats + recent requests)
/admin/services → Service list table
/admin/services/new → Create service
/admin/services/[id] → Edit service
/admin/services/[id]/form → Form builder
/admin/services/[id]/workflow → BPMN designer
/requester → Service catalog
/requester/services/[id] → Detail + request form
/requester/requests → My requests list
/requester/requests/[id] → Detail + workflow tracker

## Key Files
- lib/types.ts — All TypeScript interfaces
- lib/store.ts — Zustand store with all state and actions
- lib/mock-data.ts — 7 services, 10+ requests, 3+ workflows
- lib/utils.ts — cn(), formatDate(), generateTicketNumber(), getStatusColor()
- lib/bpmn-utils.ts — getDefaultWorkflowXml(), extractStagesFromXml()

## Default Workflow
1. Identify route and portal impact
2. Map data flow: source → transform → destination
3. Specify exact file changes
4. Confirm type and store impact
5. Define risk and rollback notes

## Validation Checklist
- [ ] No business logic leaked into UI-only components
- [ ] Shared state changes are in `lib/store.ts`
- [ ] New/updated contracts are in `lib/types.ts`
- [ ] File placement follows route/component conventions
- [ ] Design aligns with existing portal structure

# Tasheel Project Reference

## Product Summary
Tasheel is an enterprise service management platform with two portals:
- Admin portal for creating services, forms, and BPMN workflows
- Requester portal for browsing services, submitting requests, and tracking progress

## Core Tech Stack
- Next.js (App Router; see `tasheel/package.json` for current major)
- TypeScript (strict mode)
- Tailwind CSS + shadcn/ui
- Zustand with localStorage persistence
- `@xyflow/react` for workflow designer UI; BPMN reference assets may live under `tasheel/BPMN/`
- @dnd-kit for drag-and-drop form builder

## Repository Structure
- App routes: `tasheel/app/`
- Domain state/types: `tasheel/lib/`
- Admin components: `tasheel/components/admin/`
- Requester/shared components: `tasheel/components/requester/`, `tasheel/components/shared/`
- UI primitives: `tasheel/components/ui/`
- Team governance: `AGENTS.md`, `.cursor/rules/`, `.cursor/agents/`, `.cursor/skills/`

## Critical Engineering Constraints
- Prefer server components unless hooks/browser APIs are required
- No `any` typing in implementation code
- All shared app state goes through `tasheel/lib/store.ts`
- Use `@/` alias imports in Tasheel app code
- Do not modify shadcn primitives directly in `components/ui/`

## Delivery Workflow
- Always follow team sequence defined in `AGENTS.md`
- Multi-phase tasks must load `/.cursor/skills/team-operating-system/SKILL.md`
- Required quality gates before completion:
  - `npm run lint`
  - `npm run build`
  - Review/a11y/security/QA approvals

## Current Risk Hotspots
- BPMN stage extraction behavior and workflow/runtime alignment
- Form builder schema consistency and dynamic renderer validation
- Store persistence edge cases after schema changes
- Accessibility and RTL readiness for interactive admin tools
- Performance in heavy interaction surfaces (BPMN canvas, DnD lists)

## Notes for Orchestration
- Treat `.cursor/sprint/` artifacts as sprint source of truth
- Notion is a reporting mirror, never a hard gate
- Block on high-severity security findings and unresolved QA criticals

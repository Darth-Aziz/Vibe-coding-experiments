# Tasheel — Admin Portal PRD (Product Requirements)

This folder contains **product requirement documents** for the **Admin portal** of the Tasheel demo application (`tasheel/`), derived from the implemented Next.js app and Zustand store.

## Documents

| File | Contents |
|------|----------|
| [00-overview-and-scope.md](./00-overview-and-scope.md) | Vision, scope, personas, assumptions, non-goals, terminology |
| [01-shell-navigation.md](./01-shell-navigation.md) | Layout, sidebar, header, command palette, mobile nav, studio shell |
| [02-dashboard.md](./02-dashboard.md) | Dashboard KPIs, needs-attention strip, recent requests table |
| [03-services-and-studio.md](./03-services-and-studio.md) | Services list, service overview, 4-step studio, workflow designer entry |
| [04-workflows.md](./04-workflows.md) | Workflow template list, workflow detail (read-only inspector) |
| [05-requests-assignments.md](./05-requests-assignments.md) | Request list filters, queues, round-robin, detail & SLA |
| [06-categories-settings-data.md](./06-categories-settings-data.md) | Categories, settings, persistence, export/reset |

## How to use

- **Product / design**: Use as the source of truth for **what exists today** in the admin UI and **how it behaves** (including URL query contracts).
- **Engineering**: Treat gaps between PRD and ideal UX as **backlog** (see “Implementation notes” in each file where relevant).

## Source of truth

Implementation paths (high level):

- Routes: `tasheel/app/admin/**`
- Global admin shell: `tasheel/app/admin/layout.tsx`, `tasheel/components/shared/sidebar.tsx`, `tasheel/components/shared/header.tsx`, `tasheel/components/shared/command-palette.tsx`
- State: `tasheel/lib/store.ts` (Zustand + `persist`, storage key `tasheel-store`)
- Assignment queues: `tasheel/lib/assignment-queues.ts`
- Admin persona (demo user): `tasheel/lib/admin-persona.ts`

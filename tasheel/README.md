# Tasheel (تسهيل)

Enterprise **service management** demo: **Admin** portal (services, forms, workflows) and **Requester** portal (catalog, submissions, request tracking). Data is **mocked in-browser** via Zustand + `localStorage` persistence.

## Requirements

- Node.js 20+ recommended  
- npm (ships with Node)

## Setup

```bash
cd tasheel
npm install
npm run dev
```

App URL: **http://localhost:3000**

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Next.js dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint |

For CI-style checks locally:

```bash
npx eslint "app" "components" "lib" --max-warnings 0
```

## Project structure (high level)

- `app/admin/` — Admin routes (services, studio, workflow designer, requests)  
- `app/requester/` — Requester catalog, service form, my requests  
- `components/admin/` — Form builder, workflow designer, service studio steps  
- `components/shared/` — Shared UI (sidebar, status badges, request form fields)  
- `lib/store.ts` — Zustand store  
- `lib/types.ts` — TypeScript contracts  
- `lib/mock-data.ts` — Seed services, workflows, requests  

Design/reference bundles may appear under `service_LC/`, `desgin/`, or `BPMN/`; the **active app** is the Next.js tree above. `tsconfig.json` excludes `service_LC` from typechecking so `next build` stays clean.

## Documentation

- Repo root **`../README.md`** — monorepo overview  
- **`AGENTS.md`** (repo root) — agent team and skills map  
- **`01-architecture.md`**, **`02-cursor-prompts.md`** — additional context if present  

## License

Private / demo — add a `LICENSE` when redistributing.

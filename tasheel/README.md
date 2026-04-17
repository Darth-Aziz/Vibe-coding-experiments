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

Optional **local-only** reference trees **`design/`** and **`service_LC/`** (Vite/Figma exports) are **gitignored**; see **`REFERENCE.md`**. Curated notes live under **`BPMN/`**. The **active app** is the Next.js tree above. `tsconfig.json` excludes `design/` and `service_LC` from typechecking; ESLint ignores them too.

## Documentation

- Repo root **`../README.md`** — workspace overview  
- **`../docs/README.md`** — documentation index and maps  
- **`../AGENTS.md`** — agent team and skills map  
- **`01-architecture.md`**, **`02-cursor-prompts.md`**, **`03-figma-design-spec.md`**, **`04-github-setup.md`** — specs next to the app  

## License

Private / demo — add a `LICENSE` when redistributing.

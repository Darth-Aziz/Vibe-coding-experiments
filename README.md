# Vibe-coding-experiments

Personal workspace for **Tasheel (تسهيل)** and Cursor/agent automation. The **application** lives in **`tasheel/`**; everything else is docs, tooling, or reference.

**Suggested GitHub “About” description:**  
*Enterprise-style service management demo: Next.js admin + requester portals, Zustand, workflow designer (React Flow), service studio wizard.*

## Quick start

```bash
cd tasheel
npm install
npm run dev
```

Open **http://localhost:3000**. Switch between **Admin** and **Requester** from the UI.

```bash
npx eslint "app" "components" "lib" --max-warnings 0   # from tasheel/
npm run build
```

## Documentation

| Resource | Description |
|----------|-------------|
| **[`docs/README.md`](docs/README.md)** | Documentation index |
| **[`docs/repository-map.md`](docs/repository-map.md)** | Folder-by-folder map |
| **[`docs/contributing.md`](docs/contributing.md)** | Setup, branches, checks |
| **[`tasheel/docs/prd/`](tasheel/docs/prd/README.md)** | Admin portal PRD |
| **[`tasheel/README.md`](tasheel/README.md)** | App structure and scripts |
| **[`AGENTS.md`](AGENTS.md)** | Multi-agent roster and workflow |

## Repository layout (short)

| Path | Purpose |
|------|--------|
| **`tasheel/`** | Next.js app — Tasheel platform |
| **`docs/`** | Curated guides and maps |
| **`AGENTS.md`** | Agent team reference |
| **`.cursor/`** | Cursor rules, agents, skills, sprint artifacts ([`.cursor/README.md`](.cursor/README.md)) |
| **`.devcontainer/`** | Optional Codespaces / Dev Containers |

## Tech stack (Tasheel)

- Next.js (App Router), TypeScript (strict), Tailwind, shadcn/ui  
- Zustand with persistence for in-browser state  
- `@xyflow/react` for the workflow designer  
- `@dnd-kit` for form builder drag-and-drop  

Details: **`tasheel/README.md`**, **`tasheel/01-architecture.md`**.

## Branches

- **`staging`** — Main integration branch for active work (verify default on GitHub).
- **`main`** — Optional release mirror; may lag until you promote from `staging`.

## Git / GitHub

Use **SSH** or **HTTPS** with credentials that can push to your fork or `Darth-Aziz/Vibe-coding-experiments`. If you use an SSH host alias (e.g. `github.com-darth`), document it locally; do not commit secrets.

## License

Unless otherwise noted, treat as **private / all rights reserved**. Add a `LICENSE` file when you choose a public license.

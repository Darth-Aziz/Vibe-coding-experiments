# Vibe-coding-experiments

Personal workspace for **Tasheel (تسهيل)** and Cursor/agent automation experiments. The production-style app lives under **`tasheel/`**.

**Suggested GitHub “About” description (copy-paste):**  
*Enterprise-style service management demo: Next.js admin + requester portals, Zustand, BPMN-style workflows (React Flow), service studio wizard.*

## Repository layout

| Path | Purpose |
|------|--------|
| **`tasheel/`** | Next.js 16 app — Tasheel platform (admin catalog, service studio, workflows, requester catalog & requests). |
| **`AGENTS.md`** | Tasheel multi-agent roster and workflow (reference for contributors). |
| **`.cursor/`** | Cursor rules, agent definitions, sprint artifacts — keeps AI-assisted work consistent with the project. |

## Quick start (Tasheel app)

```bash
cd tasheel
npm install
npm run dev
```

Open **http://localhost:3000**. Use the UI to switch between **Admin** and **Requester** portals.

```bash
npm run lint    # ESLint (scope: app, components, lib — see tasheel/package.json)
npm run build   # Production build
```

## Branches

- **`staging`** — Integration branch with the full `tasheel/` tree and docs (default for active work).
- **`commit-changes`** — Legacy local branch (optional).

## Tech stack (Tasheel)

- Next.js (App Router), TypeScript, Tailwind, shadcn/ui  
- Zustand (persisted) for app state  
- `@xyflow/react` for workflow designer  
- `bpmn-js` / BPMN assets where applicable  

Details: **`tasheel/README.md`** and **`tasheel/01-architecture.md`** (if present).

## Git / GitHub

- Remote: `git@github.com-darth:Darth-Aziz/Vibe-coding-experiments.git` (SSH host alias; see your `~/.ssh/config`).
- Deploy keys or account SSH keys must have **push** access to update this repo.

## License

Unless otherwise noted in subfolders, treat as **private / all rights reserved** by the repository owner. Add a `LICENSE` file when you choose a public license.

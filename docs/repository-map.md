# Repository map

## Root (`Vibe-coding-experiments/`)

| Path | Role |
|------|------|
| **`tasheel/`** | The **Tasheel** Next.js application (only deployable app in this repo). |
| **`docs/`** | Curated documentation index and guides (this folder). |
| **`AGENTS.md`** | Multi-agent roster, skills matrix, orchestration pointers. |
| **`README.md`** | Repo entry point: quick start, stack summary, links. |
| **`CONTRIBUTING.md`** | Short pointer to `docs/contributing.md`. |
| **`.devcontainer/`** | Optional GitHub Codespaces / Dev Containers config. |
| **`.cursor/`** | Cursor rules, agent prompts, skills, sprint artifacts — see [`.cursor/README.md`](../.cursor/README.md). |
| **`.tmp-awesome-cursor-skills/`** | Local scratch from skill installs — **not** part of the product; ignored by git when listed in root `.gitignore`. |

## Tasheel app (`tasheel/`)

| Path | Role |
|------|------|
| **`app/`** | Next.js App Router: `admin/`, `requester/`, shared layouts. |
| **`components/`** | React UI: `admin/`, `shared/`, `ui/` (shadcn). |
| **`lib/`** | `store.ts`, `types.ts`, `mock-data.ts`, utilities. |
| **`public/`** | Static assets. |
| **`BPMN/`** | BPMN-related reference or assets (not always imported by the app). |
| **`design/`** | (Optional, local) Legacy Figma/Vite exports — **gitignored**; see [`tasheel/REFERENCE.md`](../tasheel/REFERENCE.md). |
| **`service_LC/`** | (Optional, local) Same — **gitignored**; excluded from TypeScript and ESLint. |

## Numbered docs in `tasheel/`

Files **`01-architecture.md`** through **`04-github-setup.md`** are the primary written specs next to the code. Prefer updating them when behavior or workflow changes materially.

## Mental model

- **Product code** = `tasheel/app`, `tasheel/components`, `tasheel/lib`, `tasheel/public`.
- **Governance / AI** = `.cursor/`, root `AGENTS.md`.
- **Reference & design** = optional local `tasheel/design`, `tasheel/service_LC` (see `tasheel/REFERENCE.md`), `tasheel/BPMN`, numbered `*.md` in `tasheel/`.

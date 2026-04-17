# Contributing

## Prerequisites

- **Node.js 20+** (see `tasheel/package.json` engines if specified).
- **npm** (default package manager for Tasheel).

## Local setup

```bash
cd tasheel
npm install
npm run dev
```

Open **http://localhost:3000**.

## Quality checks (before pushing)

From **`tasheel/`**:

```bash
npx eslint "app" "components" "lib" --max-warnings 0
npm run build
```

`npm run lint` in this project may delegate to ESLint; use the command above if you need a CI-like scope.

## Branches

- **`staging`** — Default integration branch for active work (confirm on GitHub which branch is default).
- Other branches — Use short-lived feature branches off `staging` when collaborating.

## Where things live

- **Types & state** — `tasheel/lib/types.ts`, `tasheel/lib/store.ts`
- **Mock data** — `tasheel/lib/mock-data.ts`
- **Architecture** — `tasheel/01-architecture.md`, `.cursor/skills/tasheel-architecture/SKILL.md`
- **Design system** — `.cursor/skills/tasheel-design-system/SKILL.md`, `tasheel/03-figma-design-spec.md`

## Design exports and specs

- **`tasheel/design/`** — Design package exports; kept out of the TypeScript program via `tsconfig` `exclude`.
- **`tasheel/service_LC/`** — Lifecycle and implementation specs; also excluded from `tsc` for build hygiene.

Do not import these trees into runtime app code unless you intentionally promote files into `lib/` or `components/`.

## Cursor / agents

If you use Cursor with this repo, read **`AGENTS.md`** and, for multi-step delivery, **`.cursor/skills/team-operating-system/SKILL.md`**.

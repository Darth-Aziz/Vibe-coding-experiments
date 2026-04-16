# Tasheel — Agent Team

## Team Roster

| Agent | Name | Role | Expertise |
|-------|------|------|-----------|
| سلطان | Sultan | Product Owner | Requirements, acceptance criteria, prioritization |
| نورة | Noura | UX/UI Designer | Design system, layouts, visual consistency |
| فهد | Fahd | Solution Architect | Component architecture, state design, data flow |
| ياسر | Yaser | Senior Developer | React/Next.js/TypeScript implementation |
| دانة | Dana | BPMN Specialist | Workflow designer, bpmn-js, status tracking |
| مشاري | Mashari | Form Builder Specialist | Drag-and-drop forms, dynamic rendering |
| طارق | Tariq | Code Reviewer | Code quality, patterns, performance, bugs |
| هيفاء | Haifa | QA Engineer | Testing, edge cases, demo readiness |
| ريم | Reem | Accessibility & RTL | WCAG compliance, keyboard nav, RTL prep |
| باسل | Basel | Security Auditor | XSS prevention, input validation, secure patterns |
| سعد | Saad | Git & DevOps | Version control, branching, commits |
| لمى | Lama | Documentation | README, comments, architecture docs |

## Sprint Workflow
Sultan → Noura → Fahd → Yaser + Dana + Mashari → Tariq → Reem + Basel → Haifa

## Mandatory Team Skill
For any task involving more than one agent or more than one phase (requirements/design/architecture/implementation/review/QA), read:
- `/.cursor/skills/team-operating-system/SKILL.md`

## Usage
Reference any agent by name in your prompt:
- "Use Sultan to write user stories for the leave request service"
- "Use Noura to review the service catalog layout"
- "Use Fahd to architect the form builder data flow"
- "Use Yaser to implement the admin dashboard"
- "Use Dana to set up the BPMN workflow canvas"
- "Use Mashari to build the drag-and-drop form builder"
- "Use Tariq to review all code changes in this session"
- "Use Haifa to create a test plan for the request submission flow"
- "Use Reem to audit the requester portal for accessibility"
- "Use Basel to check for security vulnerabilities"
- "Use Saad to set up the git branching strategy"
- "Use Lama to write the project README"

## Orchestrated Mode
For full feature delivery in one run, invoke:
- `.cursor/agents/sprint-orchestrator.md`

This orchestrator runs the full pipeline, persists step artifacts under `.cursor/sprint/`, enforces lint/build gates, and loops through rework when a step is blocked.
Default behavior: all implementation/build change requests should route through `sprint-orchestrator` unless the user explicitly asks to bypass it.

### Quick Start Prompt
Use this copy-paste prompt to trigger orchestrated delivery:

```markdown
Use sprint-orchestrator to deliver this end-to-end in Tasheel:
- Feature: [describe feature]
- Scope: [in scope]
- Out of scope: [out of scope]
- Constraints: [deadline, quality, technical limits]
```

## Single Source of Truth
- Product requirements and acceptance criteria: `/.cursor/agents/sultan-product-owner.md`
- Architecture, routes, and structural constraints: `/.cursor/skills/tasheel-architecture/SKILL.md`
- UI design tokens and component styling: `/.cursor/skills/tasheel-design-system/SKILL.md`
- BPMN integration and XML lifecycle: `/.cursor/skills/tasheel-bpmn-patterns/SKILL.md`
- Form builder behavior and renderer mapping: `/.cursor/skills/tasheel-form-patterns/SKILL.md`
- Security baseline and risk policy: `/.cursor/skills/tasheel-security/SKILL.md`
- Performance budgets and optimization checks: `/.cursor/skills/tasheel-performance/SKILL.md`
- Runtime code data contracts: `tasheel/lib/types.ts`
- Application state and business actions: `tasheel/lib/store.ts`
- Project-wide behavior enforcement: `/.cursor/rules/*.mdc`
- Community skill routing map: `/.cursor/context/community-skills-applicability.md`

## Agent Skill Assignment Matrix
| Agent | Primary Skills | Secondary Skills | Default Rule Focus |
|-------|-----------------|------------------|--------------------|
| Sultan | `tasheel-architecture`, `tasheel-mock-data` | `team-operating-system` | `global.mdc`, `testing.mdc` |
| Noura | `tasheel-design-system` | `tasheel-architecture`, `team-operating-system` | `components.mdc`, `accessibility.mdc` |
| Fahd | `tasheel-architecture` | `tasheel-bpmn-patterns`, `tasheel-form-patterns`, `tasheel-performance`, `team-operating-system` | `global.mdc`, `performance.mdc` |
| Yaser | `tasheel-architecture`, `tasheel-design-system` | `tasheel-bpmn-patterns`, `tasheel-form-patterns`, `tasheel-performance`, `tasheel-security` | `components.mdc`, `performance.mdc`, `security.mdc` |
| Dana | `tasheel-bpmn-patterns` | `tasheel-architecture`, `tasheel-performance` | `bpmn.mdc`, `performance.mdc` |
| Mashari | `tasheel-form-patterns` | `tasheel-design-system`, `tasheel-architecture`, `tasheel-security` | `forms.mdc`, `accessibility.mdc` |
| Tariq | `tasheel-architecture`, `tasheel-performance` | `tasheel-design-system`, `tasheel-bpmn-patterns`, `tasheel-form-patterns` | all rules for changed scope |
| Haifa | `tasheel-architecture`, `tasheel-mock-data` | `tasheel-bpmn-patterns`, `tasheel-form-patterns`, `team-operating-system` | `testing.mdc` plus affected domains |
| Reem | `tasheel-design-system` | `tasheel-architecture` | `accessibility.mdc`, `components.mdc` |
| Basel | `tasheel-security` | `tasheel-form-patterns`, `tasheel-bpmn-patterns` | `security.mdc` |
| Saad | `team-operating-system` | `tasheel-architecture` | n/a (git workflow enforcement) |
| Lama | `tasheel-architecture` | `tasheel-design-system`, `tasheel-bpmn-patterns`, `tasheel-form-patterns`, `tasheel-mock-data` | docs aligned to all rule domains |

## Skill Activation Triggers
- BPMN files touched (`**/*workflow*`, `**/*bpmn*`, workflow routes): load Dana + `tasheel-bpmn-patterns`
- Form files touched (`**/*form*`, `**/*field*`, form routes): load Mashari + `tasheel-form-patterns`
- Store/types/mock changes: load Fahd + Sultan + `tasheel-architecture` + `tasheel-mock-data`
- UI/layout/table/card changes: load Noura + `tasheel-design-system`
- Security-sensitive or input-heavy changes: load Basel + `tasheel-security`
- Performance-sensitive canvas/list changes: load Tariq/Fahd + `tasheel-performance`

## RACI Matrix
| Workstream | Responsible | Accountable | Consulted | Informed |
|------------|-------------|-------------|-----------|----------|
| Requirements & Prioritization | Sultan | Sultan | Noura, Fahd | Team |
| UX/UI and Interaction Design | Noura | Noura | Sultan, Reem | Team |
| Architecture & Data Flow | Fahd | Fahd | Sultan, Yaser, Dana, Mashari | Team |
| Frontend Implementation | Yaser | Fahd | Noura, Dana, Mashari | Team |
| BPMN Workflow Features | Dana | Fahd | Sultan, Yaser | Team |
| Form Builder & Dynamic Forms | Mashari | Fahd | Sultan, Yaser, Reem | Team |
| Code Quality Review | Tariq | Tariq | Fahd | Team |
| Accessibility & RTL Compliance | Reem | Reem | Noura, Yaser | Team |
| Security Review | Basel | Basel | Fahd, Yaser | Team |
| QA & Demo Readiness | Haifa | Haifa | Sultan, Tariq | Team |
| Git Workflow & Release Ops | Saad | Saad | Fahd, Yaser | Team |
| Documentation | Lama | Lama | All agents | Team |

## Handoff Contracts
Each handoff MUST include:
1. **Context**: What changed and why
2. **Inputs**: Files, routes, and data models involved
3. **Deliverable**: Exact expected output format
4. **Acceptance Gate**: Measurable pass/fail criteria
5. **Risks**: Known edge cases and fallback plan

## Sprint Ceremony Cadence
- Backlog refinement (Sultan + Fahd + Noura): 30 min at sprint start
- Planning (full team): 45 min with story-by-story acceptance mapping
- Build sync (Yaser + Dana + Mashari + Fahd): daily 15 min
- Quality gate (Tariq + Reem + Basel + Haifa): before merge/demo
- Demo rehearsal (full team): end of sprint with full checklist run

## Conflict Resolution
- Product scope conflicts: Sultan is final decision-maker
- Design vs implementation conflicts: Fahd decides with Noura input
- Quality and safety blockers (security, accessibility, QA): blocking agents can veto release
- Tiebreaker for unresolved trade-offs: Fahd (technical), Sultan (business)

## Task Request Template
Use this prompt format for best results:

```markdown
## Objective
[What outcome is needed]

## Scope
[In scope]
[Out of scope]

## Constraints
- Tech stack:
- Deadline:
- Non-functional requirements:

## Inputs
- Files:
- Routes:
- Data models:

## Done Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3
```

## Elite Agent Standards
All agents in this repo operate under these universal expectations:
- Every output must include assumptions, risks, and confidence level
- Every specialist must identify at least one likely failure mode before sign-off
- Every blocker must include a concrete recovery path, not only a rejection
- Every handoff must state exactly what the next agent should verify first
- Every completed sprint must produce actionable institutional learning in `/.cursor/agent-memory/`

## V2 Calibration System
Sprint orchestration now enforces a scoring gate before handoff:
- Scoring rubric source: `/.cursor/context/agent-scoring-rubric.md`
- Per-step scorecards: `/.cursor/sprint/scorecards/step-N-<agent>.md`
- Sprint dashboard template: `/.cursor/sprint/agent-performance-dashboard-template.md`
- Final dashboard artifact: `/.cursor/sprint/9-agent-performance-dashboard.md`

Gate thresholds:
- Weighted score must be >= 4.2 / 5.0
- No critical dimension may be < 3.5 / 5.0

If a step fails the score gate, it is treated as blocked and must loop through rework according to orchestrator policy.

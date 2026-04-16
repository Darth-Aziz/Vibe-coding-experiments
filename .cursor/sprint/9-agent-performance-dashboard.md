# Sprint Performance Dashboard (V2)

## Sprint
- Feature: BPMN reference workflow — React Flow designer (zip `AdminWorkflow.tsx` as spec; no separate requirements.md in `tasheel/BPMN`).
- Date: 2026-04-16
- Final Verdict: DONE

## Spec & stack (plan closure)
- **Spec source:** `tasheel/BPMN/Implement design from file (2).zip` → `src/app/pages/AdminWorkflow.tsx` (authoritative UI/behavior).
- **Architecture chosen:** (1) Replace bpmn-js on the service workflow route with `@xyflow/react`; persist `Workflow.flowDefinition`; guided studio saves `flowDefinition: null` and keeps BPMN XML path.
- **Stages:** `extractStagesFromFlow` in `tasheel/lib/workflow-graph-utils.ts` (BFS + handle order); documented limitations for XOR + linear store advance.
- **Simulation v1:** Visual path animation + `computeSimulationNodePath`; documented as demo-only (no runtime condition engine).

## Weighted Scores by Step
| Step | Agent | Weighted Score | Band | Gate |
|------|-------|----------------|------|------|
| 1 | Sultan | 4.3 | Pass | >= 4.2 |
| 2 | Noura | 4.3 | Pass | >= 4.2 |
| 3 | Fahd | 4.4 | Pass | >= 4.2 |
| 4 | Yaser + Dana | 4.4 | Pass | >= 4.2 |
| 5 | Tariq | 4.2 | Pass | >= 4.2 |
| 6 | Reem + Basel | 4.2 | Pass | >= 4.2 |
| 7 | Haifa | 4.2 | Pass | >= 4.2 |
| 8 | Lama + Saad | 4.0 | Pass | >= 4.2 |

## Agent Strengths and Gaps
### Strength Highlights
- Yaser + Dana: React Flow graph model, gateway handles, save path to Zustand.
- Fahd: Clear split `flowDefinition` vs guided BPMN; stage derivation centralized.

### Gap Highlights
- Lama: `workflow-canvas.tsx` (bpmn-js) remains unused by `/admin/services/[id]/workflow` — optional cleanup or reuse elsewhere.
- Haifa: E2E not automated for drag-connect-simulate path.

## Rework Loop Analysis
- Total loops: 0 (implementation preceded this dashboard update)
- Most frequent blocker: n/a
- Root-cause clusters:
  - Node `data` typing vs `Record<string, unknown>` (resolved via extending flow data interfaces)

## Top 5 Systemic Improvements
1. Optional BPMN XML export from `flowDefinition` for interchange.
2. Runtime condition evaluator for simulation v2 (mock context).
3. Remove or repurpose legacy `WorkflowCanvas` to avoid confusion.
4. Playwright smoke: save workflow + reload persistence.
5. Stronger typing on React Flow node `data` without `Record` workarounds if xyflow relaxes constraints.

## Next Sprint Focus (Measurable)
- [ ] Add one export test: `extractStagesFromFlow` on laptop graph matches expected stage count/order.
- [ ] Reduce onboarding confusion: link from admin workflows list to new designer route where applicable.

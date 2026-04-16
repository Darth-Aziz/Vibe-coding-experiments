# Dana Memory Log

Use this file to append dated learnings from completed sprints.

## Entry Template
```markdown
## YYYY-MM-DD - [Sprint/Feature]
- Context:
- Learning:
- Action for next sprint:
- Affected area:
```

## 2026-04-16 - React Flow workflow designer (BPMN zip reference)
- Context: Service workflow route now uses `@xyflow/react` with XOR gateway handles and `flowDefinition` persistence; guided studio still emits BPMN XML with `flowDefinition` cleared.
- Learning: Simulation path selection uses topology (top/bottom labels), not evaluated conditions—documented in `workflow-graph-utils` and designer.
- Action for next sprint: Optional BPMN export from graph if product needs interchange.
- Affected area: `tasheel/lib/workflow-graph-utils.ts`, `workflow-flow-designer.tsx`, `app/admin/services/[id]/workflow/page.tsx`.

# Yaser Memory Log

Use this file to append dated learnings from completed sprints.

## Entry Template
```markdown
## YYYY-MM-DD - [Sprint/Feature]
- Context:
- Learning:
- Action for next sprint:
- Affected area:
```

## 2026-04-16 - React Flow workflow designer
- Context: Replaced bpmn-js on `/admin/services/[id]/workflow` with `WorkflowFlowDesigner`; node `data` extends `Record<string, unknown>` for xyflow typing.
- Learning: `useReactFlow().screenToFlowPosition` for palette drop coordinates inside `ReactFlowProvider`.
- Action for next sprint: Tree-shake or document unused `workflow-canvas.tsx`.
- Affected area: `components/admin/workflow-flow-designer.tsx`, `workflow-flow-nodes.tsx`.

---
name: tasheel-bpmn-patterns
description: Guides BPMN modeler integration, XML lifecycle handling, and workflow-stage extraction. Use when building or modifying workflow designer and request stage tracking features.
---

# Tasheel BPMN Patterns

## Packages
bpmn-js ^17.x, bpmn-js-properties-panel ^5.x, @bpmn-io/properties-panel ^3.x, camunda-bpmn-moddle ^7.x

## CSS (must import)
bpmn-js/dist/assets/diagram-js.css
bpmn-js/dist/assets/bpmn-js.css
bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css

## Modeler Lifecycle
1. Create in useEffect with container ref
2. Import XML
3. Provide save handler (export XML)
4. Destroy in cleanup

## Stage Extraction
Parse BPMN XML → Find bpmn:UserTask elements → Order by sequence flow → Return WorkflowStage[]

## Default Template
Start Event → Submit Request → Review → Approve → End Event

## Default Workflow
1. Initialize modeler in `useEffect` with container ref
2. Import existing XML or default template
3. Save via modeler API and persist XML
4. Extract stages from XML and update workflow model
5. Destroy modeler instance on cleanup

## Validation Checklist
- [ ] All required BPMN CSS imports exist
- [ ] Modeler cleanup is present and tested
- [ ] XML is stored raw (not manually reconstructed)
- [ ] Stage extraction handles missing names and empty flows
- [ ] Tracker behavior matches stage order

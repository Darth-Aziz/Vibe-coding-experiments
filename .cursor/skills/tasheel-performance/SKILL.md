---
name: tasheel-performance
description: Defines Tasheel frontend performance budgets and optimization checks for Zustand selectors, heavy canvas components, list rendering, and lifecycle cleanup. Use when changing store subscriptions, BPMN canvas, form builder drag interactions, or large UI lists.
---

# Tasheel Performance Patterns

## Scope
Performance practices for App Router pages, shared state subscriptions, and interaction-heavy admin screens.

## Core Budgets
- Keep route interactions responsive and avoid obvious render jank
- Avoid unnecessary full-tree re-renders from broad store subscriptions
- Ensure heavy components (BPMN canvas, drag-and-drop lists) clean up correctly

## Default Workflow
1. Inspect changed components for unnecessary re-renders
2. Verify Zustand selectors are scoped to required slices only
3. Validate no expensive synchronous work runs in render paths
4. Confirm cleanup for listeners/timers/modeler instances
5. Report optimization opportunities with impact level

## Validation Checklist
- [ ] Uses `useTasheelStore(s => s.<slice>)` instead of whole-store subscription
- [ ] No repeated expensive formatting/parsing inside tight render loops
- [ ] Modeler and drag listeners are destroyed on unmount
- [ ] Large list/table views include pagination or efficient rendering strategy
- [ ] Performance findings include impact + recommended fix

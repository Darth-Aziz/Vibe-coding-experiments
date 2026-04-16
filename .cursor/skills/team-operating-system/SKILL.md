---
name: team-operating-system
description: Enforces Tasheel multi-agent delivery workflow with handoff contracts, blocking criteria, and quality gates. Use when coordinating multiple agents, running sprint tasks, or preparing demo-ready delivery.
---

# Tasheel Team Operating System

## Purpose
Coordinate the Tasheel agent squad with predictable handoffs, measurable gates, and clear ownership.

## When To Use
- Multi-step tasks spanning requirements, design, architecture, implementation, and QA
- Sprint planning and backlog refinement
- Demo preparation and readiness certification
- Any request that requires more than one specialist agent

## Who Should Load This
- Always: Sultan (planning), Fahd (technical orchestration), Haifa (final gate)
- Also load for any other agent when a task crosses more than one delivery phase
- Pair with `AGENTS.md` for role assignment and RACI alignment

## Mandatory Workflow
1. **Sultan** defines the user story and acceptance criteria.
2. **Noura** defines UI behavior and visual constraints.
3. **Fahd** finalizes data flow, component tree, and file plan.
4. **Yaser / Dana / Mashari** implement according to scope.
5. **Tariq** performs blocking code review.
6. **Reem + Basel** run accessibility and security audits.
7. **Haifa** validates full test plan and demo readiness.
8. **Lama** updates documentation if behavior changed.
9. **Saad** ensures branch and commit hygiene.

## Handoff Template
```markdown
## Handoff
From: [Agent]
To: [Agent]

### Context
[What changed and why]

### Inputs
- Files:
- Routes:
- Data models:

### Deliverable Expected
[Exact format and scope]

### Acceptance Gate
- [ ] Gate 1
- [ ] Gate 2

### Risks and Fallback
- Risk:
- Fallback:
```

## Blocking Criteria
Any of the following blocks progression:
- Missing acceptance criteria
- Undefined data model impact
- Failing accessibility or security criticals
- Unresolved major QA failures
- Incomplete or ambiguous handoff package

## Completion Criteria
Task is done only when:
1. Acceptance criteria are met
2. Quality gates pass (review, security, accessibility, QA)
3. Required documentation is updated
4. Git status is clean and commit-ready

## V2 Calibration Add-On
When sprint orchestration is active, enforce scoring gates:
- Use `/.cursor/context/agent-scoring-rubric.md`
- Save per-step scorecards to `/.cursor/sprint/scorecards/`
- Block handoff if weighted score < 4.2 or critical dimension < 3.5
- Publish final dashboard in `/.cursor/sprint/9-agent-performance-dashboard.md`

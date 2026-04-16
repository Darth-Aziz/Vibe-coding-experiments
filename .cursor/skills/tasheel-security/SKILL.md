---
name: tasheel-security
description: Provides Tasheel frontend security review patterns including input constraints, XSS defenses, localStorage safety, and BPMN/XML risk checks. Use when handling user input, dynamic rendering, dependencies, or release security sign-off.
---

# Tasheel Security Patterns

## Scope
Frontend security posture for the Tasheel demo codebase with enterprise-grade reference practices.

## Primary Concerns
- XSS prevention for dynamic labels, form values, and rendered metadata
- Safe input handling and max-length validation
- localStorage content safety and data minimization
- BPMN XML handling without executable interpretation
- Dependency hygiene and secret exposure checks

## Default Workflow
1. Identify user-controlled inputs and where they are rendered
2. Validate constraints (required, length, format) before state persistence
3. Verify no unsafe rendering APIs are introduced
4. Review storage and logs for sensitive or secret content
5. Produce severity-rated findings with concrete remediation

## Blocking Policy
- Block release on exploitable high-severity findings (e.g., clear XSS or secret leakage)
- Medium/Low findings are tracked with remediation guidance and owner

## Validation Checklist
- [ ] No `dangerouslySetInnerHTML` without explicit sanitization rationale
- [ ] Input fields define sensible max-length/format constraints
- [ ] No secrets/tokens/credentials in code, mock data, or docs
- [ ] BPMN/XML processing does not execute arbitrary scripts
- [ ] Security output includes severity + attack vector + remediation

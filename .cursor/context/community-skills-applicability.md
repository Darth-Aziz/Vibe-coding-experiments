# Community Skills Applicability - Tasheel

This file maps installed community skills to the Tasheel stack so agents can prioritize the right ones.

## Applicability Tiers

### Tier 1 (Default for most implementation sprints)
- `grinding-until-pass`
- `visual-qa-testing`
- `verifying-in-browser`
- `monitoring-terminal-errors`
- `tailing-build-output`
- `responsive-testing`
- `dark-mode-testing`
- `accessibility-auditing`
- `form-testing`
- `auto-type-checking`
- `reviewing-code`
- `auditing-security`
- `auditing-performance`
- `systematic-debugging`
- `writing-tests`
- `adding-e2e-tests`
- `creating-pr`
- `writing-commit-messages`
- `using-ui-stack`
- `verifying-markdown-formatting`

### Tier 2 (Use when context triggers)
- `best-of-n-solving` (hard implementation trade-offs)
- `parallel-exploring` (large code discovery tasks)
- `codebase-onboarding` (new contributors / architecture docs)
- `parallel-test-fixing` (multiple failing tests)
- `comparing-branches-visually` (UI regressions)
- `screenshotting-changelog` (release/PR visuals)
- `fixing-broken-links` (docs QA)
- `updating-npm-package` (dependency upgrades)
- `adding-error-tracking` (Sentry integration)
- `adding-feature-flags` (controlled rollouts)
- `adding-auth` (Auth.js path)
- `adding-api-docs` (OpenAPI docs expansion)
- `adding-analytics` (PostHog instrumentation)
- `adding-docker` (containerization)
- `setting-up-ci` (pipeline hardening)
- `architecture-decision-records` (decision traceability)
- `api-smoke-testing` (route-level verification)

### Tier 3 (Rare / currently low-fit for this repo)
- `database-design` (when backend/data model is introduced)
- `setting-up-terraform` (infrastructure IaC work only)
- `kubernetes-deploying` (k8s deployment only)
- `react-native-patterns` (mobile-only track)
- `python-tdd-with-uv` (python-only track)
- `switching-projects` (multi-workspace operations only)
- `writing-copy` (marketing copy workflows)
- `seo-auditing` (SEO-focused initiatives)
- `exporting-to-png` (artifact export use case)
- `incident-response` (production incident mode)

## Routing Guidance
- Always start with Tier 1 defaults for feature implementation.
- Add Tier 2 skills only when explicit triggers appear in requirements or artifacts.
- Do not auto-load Tier 3 unless user intent clearly matches.

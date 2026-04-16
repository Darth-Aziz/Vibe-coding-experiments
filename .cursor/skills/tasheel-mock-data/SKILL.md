---
name: tasheel-mock-data
description: Defines Tasheel mock entities, ID patterns, and date conventions. Use when creating or updating seed data for services, workflows, requests, and demo users.
---

# Tasheel Mock Data Conventions

## Services (7 pre-built)
1. New Laptop Request (IT) — 5 form fields, 5-stage workflow
2. Software Access Request (IT) — 3 fields, 3-stage workflow
3. VPN Access Request (IT) — 3 fields, 3-stage workflow
4. Employee Onboarding (HR) — 5 fields, 5-stage workflow
5. Leave Request (HR) — 4 fields, 4-stage workflow
6. Meeting Room Booking (Facilities) — 5 fields, 3-stage workflow
7. Maintenance Request (Facilities) — 4 fields, 4-stage workflow

## Requests (10+ pre-built)
Spread across services, various statuses: submitted, in_review, approved, rejected, completed

## Users
- Admin: Sarah Mitchell (sarah@tasheel.com)
- Requester: Ahmed Al-Rashid (ahmed@company.com)
- Approvers: Mohammed Hassan, Layla Ahmad, Omar Khalid

## ID Patterns
- Service IDs: svc_[nanoid]
- Workflow IDs: wf_[nanoid]
- Request IDs: req_[nanoid]
- Field IDs: fld_[nanoid]
- Ticket numbers: TSH-2026-NNNN (sequential)

## Dates
Use date-fns. Display format: "Apr 15, 2026". Store as ISO strings.

## Default Workflow
1. Identify impacted entity types (service, workflow, request, user)
2. Generate IDs using approved prefixes and conventions
3. Ensure status and workflow stage data are internally consistent
4. Validate date format and ticket number patterns
5. Confirm data remains demo-safe and non-sensitive

## Validation Checklist
- [ ] IDs follow prefix conventions exactly
- [ ] Ticket format matches `TSH-2026-NNNN`
- [ ] Status values map to supported UI badges
- [ ] Dates are valid ISO strings and display correctly
- [ ] No realistic sensitive personal data included

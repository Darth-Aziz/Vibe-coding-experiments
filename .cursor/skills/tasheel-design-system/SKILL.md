---
name: tasheel-design-system
description: Provides Tasheel visual tokens, component styling standards, and UI consistency checks. Use when designing or implementing layouts, cards, tables, forms, badges, or status UI.
---

# Tasheel Design System

## Colors
| Token | Tailwind | Hex | Usage |
|-------|----------|-----|-------|
| Primary | slate-900 | #0F172A | Sidebar bg, headings |
| Primary Light | slate-50 | #F8FAFC | Page backgrounds |
| Accent | blue-600 | #2563EB | Buttons, links, active |
| Accent Light | blue-100 | #DBEAFE | Selected states |
| Success | emerald-600 | #059669 | Published, approved |
| Success Light | emerald-100 | #D1FAE5 | Success badges |
| Warning | amber-500 | #F59E0B | Draft, pending |
| Warning Light | amber-100 | #FEF3C7 | Warning badges |
| Danger | red-600 | #DC2626 | Rejected, delete |
| Danger Light | red-100 | #FEE2E2 | Danger badges |
| Border | slate-200 | #E5E7EB | All borders |
| Text Primary | slate-900 | #0F172A | Headings |
| Text Secondary | slate-500 | #64748B | Body, descriptions |
| Text Muted | slate-400 | #94A3B8 | Placeholders |

## Typography
- Headings: font-semibold
- Body: text-sm (14px)
- Small: text-xs (12px)
- Mono: font-mono text-sm (ticket numbers)

## Spacing
- Card padding: p-6
- Section gap: space-y-6
- Component gap: gap-4
- Page padding: px-6 py-8

## Component Tokens
- Card: border rounded-lg shadow-sm
- Button heights: h-8 (sm), h-9 (default), h-10 (lg)
- Input height: h-9
- Badge: rounded-md px-2.5 py-0.5 text-xs font-medium
- Table row hover: hover:bg-slate-50
- Sidebar item: px-3 py-2 rounded-md
- Sidebar active: bg-blue-600 text-white

## Default Workflow
1. Map UI surface to portal layout (admin sidebar or requester top-nav)
2. Apply tokenized spacing/typography/color rules
3. Ensure semantic color usage for status and alerts
4. Verify interactive states (hover, focus, active, disabled)
5. Run a visual consistency check against existing pages

## Validation Checklist
- [ ] No off-palette colors introduced
- [ ] Card spacing uses `p-6`
- [ ] Buttons specify variant and size
- [ ] Tables include hover + empty state treatment
- [ ] Typography hierarchy is consistent and minimal

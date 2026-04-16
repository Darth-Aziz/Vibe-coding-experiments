---
name: tasheel-form-patterns
description: Covers Tasheel form builder structure, drag-and-drop behavior, dynamic rendering, and validation expectations. Use when adding fields, editing builder UX, or rendering requester forms.
---

# Tasheel Form Patterns

## Builder: Three Panels
Left (w-48): Field type palette (draggable)
Center (flex-1): Sortable field preview (@dnd-kit)
Right (w-72): Field configuration editor

## Field Types
text, textarea, number, email, select, radio, checkbox, date, file

## @dnd-kit Pattern
DndContext → SortableContext (verticalListSortingStrategy) → SortableField items

## Dynamic Renderer
Read FormField[] → map type to shadcn component → manage state with useState → validate on submit

## Validation
Required fields checked before submit. Error shown as text-red-600 text-sm below field.

## Default Workflow
1. Add/update field type definition and palette entry
2. Ensure sortable preview behavior via @dnd-kit
3. Update config panel for field options and constraints
4. Update dynamic renderer mapping for each supported type
5. Validate required and edge-case behavior

## Validation Checklist
- [ ] New field type appears in palette and preview
- [ ] Reorder drag-and-drop works reliably
- [ ] Config edits reflect immediately in preview
- [ ] Submission blocks when required values are missing
- [ ] Errors are shown with accessible, consistent styling

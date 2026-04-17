"use client";

import { useState, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FormField } from "@/lib/types";
import { generateId, cn } from "@/lib/utils";
import { FieldConfig } from "./field-config";
import {
  GripVertical,
  Plus,
  Type,
  AlignLeft,
  Hash,
  Mail,
  List,
  CircleDot,
  CheckSquare,
  Calendar,
  Clock,
  Upload,
  FileText,
  Search,
  Copy,
  Trash2,
  ChevronDown,
  Settings,
  Eye,
  Link2,
  Phone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ServiceRequestFormFields } from "@/components/shared/service-request-form-fields";
import { TasheelPhoneInput } from "@/components/shared/phone-input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FormBuilderProps {
  fields: FormField[];
  onFieldsChange: (fields: FormField[]) => void;
  /** Shown in the preview dialog title (e.g. service name). */
  previewTitle?: string;
}

type FieldTypeDef = {
  type: FormField["type"];
  label: string;
  icon: LucideIcon;
  description: string;
};

const fieldCategories: { name: string; items: FieldTypeDef[] }[] = [
  {
    name: "Text inputs",
    items: [
      { type: "text", label: "Short Text", icon: Type, description: "Single line text" },
      { type: "textarea", label: "Long Text", icon: AlignLeft, description: "Multi-line text" },
      { type: "number", label: "Number", icon: Hash, description: "Numeric values" },
      { type: "email", label: "Email", icon: Mail, description: "Email address" },
      { type: "url", label: "URL", icon: Link2, description: "Website or link" },
      { type: "tel", label: "Phone", icon: Phone, description: "Phone number" },
    ],
  },
  {
    name: "Choices",
    items: [
      { type: "select", label: "Dropdown", icon: List, description: "Select from list" },
      { type: "radio", label: "Single Choice", icon: CircleDot, description: "Radio buttons" },
      { type: "checkbox", label: "Multiple Choice", icon: CheckSquare, description: "Checkboxes" },
    ],
  },
  {
    name: "Date & files",
    items: [
      { type: "date", label: "Date", icon: Calendar, description: "Calendar date" },
      { type: "time", label: "Time", icon: Clock, description: "Time of day" },
      { type: "file", label: "File Upload", icon: Upload, description: "Upload documents" },
    ],
  },
];

function FieldCanvasBlock({
  field,
  isSelected,
  onSelect,
  onRemove,
  onDuplicate,
}: {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onDuplicate: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative cursor-pointer rounded-xl p-6 transition-all duration-200",
        isDragging && "z-20 scale-[0.99] opacity-40",
        isSelected
          ? "z-10 bg-primary/[0.03] shadow-sm ring-2 ring-primary/60"
          : "ring-1 ring-transparent hover:bg-muted/40 hover:ring-border/80"
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <div
        className={cn(
          "absolute left-2 top-1/2 -translate-y-1/2 touch-none p-1.5 text-muted-foreground/40 transition-opacity hover:text-foreground",
          hovered || isSelected ? "opacity-100" : "opacity-0"
        )}
      >
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </div>

      {(hovered || isSelected) && (
        <div className="absolute -top-3 right-4 z-20 flex items-center overflow-hidden rounded-md border border-border/60 bg-card shadow-md">
          <button
            type="button"
            className="p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Duplicate"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <div className="h-4 w-px bg-border/60" />
          <button
            type="button"
            className="p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="pl-4">
        <div className="mb-3 flex items-center justify-between">
          <Label className="flex cursor-pointer items-center gap-1.5 text-base font-medium text-foreground">
            {field.label}
            {field.required && <span className="font-bold text-destructive">*</span>}
          </Label>
          <Badge variant="outline" className="font-mono text-[10px] uppercase">
            {field.type}
          </Badge>
        </div>

        {field.description && (
          <p className="mb-3 max-w-xl text-sm text-muted-foreground">{field.description}</p>
        )}

        <div className="pointer-events-none max-w-xl">
          {field.type === "textarea" ? (
            <Textarea
              readOnly
              placeholder={field.placeholder || "Enter your answer..."}
              className="min-h-[100px] resize-none border-border/50 bg-background/50 shadow-sm"
            />
          ) : field.type === "select" ? (
            <div className="flex h-10 w-full items-center justify-between rounded-md border border-border/50 bg-background/50 px-3 py-2 shadow-sm">
              <span className="text-sm text-muted-foreground">
                {field.placeholder || "Select an option..."}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground opacity-50" />
            </div>
          ) : field.type === "radio" ? (
            <div className="flex flex-col gap-3">
              {(field.options || ["Option 1", "Option 2"]).map((opt, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full border border-border/80 bg-background shadow-sm" />
                  <span className="text-sm text-foreground">{opt}</span>
                </div>
              ))}
            </div>
          ) : field.type === "checkbox" ? (
            <div className="flex flex-col gap-3">
              {(field.options || ["Option 1", "Option 2"]).map((opt, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-4 w-4 items-center justify-center rounded border border-border/80 bg-background shadow-sm" />
                  <span className="text-sm text-foreground">{opt}</span>
                </div>
              ))}
            </div>
          ) : field.type === "time" ? (
            <div className="relative">
              <div className="flex h-10 w-full items-center rounded-md border border-border/50 bg-background/50 py-2 pl-10 pr-3 shadow-sm">
                <span className="text-sm text-muted-foreground">--:--</span>
              </div>
              <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
            </div>
          ) : field.type === "date" ? (
            <div className="relative">
              <div className="flex h-10 w-full items-center rounded-md border border-border/50 bg-background/50 py-2 pl-10 pr-3 shadow-sm">
                <span className="text-sm text-muted-foreground">YYYY-MM-DD</span>
              </div>
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
            </div>
          ) : field.type === "file" ? (
            <div className="flex h-24 w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border/60 bg-muted/10">
              <FileText className="h-6 w-6 text-muted-foreground/40" />
              <span className="text-sm font-medium text-muted-foreground">
                Click to upload or drag and drop
              </span>
            </div>
          ) : field.type === "tel" ? (
            <TasheelPhoneInput
              value=""
              onChange={() => {}}
              defaultCountry={field.phoneDefaultCountry}
              disabled
              placeholder="Phone number"
              className="border-border/50 bg-background/50"
            />
          ) : (
            <Input
              readOnly
              type={
                field.type === "number"
                  ? "number"
                  : field.type === "email"
                    ? "email"
                    : field.type === "url"
                      ? "url"
                      : "text"
              }
              placeholder={field.placeholder || "Enter your answer..."}
              className="border-border/50 bg-background/50 shadow-sm"
            />
          )}
        </div>

        {field.helpText && (
          <p className="mt-2.5 text-xs text-muted-foreground">{field.helpText}</p>
        )}
      </div>
    </div>
  );
}

export function FormBuilder({ fields, onFieldsChange, previewTitle }: FormBuilderProps) {
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [paletteSearch, setPaletteSearch] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const selectedField = fields.find((f) => f.id === selectedFieldId) ?? null;

  const filteredCategories = useMemo(() => {
    const q = paletteSearch.toLowerCase();
    if (!q) return fieldCategories;
    return fieldCategories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (it) =>
            it.label.toLowerCase().includes(q) ||
            it.description.toLowerCase().includes(q)
        ),
      }))
      .filter((c) => c.items.length > 0);
  }, [paletteSearch]);

  function addField(type: FormField["type"]) {
    const meta = fieldCategories.flatMap((c) => c.items).find((ft) => ft.type === type);
    const newField: FormField = {
      id: generateId(),
      type,
      label: meta?.label ? `${meta.label} Field` : "New Field",
      placeholder: "",
      required: false,
      options: ["select", "radio", "checkbox"].includes(type)
        ? ["Option 1", "Option 2", "Option 3"]
        : undefined,
      order: fields.length,
      ...(type === "tel" ? { phoneDefaultCountry: "SA" } : {}),
    };
    onFieldsChange([...fields, newField]);
    setSelectedFieldId(newField.id);
  }

  function duplicateField(field: FormField) {
    const idx = fields.findIndex((f) => f.id === field.id);
    const dup: FormField = {
      ...field,
      id: generateId(),
      label: `${field.label} (copy)`,
    };
    const next = [...fields];
    next.splice(idx + 1, 0, dup);
    onFieldsChange(next.map((f, i) => ({ ...f, order: i })));
    setSelectedFieldId(dup.id);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(fields, oldIndex, newIndex).map((f, i) => ({
        ...f,
        order: i,
      }));
      onFieldsChange(reordered);
    }
  }

  function updateField(updates: Partial<FormField>) {
    if (!selectedFieldId) return;
    onFieldsChange(
      fields.map((f) => (f.id === selectedFieldId ? { ...f, ...updates } : f))
    );
  }

  function removeField(id: string) {
    onFieldsChange(
      fields.filter((f) => f.id !== id).map((f, i) => ({ ...f, order: i }))
    );
    if (selectedFieldId === id) setSelectedFieldId(null);
  }

  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  return (
    <div className="flex min-h-[560px] w-full flex-1 overflow-hidden rounded-xl border border-border/40 bg-muted/30">
      {/* Left palette */}
      <aside className="flex w-[280px] shrink-0 flex-col border-r border-border/40 bg-card">
        <div className="border-b border-border/40 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
            <Input
              placeholder="Search components..."
              value={paletteSearch}
              onChange={(e) => setPaletteSearch(e.target.value)}
              className="h-9 border-border/50 bg-muted/30 pl-9 text-sm shadow-none focus-visible:bg-background"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-6">
          <div className="space-y-6 pt-2">
            {filteredCategories.map((category) => (
              <div key={category.name} className="space-y-2.5">
                <h4 className="px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {category.name}
                </h4>
                <div className="grid grid-cols-1 gap-1">
                  {category.items.map((ft) => (
                    <button
                      key={ft.type}
                      type="button"
                      onClick={() => addField(ft.type)}
                      className="group flex items-center gap-3 rounded-lg border border-transparent bg-transparent px-3 py-2 text-left text-sm text-foreground transition-all hover:border-border/50 hover:bg-muted/60"
                    >
                      <div className="flex h-8 w-8 shrink-0 flex-col items-center justify-center rounded-md border border-border/30 bg-muted/50 text-muted-foreground transition-colors group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary">
                        <ft.icon className="h-4 w-4" strokeWidth={2.5} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="truncate text-xs font-medium">{ft.label}</span>
                        <p className="truncate text-[10px] text-muted-foreground">{ft.description}</p>
                      </div>
                      <Plus className="h-4 w-4 shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Center canvas */}
      <main
        className="relative flex flex-1 justify-center overflow-y-auto"
        style={{
          backgroundImage: `radial-gradient(var(--border) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          backgroundColor: "var(--muted)",
          backgroundBlendMode: "multiply",
        }}
        onClick={() => setSelectedFieldId(null)}
      >
        <div className="flex w-full max-w-[760px] flex-col items-center px-8 py-10">
          <div
            className="w-full overflow-hidden rounded-xl border border-border/40 bg-card shadow-sm ring-1 ring-black/5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="group relative border-b border-border/20 px-10 pb-8 pt-12">
              <div className="absolute right-4 top-4 flex items-center gap-2">
                <Dialog>
                  <DialogTrigger
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 shadow-sm"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Requester preview
                      </Button>
                    }
                  />
                  <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>
                        Form preview{previewTitle ? ` — ${previewTitle}` : ""}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-5 pt-2">
                      <ServiceRequestFormFields
                        fields={sortedFields}
                        formData={{}}
                        onFieldChange={() => {}}
                        readOnly
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <h2 className="mb-3 text-2xl font-semibold tracking-tight text-foreground">
                Form preview
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Fields below mirror what requesters will see. Click a field to select it and
                edit properties on the right.
              </p>
            </div>

            <div className="min-h-[320px] space-y-2 p-6">
              {sortedFields.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <FileText className="mb-4 h-12 w-12 opacity-20" />
                  <p className="text-sm font-medium text-foreground">Your form is empty</p>
                  <p className="mt-1 max-w-[240px] text-xs text-muted-foreground">
                    Add components from the left toolbox.
                  </p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={sortedFields.map((f) => f.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-1">
                      {sortedFields.map((field) => (
                        <FieldCanvasBlock
                          key={field.id}
                          field={field}
                          isSelected={field.id === selectedFieldId}
                          onSelect={() => setSelectedFieldId(field.id)}
                          onRemove={() => removeField(field.id)}
                          onDuplicate={() => duplicateField(field)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}

              <button
                type="button"
                className="mt-4 flex h-20 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/40 bg-transparent text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFieldId(null);
                }}
              >
                <Plus className="mb-1 h-5 w-5 opacity-50 group-hover:opacity-100" />
                <span className="text-[13px] font-medium">Add Field</span>
              </button>
            </div>
          </div>
          <div className="h-16 w-full shrink-0" />
        </div>
      </main>

      {/* Right properties */}
      <aside className="flex w-[340px] shrink-0 flex-col border-l border-border/40 bg-card shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
        {selectedField ? (
          <>
            <div className="flex h-14 items-center justify-between border-b border-border/40 bg-muted/10 px-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Settings className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-semibold tracking-tight">Properties</span>
              </div>
              <Badge
                variant="outline"
                className="border-border/50 bg-background font-mono text-[10px] uppercase shadow-sm text-muted-foreground"
              >
                {selectedField.type}
              </Badge>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FieldConfig field={selectedField} onUpdate={updateField} />
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-muted/5 p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card shadow-sm">
              <Settings className="h-6 w-6 text-muted-foreground/40" />
            </div>
            <h3 className="mb-1 text-sm font-semibold text-foreground">No Selection</h3>
            <p className="max-w-[200px] text-xs text-muted-foreground">
              Click a field in the canvas to configure its settings here.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}

"use client";

import type { FormField } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface ServiceRequestFormFieldsProps {
  fields: FormField[];
  /** Values keyed by field label (matches existing request submission shape). */
  formData: Record<string, unknown>;
  onFieldChange: (label: string, value: unknown) => void;
  errors?: Record<string, boolean>;
  /** Read-only preview (form builder / modal). */
  readOnly?: boolean;
  className?: string;
}

/**
 * Renders service request fields for the requester portal and admin previews.
 * Single source of truth for field-type → control mapping (plan: shared renderer).
 */
export function ServiceRequestFormFields({
  fields,
  formData,
  onFieldChange,
  errors = {},
  readOnly = false,
  className,
}: ServiceRequestFormFieldsProps) {
  const sorted = [...fields].sort((a, b) => a.order - b.order);

  if (sorted.length === 0) {
    return (
      <p className={cn("py-8 text-center text-sm text-muted-foreground", className)}>
        {readOnly ? "No fields to preview." : "This service doesn't have a form configured yet."}
      </p>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {sorted.map((field) => {
        const err = !!errors[field.label];
        const commonLabel = (
          <>
            <Label className={readOnly ? "text-sm font-medium" : undefined}>
              {field.label}
              {field.required && <span className="ml-0.5 text-red-500">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </>
        );

        if (readOnly) {
          return (
            <div key={field.id} className="space-y-1.5">
              {commonLabel}
              <ReadOnlyFieldPreview field={field} />
              {field.helpText && (
                <p className="text-xs text-muted-foreground">{field.helpText}</p>
              )}
            </div>
          );
        }

        return (
          <div key={field.id} className="space-y-1.5">
            {commonLabel}

            {field.type === "text" || field.type === "email" || field.type === "number" ? (
              <Input
                type={field.type}
                placeholder={field.placeholder}
                value={(formData[field.label] as string) ?? ""}
                onChange={(e) => onFieldChange(field.label, e.target.value)}
                className={err ? "border-red-400" : ""}
              />
            ) : field.type === "textarea" ? (
              <Textarea
                placeholder={field.placeholder}
                value={(formData[field.label] as string) ?? ""}
                onChange={(e) => onFieldChange(field.label, e.target.value)}
                className={err ? "border-red-400" : ""}
              />
            ) : field.type === "select" || field.type === "radio" ? (
              <Select
                value={((formData[field.label] as string | undefined) ?? "") || undefined}
                onValueChange={(v) => v && onFieldChange(field.label, v)}
              >
                <SelectTrigger className={err ? "border-red-400" : ""}>
                  <SelectValue placeholder={field.placeholder || "Select..."} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : field.type === "checkbox" ? (
              <div className="space-y-2">
                {field.options?.map((opt) => {
                  const current = (formData[field.label] as string[]) || [];
                  const checked = current.includes(opt);
                  return (
                    <div key={opt} className="flex items-center gap-2">
                      <Checkbox
                        id={`${field.id}-${opt}`}
                        checked={checked}
                        onCheckedChange={(c) => {
                          const next =
                            c === true
                              ? [...current, opt]
                              : current.filter((v) => v !== opt);
                          onFieldChange(field.label, next);
                        }}
                      />
                      <Label htmlFor={`${field.id}-${opt}`} className="font-normal">
                        {opt}
                      </Label>
                    </div>
                  );
                })}
              </div>
            ) : field.type === "date" ? (
              <Input
                type="date"
                value={(formData[field.label] as string) ?? ""}
                onChange={(e) => onFieldChange(field.label, e.target.value)}
                className={err ? "border-red-400" : ""}
              />
            ) : (
              <Input
                type={field.type === "file" ? "file" : "text"}
                placeholder={field.placeholder}
                onChange={(e) =>
                  onFieldChange(
                    field.label,
                    field.type === "file"
                      ? (e.target.files?.[0]?.name ?? "")
                      : e.target.value
                  )
                }
                className={err ? "border-red-400" : ""}
              />
            )}

            {err && <p className="text-xs text-red-500">This field is required</p>}
          </div>
        );
      })}
    </div>
  );
}

function ReadOnlyFieldPreview({ field }: { field: FormField }) {
  return (
    <div className="pointer-events-none opacity-90">
      {field.type === "textarea" ? (
        <Textarea
          readOnly
          placeholder={field.placeholder || "…"}
          className="min-h-[80px] resize-none"
        />
      ) : field.type === "select" ? (
        <div className="flex h-10 w-full items-center rounded-md border border-border bg-background px-3 text-sm text-muted-foreground">
          {field.placeholder || "Select…"}
        </div>
      ) : field.type === "radio" ? (
        <div className="flex flex-col gap-2">
          {(field.options || ["Option 1", "Option 2"]).map((opt) => (
            <div key={opt} className="flex items-center gap-2 text-sm">
              <span className="h-3 w-3 rounded-full border border-border" />
              {opt}
            </div>
          ))}
        </div>
      ) : field.type === "checkbox" ? (
        <div className="flex flex-col gap-2">
          {(field.options || ["Option 1", "Option 2"]).map((opt) => (
            <div key={opt} className="flex items-center gap-2 text-sm">
              <span className="h-3 w-3 rounded border border-border" />
              {opt}
            </div>
          ))}
        </div>
      ) : field.type === "date" ? (
        <Input readOnly placeholder="YYYY-MM-DD" />
      ) : field.type === "file" ? (
        <div className="flex h-16 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
          File upload
        </div>
      ) : (
        <Input
          readOnly
          type={
            field.type === "number" ? "number" : field.type === "email" ? "email" : "text"
          }
          placeholder={field.placeholder || "…"}
        />
      )}
    </div>
  );
}

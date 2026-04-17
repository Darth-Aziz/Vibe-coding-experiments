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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TasheelPhoneInput } from "@/components/shared/phone-input";
import { cn } from "@/lib/utils";

export interface ServiceRequestFormFieldsProps {
  fields: FormField[];
  /** Values keyed by field label (matches existing request submission shape). */
  formData: Record<string, unknown>;
  onFieldChange: (label: string, value: unknown) => void;
  /** Validation messages keyed by field label. */
  errors?: Record<string, string>;
  /** Read-only preview (form builder / modal). */
  readOnly?: boolean;
  className?: string;
}

/**
 * Renders service request fields for the requester portal and admin previews.
 * Single source of truth for field-type → control mapping.
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
    <div className={cn("space-y-5", className)}>
      {sorted.map((field) => {
        const err = errors[field.label];
        const invalid = Boolean(err);

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

            {field.type === "tel" ? (
              <TasheelPhoneInput
                value={(formData[field.label] as string) ?? ""}
                onChange={(v) => onFieldChange(field.label, v ?? "")}
                defaultCountry={field.phoneDefaultCountry}
                aria-invalid={invalid}
                placeholder={field.placeholder}
              />
            ) : field.type === "text" ||
              field.type === "email" ||
              field.type === "url" ? (
              <Input
                type={field.type}
                placeholder={field.placeholder}
                value={(formData[field.label] as string) ?? ""}
                onChange={(e) => onFieldChange(field.label, e.target.value)}
                minLength={field.minLength}
                maxLength={field.maxLength}
                aria-invalid={invalid}
                className={cn("h-9", invalid && "border-red-400 aria-invalid:border-red-400")}
              />
            ) : field.type === "number" ? (
              <Input
                type="number"
                placeholder={field.placeholder}
                value={(formData[field.label] as string) ?? ""}
                onChange={(e) => onFieldChange(field.label, e.target.value)}
                min={field.min}
                max={field.max}
                step={field.step ?? "any"}
                aria-invalid={invalid}
                className={cn("h-9", invalid && "border-red-400 aria-invalid:border-red-400")}
              />
            ) : field.type === "textarea" ? (
              <Textarea
                placeholder={field.placeholder}
                value={(formData[field.label] as string) ?? ""}
                onChange={(e) => onFieldChange(field.label, e.target.value)}
                minLength={field.minLength}
                maxLength={field.maxLength}
                aria-invalid={invalid}
                className={cn(invalid && "border-red-400 aria-invalid:border-red-400")}
              />
            ) : field.type === "select" ? (
              <Select
                value={((formData[field.label] as string | undefined) ?? "") || undefined}
                onValueChange={(v) => v && onFieldChange(field.label, v)}
              >
                <SelectTrigger
                  aria-invalid={invalid}
                  className={cn("h-9", invalid && "border-red-400")}
                >
                  <SelectValue placeholder={field.placeholder || "Select…"} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : field.type === "radio" ? (
              <RadioGroup
                value={(formData[field.label] as string) || undefined}
                onValueChange={(v) => onFieldChange(field.label, v)}
                className={cn("gap-3", invalid && "rounded-md p-1 ring-2 ring-red-400")}
              >
                {field.options?.map((opt) => (
                  <div key={opt} className="flex items-center gap-2">
                    <RadioGroupItem value={opt} id={`${field.id}-${opt}`} />
                    <Label htmlFor={`${field.id}-${opt}`} className="font-normal">
                      {opt}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
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
                aria-invalid={invalid}
                className={cn("h-9", invalid && "border-red-400")}
              />
            ) : field.type === "time" ? (
              <Input
                type="time"
                value={(formData[field.label] as string) ?? ""}
                onChange={(e) => onFieldChange(field.label, e.target.value)}
                aria-invalid={invalid}
                className={cn("h-9", invalid && "border-red-400")}
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
                aria-invalid={invalid}
                className={cn("h-9", invalid && "border-red-400")}
              />
            )}

            {err ? <p className="text-xs text-red-600">{err}</p> : null}
            {!err && field.helpText ? (
              <p className="text-xs text-muted-foreground">{field.helpText}</p>
            ) : null}
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
        <div className="flex h-9 w-full items-center rounded-md border border-border bg-background px-3 text-sm text-muted-foreground">
          {field.placeholder || "Select…"}
        </div>
      ) : field.type === "radio" ? (
        <div className="flex flex-col gap-2">
          {(field.options || ["Option 1", "Option 2"]).map((opt) => (
            <div key={opt} className="flex items-center gap-2 text-sm">
              <span className="h-3.5 w-3.5 rounded-full border border-border" />
              {opt}
            </div>
          ))}
        </div>
      ) : field.type === "checkbox" ? (
        <div className="flex flex-col gap-2">
          {(field.options || ["Option 1", "Option 2"]).map((opt) => (
            <div key={opt} className="flex items-center gap-2 text-sm">
              <span className="h-3.5 w-3.5 rounded border border-border" />
              {opt}
            </div>
          ))}
        </div>
      ) : field.type === "date" ? (
        <Input readOnly className="h-9" placeholder="YYYY-MM-DD" />
      ) : field.type === "time" ? (
        <Input readOnly className="h-9" type="time" />
      ) : field.type === "file" ? (
        <div className="flex h-16 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
          File upload
        </div>
      ) : field.type === "tel" ? (
        <TasheelPhoneInput
          value=""
          onChange={() => {}}
          defaultCountry={field.phoneDefaultCountry}
          disabled
          placeholder={field.placeholder || "+966 …"}
        />
      ) : (
        <Input
          readOnly
          className="h-9"
          type={
            field.type === "number"
              ? "number"
              : field.type === "email"
                ? "email"
                : field.type === "url"
                  ? "url"
                  : "text"
          }
          placeholder={field.placeholder || "…"}
        />
      )}
    </div>
  );
}

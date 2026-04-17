"use client";

import { useState } from "react";
import type { FormField } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, X, GripHorizontal, ListTree } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PHONE_DEFAULT_COUNTRY_OPTIONS } from "@/lib/phone-countries";

interface FieldConfigProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export function FieldConfig({ field, onUpdate }: FieldConfigProps) {
  const hasOptions = ["select", "radio", "checkbox"].includes(field.type);
  const hasPlaceholder = [
    "text",
    "textarea",
    "number",
    "email",
    "select",
    "url",
    "tel",
  ].includes(field.type);
  const hasTextConstraints = ["text", "textarea", "email", "url", "tel"].includes(field.type);
  const hasNumberConstraints = field.type === "number";

  const [bulkChoices, setBulkChoices] = useState("");

  function addOption() {
    const options = [
      ...(field.options || []),
      `Option ${(field.options?.length || 0) + 1}`,
    ];
    onUpdate({ options });
  }

  function updateOption(index: number, value: string) {
    const options = [...(field.options || [])];
    options[index] = value;
    onUpdate({ options });
  }

  function removeOption(index: number) {
    if ((field.options?.length || 0) <= 2) return;
    const options = (field.options || []).filter((_, i) => i !== index);
    onUpdate({ options });
  }

  function applyBulkChoices() {
    const lines = bulkChoices
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (lines.length < 2) return;
    onUpdate({ options: lines });
    setBulkChoices("");
  }

  function parseOptionalInt(raw: string): number | undefined {
    if (raw === "" || raw === "-") return undefined;
    const n = parseInt(raw, 10);
    return Number.isNaN(n) ? undefined : n;
  }

  function parseOptionalFloat(raw: string): number | undefined {
    if (raw === "" || raw === "-") return undefined;
    const n = parseFloat(raw);
    return Number.isNaN(n) ? undefined : n;
  }

  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-lg border border-border/60 bg-muted/10 p-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Identity
        </h3>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-foreground">Field label</Label>
          <Input
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="h-9 border-border/60 bg-background font-medium shadow-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-foreground">Description</Label>
          <Textarea
            value={field.description || ""}
            onChange={(e) => onUpdate({ description: e.target.value || undefined })}
            placeholder="Optional — shown under the label for requesters"
            className="min-h-[52px] resize-none border-border/60 bg-background text-sm shadow-sm"
          />
        </div>

        {hasPlaceholder && (
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">Placeholder</Label>
            <Input
              value={field.placeholder || ""}
              onChange={(e) => onUpdate({ placeholder: e.target.value || undefined })}
              placeholder="Hint text inside the control"
              className="h-9 border-border/60 bg-background text-sm shadow-sm"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-foreground">Help text</Label>
          <Textarea
            value={field.helpText || ""}
            onChange={(e) => onUpdate({ helpText: e.target.value || undefined })}
            placeholder="Optional — smaller hint below the field"
            className="min-h-[60px] resize-none border-border/60 bg-background text-sm shadow-sm"
          />
        </div>
      </section>

      <section className="rounded-lg border border-border/60 bg-muted/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <Label
              htmlFor="req-switch"
              className="cursor-pointer text-sm font-medium text-foreground"
            >
              Required
            </Label>
            <p className="text-[11px] text-muted-foreground">
              Block submit until valid (and filled when required)
            </p>
          </div>
          <Switch
            id="req-switch"
            checked={field.required}
            onCheckedChange={(checked) => onUpdate({ required: !!checked })}
          />
        </div>
      </section>

      {field.type === "tel" && (
        <>
          <Separator className="bg-border/50" />
          <section className="space-y-2 rounded-lg border border-border/60 bg-muted/10 p-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Country &amp; dial code
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Requesters pick a country (with flag) and enter the number. Values are stored in
              international (E.164) format.
            </p>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">Default country</Label>
              <Select
                value={
                  PHONE_DEFAULT_COUNTRY_OPTIONS.some(
                    (o) => o.value === field.phoneDefaultCountry
                  )
                    ? field.phoneDefaultCountry
                    : "SA"
                }
                onValueChange={(v) =>
                  onUpdate({ phoneDefaultCountry: v ?? "SA" })
                }
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  {PHONE_DEFAULT_COUNTRY_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>
        </>
      )}

      {hasTextConstraints && (
        <>
          <Separator className="bg-border/50" />
          <section className="space-y-3 rounded-lg border border-border/60 bg-muted/10 p-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Length
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Min characters</Label>
                <Input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={field.minLength ?? ""}
                  onChange={(e) =>
                    onUpdate({ minLength: parseOptionalInt(e.target.value) })
                  }
                  className="h-9"
                  placeholder="—"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Max characters</Label>
                <Input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={field.maxLength ?? ""}
                  onChange={(e) =>
                    onUpdate({ maxLength: parseOptionalInt(e.target.value) })
                  }
                  className="h-9"
                  placeholder="—"
                />
              </div>
            </div>
          </section>
        </>
      )}

      {hasNumberConstraints && (
        <>
          <Separator className="bg-border/50" />
          <section className="space-y-3 rounded-lg border border-border/60 bg-muted/10 p-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Number range
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Min</Label>
                <Input
                  type="number"
                  value={field.min ?? ""}
                  onChange={(e) => onUpdate({ min: parseOptionalFloat(e.target.value) })}
                  className="h-9"
                  placeholder="—"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Max</Label>
                <Input
                  type="number"
                  value={field.max ?? ""}
                  onChange={(e) => onUpdate({ max: parseOptionalFloat(e.target.value) })}
                  className="h-9"
                  placeholder="—"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Step</Label>
              <Input
                type="number"
                value={field.step ?? ""}
                onChange={(e) => onUpdate({ step: parseOptionalFloat(e.target.value) })}
                className="h-9"
                placeholder="any"
              />
            </div>
          </section>
        </>
      )}

      {hasOptions && (
        <>
          <Separator className="bg-border/50" />
          <section className="space-y-4 rounded-lg border border-border/60 bg-muted/10 p-4">
            <div className="flex items-center gap-2">
              <ListTree className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Choices
              </h3>
            </div>
            <p className="text-[11px] text-muted-foreground">
              At least two options. Drag handle is visual only; order follows the list.
            </p>
            <div className="space-y-2">
              {(field.options || []).map((opt, i) => (
                <div
                  key={`${field.id}-opt-${i}`}
                  className="group/opt flex items-center gap-2 rounded-md border border-border/50 bg-background p-1 pl-2 shadow-sm transition-colors focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/30"
                >
                  <GripHorizontal className="h-3.5 w-3.5 shrink-0 cursor-grab text-muted-foreground/40 hover:text-muted-foreground" />
                  <input
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    className="h-8 min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
                    placeholder={`Option ${i + 1}`}
                    aria-label={`Choice ${i + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 rounded-sm text-muted-foreground/50 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removeOption(i)}
                    disabled={(field.options?.length || 0) <= 2}
                    aria-label={`Remove choice ${i + 1}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 w-full text-xs font-medium"
              onClick={addOption}
            >
              <Plus className="mr-1 h-3.5 w-3.5" /> Add choice
            </Button>

            <div className="space-y-2 border-t border-border/50 pt-3">
              <Label className="text-xs font-medium text-foreground">Bulk import</Label>
              <Textarea
                value={bulkChoices}
                onChange={(e) => setBulkChoices(e.target.value)}
                placeholder={"One per line, or comma-separated\ne.g. Small / Medium / Large"}
                className="min-h-[72px] resize-y text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 w-full text-xs"
                onClick={applyBulkChoices}
                disabled={bulkChoices.trim().length === 0}
              >
                Replace choices from text
              </Button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

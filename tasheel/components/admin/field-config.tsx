"use client";

import { FormField } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, X, GripHorizontal } from "lucide-react";

interface FieldConfigProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export function FieldConfig({ field, onUpdate }: FieldConfigProps) {
  const hasOptions = ["select", "radio", "checkbox"].includes(field.type);
  const hasPlaceholder = ["text", "textarea", "number", "email", "select"].includes(
    field.type
  );

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

  return (
    <div className="space-y-7">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Field Label
          </Label>
          <Input
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="h-9 border-border/60 bg-background font-medium shadow-sm focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Description
          </Label>
          <Textarea
            value={field.description || ""}
            onChange={(e) => onUpdate({ description: e.target.value || undefined })}
            placeholder="Optional text shown under the label for requesters"
            className="min-h-[52px] resize-none border-border/60 bg-background text-sm shadow-sm"
          />
        </div>

        {hasPlaceholder && (
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Placeholder Text
            </Label>
            <Input
              value={field.placeholder || ""}
              onChange={(e) => onUpdate({ placeholder: e.target.value })}
              placeholder="e.g. Enter your name"
              className="h-9 border-border/60 bg-background text-sm shadow-sm"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Help Text
          </Label>
          <Textarea
            value={field.helpText || ""}
            onChange={(e) => onUpdate({ helpText: e.target.value })}
            placeholder="Hints to help the user answer..."
            className="min-h-[60px] resize-none border-border/60 bg-background text-sm shadow-sm"
          />
        </div>
      </div>

      <Separator className="bg-border/50" />

      <div className="space-y-4">
        <Label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Rules &amp; Validation
        </Label>
        <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-3">
          <div className="space-y-0.5">
            <Label
              htmlFor="req-switch"
              className="cursor-pointer text-sm font-medium text-foreground"
            >
              Required Field
            </Label>
            <p className="text-[11px] text-muted-foreground">
              User cannot submit without answering
            </p>
          </div>
          <Switch
            id="req-switch"
            checked={field.required}
            onCheckedChange={(checked) => onUpdate({ required: !!checked })}
          />
        </div>
      </div>

      {hasOptions && (
        <>
          <Separator className="bg-border/50" />
          <div className="space-y-4">
            <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Choices
            </Label>
            <div className="space-y-2">
              {(field.options || []).map((opt, i) => (
                <div
                  key={i}
                  className="group/opt flex items-center gap-2 rounded-md border border-border/50 bg-background p-1 pl-2 shadow-sm transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50"
                >
                  <GripHorizontal className="h-3.5 w-3.5 shrink-0 cursor-grab text-muted-foreground/30 hover:text-muted-foreground" />
                  <input
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    className="h-7 min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
                    placeholder={`Option ${i + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 rounded-sm text-muted-foreground/50 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removeOption(i)}
                    disabled={(field.options?.length || 0) <= 2}
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
              className="h-8 w-full border border-transparent bg-muted/50 text-xs font-medium hover:border-border/50 hover:bg-muted"
              onClick={addOption}
            >
              <Plus className="mr-1 h-3.5 w-3.5" /> Add Choice
            </Button>
            <p className="text-[10px] text-muted-foreground">Minimum 2 options required</p>
          </div>
        </>
      )}
    </div>
  );
}

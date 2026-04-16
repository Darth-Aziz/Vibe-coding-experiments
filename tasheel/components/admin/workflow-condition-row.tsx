"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FormField } from "@/lib/types";
import type { GatewayCondition } from "@/lib/workflow-flow-types";
import { CONDITION_OPERATORS, SYSTEM_VARIABLES_LIST } from "./workflow-flow-config";

interface WorkflowConditionRowProps {
  condition: GatewayCondition;
  formFields: FormField[];
  onChange: (key: string, value: string) => void;
  onRemove: () => void;
}

export function WorkflowConditionRow({
  condition,
  formFields,
  onChange,
  onRemove,
}: WorkflowConditionRowProps) {
  const formOptions = formFields.map((f) => ({
    value: `form.${f.id}`,
    label: f.label,
    group: "Form",
  }));
  const sysOptions = SYSTEM_VARIABLES_LIST.map((v) => ({
    value: v.name,
    label: v.label,
    group: v.group,
  }));
  const allFields = [...formOptions, ...sysOptions];

  return (
    <div className="group flex items-center gap-1.5">
      <Select value={condition.field} onValueChange={(v) => v && onChange("field", v)}>
        <SelectTrigger className="h-7 min-w-0 flex-1 bg-background font-mono text-[11px] shadow-sm border-border/60">
          <SelectValue placeholder="Field..." />
        </SelectTrigger>
        <SelectContent>
          {allFields.map((f) => (
            <SelectItem key={f.value} value={f.value} className="font-mono text-xs">
              {f.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={condition.operator} onValueChange={(v) => v && onChange("operator", v)}>
        <SelectTrigger className="h-7 w-[110px] shrink-0 bg-background font-mono text-[11px] shadow-sm border-border/60">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {CONDITION_OPERATORS.map((op) => (
            <SelectItem key={op.value} value={op.value} className="font-mono text-xs">
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {condition.operator !== "is_empty" && condition.operator !== "is_not_empty" && (
        <Input
          value={condition.value}
          onChange={(e) => onChange("value", e.target.value)}
          placeholder="Value..."
          className="h-7 w-[80px] shrink-0 bg-background font-mono text-[11px] shadow-sm border-border/60"
        />
      )}
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}

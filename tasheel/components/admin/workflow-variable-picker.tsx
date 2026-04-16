"use client";

import { useState } from "react";
import { Braces, FileText, Settings } from "lucide-react";
import type { FormField } from "@/lib/types";
import { SYSTEM_VARIABLES_LIST } from "./workflow-flow-config";

interface WorkflowVariablePickerProps {
  formFields: FormField[];
  onInsert: (variable: string) => void;
}

export function WorkflowVariablePicker({
  formFields,
  onInsert,
}: WorkflowVariablePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium text-primary transition-colors hover:bg-primary/5 hover:text-primary/80"
      >
        <Braces className="h-3 w-3" /> Insert variable
      </button>
      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Close"
            onClick={() => setOpen(false)}
          />
          <div className="absolute bottom-full left-0 z-50 mb-1 w-[260px] overflow-hidden rounded-lg border border-border/60 bg-popover shadow-xl">
            <div className="max-h-[280px] overflow-y-auto">
              {formFields.length > 0 && (
                <div className="p-1.5">
                  <div className="flex items-center gap-1.5 px-2 py-1.5 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                    <FileText className="h-3 w-3" /> Form fields
                  </div>
                  {formFields.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-muted/60"
                      onClick={() => {
                        onInsert(`{{form.${f.id}}}`);
                        setOpen(false);
                      }}
                    >
                      <code className="max-w-[140px] truncate rounded border border-primary/10 bg-primary/5 px-1.5 py-0.5 font-mono text-[10px] text-primary">
                        form.{f.id}
                      </code>
                      <span className="truncate text-muted-foreground">{f.label}</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="border-t border-border/40 p-1.5">
                <div className="flex items-center gap-1.5 px-2 py-1.5 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                  <Settings className="h-3 w-3" /> System and workflow
                </div>
                {SYSTEM_VARIABLES_LIST.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-muted/60"
                    onClick={() => {
                      onInsert(`{{${v.name}}}`);
                      setOpen(false);
                    }}
                  >
                    <code className="max-w-[140px] truncate rounded border border-amber-500/10 bg-amber-500/5 px-1.5 py-0.5 font-mono text-[10px] text-amber-600">
                      {v.name}
                    </code>
                    <span className="truncate text-muted-foreground">{v.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { FormBuilder } from "@/components/admin/form-builder";
import { FormField } from "@/lib/types";
import { Lightbulb } from "lucide-react";

interface StepFormBuilderProps {
  fields: FormField[];
  onFieldsChange: (fields: FormField[]) => void;
  serviceName: string;
}

export function StepFormBuilder({ fields, onFieldsChange, serviceName }: StepFormBuilderProps) {
  return (
    <div className="py-4 px-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Request Form</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Design the form requesters will fill out for &ldquo;{serviceName}&rdquo;
          </p>
        </div>
        <span className="text-xs text-muted-foreground font-mono">{fields.length} fields</span>
      </div>

      <FormBuilder
        fields={fields}
        onFieldsChange={onFieldsChange}
        previewTitle={serviceName}
      />

      <div className="flex items-start gap-3 rounded-lg bg-blue-50 border border-blue-100 px-4 py-3">
        <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-blue-700">
          The fields you add here will be available as data references in your workflow.
          For example, if you add a &ldquo;Priority&rdquo; field, you can use it in a workflow
          decision point to route high-priority requests to senior approvers.
        </p>
      </div>
    </div>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WORKFLOW_STUDIO_TEMPLATES } from "@/lib/workflow-studio-templates";
import type { WorkflowFlowDefinition } from "@/lib/workflow-flow-types";
import { LayoutTemplate } from "lucide-react";

interface WorkflowTemplateCardsProps {
  onApply: (definition: WorkflowFlowDefinition) => void;
}

export function WorkflowTemplateCards({ onApply }: WorkflowTemplateCardsProps) {
  return (
    <div className="mb-4 space-y-3 px-4">
      <div className="flex items-center gap-2">
        <LayoutTemplate className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Start from a template</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {WORKFLOW_STUDIO_TEMPLATES.map((t) => (
          <Card key={t.id} className="border-border/80 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium leading-snug">{t.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <p className="text-xs leading-relaxed text-muted-foreground">{t.description}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 w-full"
                onClick={() => onApply(t.build())}
              >
                Use template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StudioStepperProps {
  currentStep: number;
  completedSteps: Set<number>;
  onStepClick: (step: number) => void;
}

const steps = [
  { number: 1, label: "Details" },
  { number: 2, label: "Form" },
  { number: 3, label: "Workflow" },
  { number: 4, label: "Review" },
];

export function StudioStepper({ currentStep, completedSteps, onStepClick }: StudioStepperProps) {
  return (
    <nav className="flex items-center justify-center gap-0">
      {steps.map((step, i) => {
        const isComplete = completedSteps.has(step.number);
        const isCurrent = currentStep === step.number;
        const isClickable = isComplete || step.number <= currentStep;

        return (
          <div key={step.number} className="flex items-center">
            <button
              onClick={() => isClickable && onStepClick(step.number)}
              disabled={!isClickable}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 text-sm transition-colors duration-150",
                isClickable ? "cursor-pointer" : "cursor-not-allowed"
              )}
            >
              {isComplete && !isCurrent ? (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success">
                  <Check className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                </div>
              ) : (
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                    isCurrent
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {step.number}
                </div>
              )}
              <span className={cn(
                "font-medium",
                isCurrent ? "text-foreground" :
                isComplete ? "text-muted-foreground" :
                "text-muted-foreground/70"
              )}>
                {step.label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <div className={cn(
                "h-px w-16",
                completedSteps.has(step.number) ? "bg-success/60" : "bg-border"
              )} />
            )}
          </div>
        );
      })}
    </nav>
  );
}

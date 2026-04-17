"use client";

import { useTasheelStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCategoryColor } from "@/lib/utils";
import {
  Laptop, UserPlus, Wrench, CreditCard, FileText,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";

const categoryMeta: Record<string, { label: string; icon: React.ElementType; description: string }> = {
  it: { label: "IT Support", icon: Laptop, description: "Technology and software services" },
  hr: { label: "HR", icon: UserPlus, description: "Human resources and people operations" },
  facilities: { label: "Facilities", icon: Wrench, description: "Building and office management" },
  finance: { label: "Finance", icon: CreditCard, description: "Financial and accounting services" },
  general: { label: "General", icon: FileText, description: "General purpose services" },
};

export default function CategoriesPage() {
  const services = useTasheelStore((s) => s.services);

  const categories = Object.entries(categoryMeta).map(([key, meta]) => ({
    key,
    ...meta,
    count: services.filter((s) => s.category === key).length,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Each service maps to a category for admin filters and requester browsing."
      />

      <div className="space-y-3">
        {categories.map((cat) => (
          <Card
            key={cat.key}
            className="border shadow-sm transition-shadow hover:shadow-md"
          >
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${getCategoryColor(cat.key)} bg-opacity-20`}>
                  <cat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{cat.label}</p>
                  <p className="text-xs text-muted-foreground">{cat.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{cat.count} service{cat.count !== 1 ? "s" : ""}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

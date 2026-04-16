"use client";

import { use } from "react";
import { useTasheelStore } from "@/lib/store";
import { StudioLayout } from "@/components/admin/service-studio/studio-layout";

export default function EditStudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const service = useTasheelStore((s) => s.services.find((svc) => svc.id === id));

  if (!service) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Service not found.</p>
      </div>
    );
  }

  return <StudioLayout existingService={service} />;
}

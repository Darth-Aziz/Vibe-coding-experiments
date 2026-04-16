"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { IconPicker } from "@/components/admin/icon-picker";
import { ServiceCategory, ServiceVisibility } from "@/lib/types";
import { Button } from "@/components/ui/button";

const categories: { value: ServiceCategory; label: string }[] = [
  { value: "it", label: "IT Support" },
  { value: "hr", label: "HR" },
  { value: "facilities", label: "Facilities" },
  { value: "finance", label: "Finance" },
  { value: "general", label: "General" },
];

const slaPresets: { label: string; response: number; resolution: number }[] = [
  { label: "Standard (4h / 3d)", response: 4, resolution: 72 },
  { label: "Fast (2h / 1d)", response: 2, resolution: 24 },
  { label: "Urgent (1h / 8h)", response: 1, resolution: 8 },
];

interface StepDetailsProps {
  name: string; setName: (v: string) => void;
  description: string; setDescription: (v: string) => void;
  category: ServiceCategory; setCategory: (v: ServiceCategory) => void;
  icon: string; setIcon: (v: string) => void;
  visibility: ServiceVisibility; setVisibility: (v: ServiceVisibility) => void;
  responseTime: string; setResponseTime: (v: string) => void;
  resolutionTime: string; setResolutionTime: (v: string) => void;
}

export function StepDetails(props: StepDetailsProps) {
  return (
    <div className="mx-auto max-w-2xl py-8 px-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Service Details</h2>
        <p className="text-sm text-muted-foreground mt-1">Define the basic information for your service</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Basic Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Service Name <span className="text-red-500">*</span></Label>
            <Input value={props.name} onChange={(e) => props.setName(e.target.value)} placeholder="e.g., New Laptop Request" />
            <p className="text-xs text-muted-foreground text-right">{props.name.length}/100</p>
          </div>
          <div className="space-y-2">
            <Label>Description <span className="text-red-500">*</span></Label>
            <Textarea value={props.description} onChange={(e) => props.setDescription(e.target.value)} placeholder="Describe what this service provides..." rows={3} />
            <p className="text-xs text-muted-foreground text-right">{props.description.length}/500</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category <span className="text-red-500">*</span></Label>
              <Select value={props.category} onValueChange={(v) => v && props.setCategory(v as ServiceCategory)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <IconPicker value={props.icon} onChange={props.setIcon} />
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <Label>Catalog visibility</Label>
            <p className="text-xs text-muted-foreground">
              Public services appear in the requester catalog when published. Internal stays admin-only in listings.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={props.visibility === "internal" ? "default" : "outline"}
                size="sm"
                className="h-8"
                onClick={() => props.setVisibility("internal")}
              >
                Internal only
              </Button>
              <Button
                type="button"
                variant={props.visibility === "public" ? "default" : "outline"}
                size="sm"
                className="h-8"
                onClick={() => props.setVisibility("public")}
              >
                Public catalog
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">SLA Configuration</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {slaPresets.map((p) => (
              <Button
                key={p.label}
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  props.setResponseTime(String(p.response));
                  props.setResolutionTime(String(p.resolution));
                }}
              >
                {p.label}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Response Time <span className="text-red-500">*</span></Label>
              <div className="flex items-center gap-2">
                <Input type="number" value={props.responseTime} onChange={(e) => props.setResponseTime(e.target.value)} min="1" className="w-24" />
                <span className="text-sm text-muted-foreground">hours</span>
              </div>
              <p className="text-xs text-muted-foreground">Time to first acknowledge the request</p>
            </div>
            <div className="space-y-2">
              <Label>Resolution Time <span className="text-red-500">*</span></Label>
              <div className="flex items-center gap-2">
                <Input type="number" value={props.resolutionTime} onChange={(e) => props.setResolutionTime(e.target.value)} min="1" className="w-24" />
                <span className="text-sm text-muted-foreground">hours</span>
              </div>
              <p className="text-xs text-muted-foreground">Time to complete the request</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

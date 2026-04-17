"use client";

import { useTasheelStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RotateCcw, Download } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";

export default function SettingsPage() {
  const resetToDefaults = useTasheelStore((s) => s.resetToDefaults);
  const workspaceSettings = useTasheelStore((s) => s.workspaceSettings);
  const setWorkspaceSettings = useTasheelStore((s) => s.setWorkspaceSettings);
  const [confirmText, setConfirmText] = useState("");
  const [showReset, setShowReset] = useState(false);

  function handleReset() {
    resetToDefaults();
    localStorage.removeItem("tasheel-store");
    toast.success("All data reset to defaults");
    setShowReset(false);
    setConfirmText("");
    window.location.reload();
  }

  function handleExport() {
    const data = localStorage.getItem("tasheel-store");
    if (!data) return;
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasheel-data.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Settings"
        description="Workspace preferences are saved in your browser with the rest of the demo data. Ticket prefix applies to new requests only."
      />

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm">General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="platform-name">Platform Name</Label>
            <Input
              id="platform-name"
              value={workspaceSettings.platformName}
              onChange={(e) =>
                setWorkspaceSettings({ platformName: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ticket-prefix">Ticket Prefix</Label>
              <Input
                id="ticket-prefix"
                value={workspaceSettings.ticketPrefix}
                onChange={(e) =>
                  setWorkspaceSettings({ ticketPrefix: e.target.value })
                }
                maxLength={12}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-sla">Default Response SLA (hours)</Label>
              <Input
                id="default-sla"
                type="number"
                min={1}
                value={workspaceSettings.defaultResponseSlaHours}
                onChange={(e) => {
                  const n = parseInt(e.target.value, 10);
                  if (!Number.isNaN(n) && n >= 1) {
                    setWorkspaceSettings({ defaultResponseSlaHours: n });
                  }
                }}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Default response SLA is stored for reference; individual services
            keep their own SLA until you align them in the service studio.
          </p>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm">Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Export or import platform data. Useful for backup or resetting the
            demo.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="gap-1.5"
            >
              <Download className="h-4 w-4" /> Export Data
            </Button>
          </div>

          <Separator />

          <div>
            <h4 className="mb-2 text-sm font-medium text-red-600">
              Danger Zone
            </h4>
            <p className="mb-3 text-xs text-muted-foreground">
              Reset all services, workflows, requests, and workspace settings to
              their default demo state. This cannot be undone.
            </p>
            <Dialog open={showReset} onOpenChange={setShowReset}>
              <DialogTrigger
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <RotateCcw className="h-4 w-4" /> Reset to Default Data
                  </Button>
                }
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset All Data?</DialogTitle>
                  <DialogDescription>
                    This will reset all services, workflows, and requests to
                    their default state. Type &ldquo;RESET&rdquo; to confirm.
                  </DialogDescription>
                </DialogHeader>
                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder='Type "RESET" to confirm'
                />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowReset(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleReset}
                    disabled={confirmText !== "RESET"}
                  >
                    Reset Everything
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

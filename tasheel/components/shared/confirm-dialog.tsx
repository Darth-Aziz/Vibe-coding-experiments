"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  confirmVariant?: "default" | "destructive";
  requireTyping?: string;
}

export function ConfirmDialog({
  open, onClose, onConfirm, title, description,
  confirmLabel = "Confirm", confirmVariant = "default", requireTyping,
}: ConfirmDialogProps) {
  const [typed, setTyped] = useState("");

  const canConfirm = requireTyping ? typed === requireTyping : true;

  function handleConfirm() {
    onConfirm();
    setTyped("");
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onClose(); setTyped(""); } }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {requireTyping && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Type <span className="font-mono font-bold text-foreground">{requireTyping}</span> to confirm:
            </p>
            <Input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder={requireTyping} />
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => { onClose(); setTyped(""); }}>Cancel</Button>
          <Button variant={confirmVariant} onClick={handleConfirm} disabled={!canConfirm}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

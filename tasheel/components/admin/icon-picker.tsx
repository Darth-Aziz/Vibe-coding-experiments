"use client";

import {
  Laptop,
  AppWindow,
  Shield,
  UserPlus,
  CalendarDays,
  DoorOpen,
  Wrench,
  FileText,
  Mail,
  Phone,
  CreditCard,
  Printer,
  Wifi,
  Key,
  HardDrive,
  Headphones,
} from "lucide-react";
import { cn } from "@/lib/utils";

const icons = [
  { name: "Laptop", icon: Laptop },
  { name: "AppWindow", icon: AppWindow },
  { name: "Shield", icon: Shield },
  { name: "UserPlus", icon: UserPlus },
  { name: "CalendarDays", icon: CalendarDays },
  { name: "DoorOpen", icon: DoorOpen },
  { name: "Wrench", icon: Wrench },
  { name: "FileText", icon: FileText },
  { name: "Mail", icon: Mail },
  { name: "Phone", icon: Phone },
  { name: "CreditCard", icon: CreditCard },
  { name: "Printer", icon: Printer },
  { name: "Wifi", icon: Wifi },
  { name: "Key", icon: Key },
  { name: "HardDrive", icon: HardDrive },
  { name: "Headphones", icon: Headphones },
];

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <div className="grid grid-cols-8 gap-2">
      {icons.map(({ name, icon: Icon }) => (
        <button
          key={name}
          type="button"
          onClick={() => onChange(name)}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg border transition-all",
            value === name
              ? "border-blue-600 bg-blue-50 text-blue-600 ring-2 ring-blue-200"
              : "border-border text-muted-foreground hover:border-border hover:bg-muted"
          )}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}

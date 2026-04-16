"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Shield, User } from "lucide-react";
import Link from "next/link";

const portals = [
  {
    href: "/admin",
    label: "Admin Portal",
    description: "Create services, build forms, and design workflows",
    icon: Shield,
    color: "text-blue-600",
    bg: "bg-blue-50 hover:bg-blue-100",
  },
  {
    href: "/requester",
    label: "Requester Portal",
    description: "Browse services, submit requests, and track status",
    icon: User,
    color: "text-emerald-600",
    bg: "bg-emerald-50 hover:bg-emerald-100",
  },
];

export function PortalSelector() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {portals.map((portal) => (
        <Link key={portal.href} href={portal.href}>
          <Card className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <div className={`rounded-xl p-4 ${portal.bg}`}>
                <portal.icon className={`h-8 w-8 ${portal.color}`} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {portal.label}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {portal.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

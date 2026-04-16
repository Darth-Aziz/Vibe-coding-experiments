import Link from "next/link";
import { Shield, User, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const portals = [
    {
      href: "/admin",
      icon: Shield,
      label: "Admin Portal",
      description: "Manage services, workflows & forms",
      iconWrap: "bg-foreground",
      iconClass: "text-background",
    },
    {
      href: "/requester",
      icon: User,
      label: "Requester Portal",
      description: "Browse services, submit requests",
      iconWrap: "bg-primary",
      iconClass: "text-primary-foreground",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted p-8 font-sans">
      <div className="text-center">
        <h1 className="text-[30px] font-bold leading-tight text-foreground">Tasheel</h1>
        <p className="mt-2 text-sm text-muted-foreground">Service Management Platform</p>

        <div className="mt-10 flex gap-6">
          {portals.map((p) => (
            <Link key={p.href} href={p.href}>
              <div className="group w-64 cursor-pointer rounded-xl border border-border bg-card p-6 text-left shadow-sm transition-all hover:border-border hover:shadow-md">
                <div
                  className={cn(
                    "mb-4 flex h-10 w-10 items-center justify-center rounded-lg",
                    p.iconWrap
                  )}
                >
                  <p.icon className={cn("h-5 w-5", p.iconClass)} strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-semibold text-foreground">{p.label}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary transition-all group-hover:gap-2.5">
                  Enter <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

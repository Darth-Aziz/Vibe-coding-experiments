import Link from "next/link";
import { Shield, User, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { TasheelLogo } from "@/components/shared/tasheel-logo";

export default function HomePage() {
  const portals = [
    {
      href: "/admin",
      icon: Shield,
      label: "Admin Portal",
      description: "Publish services, build forms, and design approval workflows.",
      iconWrap: "bg-slate-900 text-white",
    },
    {
      href: "/requester",
      icon: User,
      label: "Requester Portal",
      description: "Browse the catalog, submit requests, and track every ticket.",
      iconWrap: "bg-primary text-primary-foreground",
    },
  ];

  return (
    <main className="relative flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-background to-muted/40 font-sans">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/[0.06] to-transparent" />
      <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-16 sm:px-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
          Service management demo
        </div>
        <div className="flex flex-col items-center text-center">
          <TasheelLogo
            size={48}
            variant="light"
            animated
            className="mb-4"
            aria-hidden
          />
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Tasheel
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            تسهيل · Enterprise-style catalog, forms, and workflows
          </p>
        </div>

        <div className="mt-12 grid w-full max-w-lg gap-4 sm:max-w-2xl sm:grid-cols-2 sm:gap-6">
          {portals.map((p) => (
            <Link key={p.href} href={p.href} className="group block h-full">
              <div
                className={cn(
                  "flex h-full cursor-pointer flex-col rounded-lg border border-border bg-card p-6 text-left shadow-sm transition-all",
                  "hover:border-primary/25 hover:shadow-md",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                )}
              >
                <div
                  className={cn(
                    "mb-4 flex h-10 w-10 items-center justify-center rounded-lg shadow-sm",
                    p.iconWrap
                  )}
                >
                  <p.icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                </div>
                <h2 className="text-base font-semibold text-foreground">
                  {p.label}
                </h2>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
                <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-primary transition-all group-hover:gap-2.5">
                  Enter portal
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-14 max-w-md text-center text-xs leading-relaxed text-muted-foreground">
          Data is stored in your browser for this demo. Use{" "}
          <span className="font-medium text-foreground">Admin → Settings</span>{" "}
          to export or reset.
        </p>
      </div>
    </main>
  );
}

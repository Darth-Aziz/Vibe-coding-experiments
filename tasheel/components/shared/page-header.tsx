import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type PageHeaderBreadcrumbItem = { label: string; href?: string };

type PageHeaderProps = {
  title: string;
  description?: string;
  breadcrumb?: PageHeaderBreadcrumbItem[];
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  breadcrumb,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="min-w-0 space-y-2">
        {breadcrumb && breadcrumb.length > 0 ? (
          <nav
            className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground"
            aria-label="Breadcrumb"
          >
            {breadcrumb.map((item, i) => (
              <span key={`${item.label}-${i}`} className="flex items-center gap-1">
                {i > 0 ? (
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />
                ) : null}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      "font-medium",
                      i === breadcrumb.length - 1
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        ) : null}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

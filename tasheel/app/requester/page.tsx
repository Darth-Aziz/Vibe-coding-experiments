"use client";

import { useTasheelStore } from "@/lib/store";
import { SearchBar } from "@/components/shared/search-bar";
import Link from "next/link";
import { useState } from "react";
import { cn, formatSlaSummary, resolveServiceVisibility } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

function getIcon(name: string): LucideIcon {
  const icons = LucideIcons as unknown as Record<string, LucideIcon>;
  return icons[name] || LucideIcons.FileText;
}

const categoryLabels: Record<string, string> = {
  all: "All",
  it: "IT Support",
  hr: "HR",
  facilities: "Facilities",
  finance: "Finance",
  general: "General",
};

export default function ServiceCatalogPage() {
  const services = useTasheelStore((s) => s.services);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const published = services.filter((s) => s.status === "published");
  const catalogServices = published.filter(
    (s) => resolveServiceVisibility(s.visibility) === "public"
  );
  const filtered = catalogServices.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const availableCategories = ["all", ...new Set(catalogServices.map((s) => s.category))];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Service catalog"
        description="Published, public services you can request. Filters apply to the cards below."
        actions={
          <div className="w-full min-w-0 sm:w-64">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search services…"
            />
          </div>
        }
      />

      <div className="flex flex-wrap gap-1">
        {availableCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={cn(
              "cursor-pointer rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
              categoryFilter === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {categoryLabels[cat] || cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((service) => {
          const Icon = getIcon(service.icon);
          return (
            <Link
              key={service.id}
              href={`/requester/services/${service.id}`}
              className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="flex h-full cursor-pointer flex-col rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h2 className="mt-4 text-base font-semibold text-foreground">
                  {service.name}
                </h2>
                <p className="mt-1 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <p className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground/80">
                    {categoryLabels[service.category] || service.category}
                  </span>
                  <span className="text-muted-foreground/70"> · </span>
                  {formatSlaSummary(service.sla)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <EmptyState
          icon={LucideIcons.Layers}
          title="Nothing to show yet"
          description={
            catalogServices.length === 0
              ? "There are no published public services. An admin can publish a service from the studio."
              : "Try another category or clear your search."
          }
        />
      )}
    </div>
  );
}

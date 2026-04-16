"use client";

import { useTasheelStore } from "@/lib/store";
import { SearchBar } from "@/components/shared/search-bar";
import Link from "next/link";
import { useState } from "react";
import { cn, formatSlaSummary, resolveServiceVisibility } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Service Catalog
        </h1>
        <div className="relative w-64 max-w-full">
          <SearchBar value={search} onChange={setSearch} placeholder="Search services..." />
        </div>
      </div>

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
            <Link key={service.id} href={`/requester/services/${service.id}`}>
              <div className="flex h-full cursor-pointer flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-border hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                  <Icon className="h-5 w-5 text-accent-foreground" />
                </div>
                <h3 className="mt-3 text-base font-semibold text-foreground">
                  {service.name}
                </h3>
                <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted-foreground">
                  {service.description}
                </p>
                <p className="mt-3 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                  {service.category.toUpperCase()} · {formatSlaSummary(service.sla)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm text-muted-foreground">No services available</p>
          <p className="mt-1 text-xs text-muted-foreground/80">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}

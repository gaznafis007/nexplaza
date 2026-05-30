"use client";

import { useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { useProductFilters } from "@/hooks/useProductFilters";
import type { SortOrder } from "@/types/api";

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function SortDropdown() {
  const { filters, updateFilters } = useProductFilters();

  const handleChange = useCallback(
    (sort: SortOrder) => {
      updateFilters({ sort });
    },
    [updateFilters],
  );

  return (
    <div className="relative">
      <label htmlFor="sort" className="sr-only">
        Sort products
      </label>
      <select
        id="sort"
        value={filters.sort}
        onChange={(event) => handleChange(event.target.value as SortOrder)}
        className="h-9 appearance-none rounded-lg border border-border/80 bg-surface pl-3 pr-9 text-sm text-foreground transition hover:border-foreground/20"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        aria-hidden
      />
    </div>
  );
}

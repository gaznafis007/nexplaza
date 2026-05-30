"use client";

import { useCallback } from "react";
import { useProductFilters } from "@/hooks/useProductFilters";
import type { AvailabilityFilter } from "@/types/api";

const inputClass =
  "h-9 w-full rounded-lg border border-border/80 bg-background px-3 text-sm text-foreground placeholder:text-muted/60 transition focus:border-foreground/30";

export function FilterPanel() {
  const { filters, updateFilters, resetFilters } = useProductFilters();

  const handleAvailabilityChange = useCallback(
    (availability: AvailabilityFilter) => {
      updateFilters({ availability });
    },
    [updateFilters],
  );

  return (
    <div className="space-y-5 rounded-xl bg-surface p-5 ring-1 ring-border/80">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted">
          Filters
        </h2>
        <button
          type="button"
          onClick={resetFilters}
          className="text-xs text-muted transition hover:text-foreground"
        >
          Clear
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="minPrice" className="text-xs text-muted">
            Min price
          </label>
          <input
            id="minPrice"
            type="number"
            min={0}
            value={filters.minPrice ?? ""}
            onChange={(event) =>
              updateFilters({
                minPrice: event.target.value ? Number(event.target.value) : null,
              })
            }
            className={inputClass}
            placeholder="৳0"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="maxPrice" className="text-xs text-muted">
            Max price
          </label>
          <input
            id="maxPrice"
            type="number"
            min={0}
            value={filters.maxPrice ?? ""}
            onChange={(event) =>
              updateFilters({
                maxPrice: event.target.value ? Number(event.target.value) : null,
              })
            }
            className={inputClass}
            placeholder="Any"
          />
        </div>

        <fieldset className="space-y-2">
          <legend className="text-xs text-muted">Availability</legend>
          <div className="flex flex-col gap-1.5">
            {(
              [
                ["all", "All"],
                ["in-stock", "In stock"],
                ["out-of-stock", "Out of stock"],
              ] as const
            ).map(([value, label]) => {
              const isActive = filters.availability === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleAvailabilityChange(value)}
                  className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                    isActive
                      ? "bg-foreground text-background"
                      : "text-muted hover:bg-background hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

export type TabItem = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  items: TabItem[];
};

export function Tabs({ items }: TabsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  if (items.length === 0) {
    return null;
  }

  const activeItem = items.find((item) => item.id === activeId) ?? items[0];

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label="Product information"
        className="flex flex-wrap gap-1"
      >
        {items.map((item) => {
          const isActive = item.id === activeItem.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(item.id)}
              className={`rounded-lg px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-foreground text-background"
                  : "text-muted hover:bg-background hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel">{activeItem.content}</div>
    </div>
  );
}

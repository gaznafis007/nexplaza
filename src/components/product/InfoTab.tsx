import type { AttributeSection } from "@/types/product";

type InfoTabProps = {
  section: AttributeSection;
};

export function InfoTabSection({ section }: InfoTabProps) {
  if (!section || section.length === 0) {
    return null;
  }

  return (
    <dl className="divide-y divide-border/80">
      {section.map((item) => (
        <div
          key={item.enLabel}
          className="grid gap-1 py-4 sm:grid-cols-[160px_1fr] sm:gap-6"
        >
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">
            {item.enLabel}
          </dt>
          <dd className="text-sm leading-relaxed text-foreground">
            {item.values.map((value) => value.enName).join(", ")}
          </dd>
        </div>
      ))}
    </dl>
  );
}

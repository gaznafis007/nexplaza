import { PackageOpen } from "lucide-react";

type EmptyStateProps = {
  title?: string;
  description?: string;
};

export function EmptyState({
  title = "Nothing here yet",
  description = "Try adjusting your filters or check back later.",
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-xl bg-surface px-6 py-12 text-center ring-1 ring-border/80">
      <PackageOpen className="h-8 w-8 text-muted/60" strokeWidth={1.5} aria-hidden />
      <div className="space-y-1">
        <h2 className="text-sm font-medium text-foreground">{title}</h2>
        <p className="max-w-sm text-sm text-muted">{description}</p>
      </div>
    </div>
  );
}

type StockBadgeProps = {
  inStock: boolean;
};

export function StockBadge({ inStock }: StockBadgeProps) {
  return (
    <span
      className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
        inStock
          ? "bg-background text-foreground ring-1 ring-border/80"
          : "bg-background text-muted ring-1 ring-border/80"
      }`}
    >
      {inStock ? "In stock" : "Sold out"}
    </span>
  );
}

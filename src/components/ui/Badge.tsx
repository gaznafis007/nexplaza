type BadgeProps = {
  children: React.ReactNode;
  variant?: "discount" | "neutral";
};

export function Badge({ children, variant = "discount" }: BadgeProps) {
  const styles =
    variant === "discount"
      ? "bg-background text-foreground ring-1 ring-border/80"
      : "bg-background text-muted ring-1 ring-border/80";

  return (
    <span
      className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${styles}`}
    >
      {children}
    </span>
  );
}

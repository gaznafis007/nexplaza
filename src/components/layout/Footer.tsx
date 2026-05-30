export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} Walton Hi-Tech Industries PLC</p>
        <p className="text-muted/80">NexPlaza — Walton Plaza catalog</p>
      </div>
    </footer>
  );
}

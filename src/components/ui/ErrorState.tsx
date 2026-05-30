import { AlertCircle } from "lucide-react";

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = "Something went wrong",
  message = "We could not load the requested data. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-xl bg-surface px-6 py-10 text-center ring-1 ring-border/80">
      <AlertCircle className="h-8 w-8 text-muted" strokeWidth={1.5} aria-hidden />
      <div className="space-y-1">
        <h2 className="text-sm font-medium text-foreground">{title}</h2>
        <p className="max-w-md text-sm text-muted">{message}</p>
      </div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="h-9 rounded-lg bg-foreground px-4 text-sm font-medium text-background transition hover:opacity-90"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}

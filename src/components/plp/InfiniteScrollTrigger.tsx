"use client";

import { useEffect, useRef } from "react";

type InfiniteScrollTriggerProps = {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
};

export function InfiniteScrollTrigger({
  onLoadMore,
  hasMore,
  isLoading,
}: InfiniteScrollTriggerProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const onLoadMoreRef = useRef(onLoadMore);
  const isLoadingRef = useRef(isLoading);

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
    isLoadingRef.current = isLoading;
  }, [onLoadMore, isLoading]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && !isLoadingRef.current) {
          onLoadMoreRef.current();
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore]);

  if (!hasMore) {
    return null;
  }

  return (
    <div ref={sentinelRef} className="py-6 text-center text-xs text-muted">
      {isLoading ? "Loading…" : "Scroll for more"}
    </div>
  );
}

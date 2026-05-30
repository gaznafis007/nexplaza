"use client";

import Link from "next/link";
import { useState } from "react";
import { CartBadge } from "@/components/cart/CartBadge";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function Header() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/products"
            className="text-[15px] font-semibold tracking-tight text-foreground"
          >
            NexPlaza
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              href="/products"
              className="rounded-lg px-3 py-1.5 text-sm text-muted transition hover:bg-background hover:text-foreground"
            >
              Products
            </Link>
            <CartBadge onClick={() => setCartOpen(true)} />
          </nav>
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

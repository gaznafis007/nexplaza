"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { PricingDisplay } from "@/components/product/PricingDisplay";
import { StockBadge } from "@/components/product/StockBadge";
import { getProductImageUrl } from "@/lib/image";
import { getPrimaryVariant, isProductInStock } from "@/lib/price";
import type { ProductListItem } from "@/types/product";

type ProductCardProps = {
  product: ProductListItem;
};

function ProductCardComponent({ product }: ProductCardProps) {
  const primaryVariant = getPrimaryVariant(product.variants);
  const imageUrl = getProductImageUrl(product.images);
  const inStock = isProductInStock(product.variants);

  if (!primaryVariant) {
    return null;
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-surface ring-1 ring-border/80 transition duration-300 hover:ring-foreground/20">
      <Link
        href={`/products/${product.uid}`}
        className="relative block aspect-[4/3] overflow-hidden bg-background"
      >
        <Image
          src={imageUrl}
          alt={product.enName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
          unoptimized
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/products/${product.uid}`} className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground transition group-hover:text-muted">
              {product.enName}
            </h3>
          </Link>
          <StockBadge inStock={inStock} />
        </div>

        <PricingDisplay variant={primaryVariant} size="sm" />

        <AddToCartButton
          payload={{ product, variant: primaryVariant }}
          disabled={!inStock}
          className="mt-auto w-full"
          compact
        />
      </div>
    </article>
  );
}

export const ProductCard = memo(ProductCardComponent);

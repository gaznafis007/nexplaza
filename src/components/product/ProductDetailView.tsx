"use client";

import { useMemo, useState } from "react";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { InfoTabSection } from "@/components/product/InfoTab";
import { PricingDisplay } from "@/components/product/PricingDisplay";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { StockBadge } from "@/components/product/StockBadge";
import { VariantSelector } from "@/components/product/VariantSelector";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { isVariantInStock } from "@/lib/price";
import type { AttributeSection, Product } from "@/types/product";

function buildTabItems(product: Product): TabItem[] {
  const sections: { id: string; label: string; data: AttributeSection }[] = [
    { id: "basic", label: "Overview", data: product.productAttributes },
    { id: "detailed", label: "Details", data: product.detailedDescriptions },
    { id: "terms", label: "Terms", data: product.deliveries },
    { id: "warranty", label: "Warranty", data: product.serviceAndDeliveries },
    { id: "features", label: "Features", data: product.priceAndStocks },
  ];

  return sections
    .filter((section) => section.data && section.data.length > 0)
    .map((section) => ({
      id: section.id,
      label: section.label,
      content: <InfoTabSection section={section.data} />,
    }));
}

type ProductDetailViewProps = {
  product: Product;
};

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const defaultVariant =
    product.variants.find((variant) => variant.quantity > 0) ??
    product.variants[0];

  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
  const tabItems = useMemo(() => buildTabItems(product), [product]);

  if (!selectedVariant) {
    return null;
  }

  const inStock = isVariantInStock(selectedVariant);

  return (
    <div className="space-y-12">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductImageGallery
          images={product.images}
          productName={product.enName}
        />

        <div className="flex flex-col gap-6 lg:py-2">
          <div className="space-y-3">
            <StockBadge inStock={inStock} />
            <h1 className="text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
              {product.enName}
            </h1>
          </div>

          <PricingDisplay variant={selectedVariant} size="lg" />

          <VariantSelector
            variants={product.variants}
            selectedVariant={selectedVariant}
            onSelect={setSelectedVariant}
          />

          <AddToCartButton
            payload={{ product, variant: selectedVariant }}
            disabled={!inStock}
            className="w-full max-w-xs"
          />
        </div>
      </div>

      {tabItems.length > 0 ? (
        <div className="border-t border-border/80 pt-10">
          <Tabs items={tabItems} />
        </div>
      ) : null}
    </div>
  );
}

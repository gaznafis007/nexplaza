"use client";

import Image from "next/image";
import { PLACEHOLDER_IMAGE } from "@/lib/image";
import type { ProductImage } from "@/types/product";

type ProductImageGalleryProps = {
  images: ProductImage[];
  productName: string;
};

export function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const galleryImages = images.length > 0 ? images : [{ url: PLACEHOLDER_IMAGE }];
  const activeImage = galleryImages[0];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-background ring-1 ring-border/80">
        <Image
          src={activeImage.url}
          alt={productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          unoptimized
        />
      </div>

      {galleryImages.length > 1 ? (
        <div className="grid grid-cols-4 gap-2">
          {galleryImages.slice(0, 4).map((image, index) => (
            <div
              key={`${image.url}-${index}`}
              className="relative aspect-square overflow-hidden rounded-lg bg-background ring-1 ring-border/80"
            >
              <Image
                src={image.url}
                alt={`${productName} ${index + 1}`}
                fill
                sizes="120px"
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

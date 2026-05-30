export type ProductImage = {
  url: string;
};

export type Discount = {
  amount: number;
  value: number;
  type: string;
};

export type Variant = {
  mrpPrice: number;
  ebsItemCode: string;
  posItemCode: string;
  quantity: number;
  discount: Discount | null;
};

export type AttributeValue = {
  enName: string;
};

export type AttributeItem = {
  enLabel: string;
  values: AttributeValue[];
};

export type AttributeSection = AttributeItem[] | null;

export type Product = {
  uid: string;
  enName: string;
  images: ProductImage[];
  productAttributes: AttributeSection;
  detailedDescriptions: AttributeSection;
  deliveries: AttributeSection;
  serviceAndDeliveries: AttributeSection;
  priceAndStocks: AttributeSection;
  variants: Variant[];
};

export type ProductListItem = Pick<
  Product,
  "uid" | "enName" | "images" | "variants"
>;

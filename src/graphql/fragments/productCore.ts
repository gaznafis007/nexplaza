export const PRODUCT_CORE_FRAGMENT = `
  uid
  enName
  images {
    url
  }
`;

export const VARIANT_FIELDS_FRAGMENT = `
  mrpPrice
  ebsItemCode
  posItemCode
  quantity
  discount {
    amount
    value
    type
  }
`;

export const ATTRIBUTE_SECTION_FRAGMENT = `
  enLabel
  values {
    enName
  }
`;

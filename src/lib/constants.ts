export const PRODUCT_CATEGORIES = [
  "美妝保養",
  "時尚配件",
  "家用電器",
  "居家生活",
  "3C產品",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

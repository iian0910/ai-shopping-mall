export const PRODUCT_CATEGORIES = [
  "小兔子",
  "猴子",
  "大象",
  "海豚",
  "海龜",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

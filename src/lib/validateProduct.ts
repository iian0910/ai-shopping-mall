import { PRODUCT_CATEGORIES, type ProductCategory } from "@/lib/constants";

export type ProductInput = {
  name: string;
  price: number;
  images: string[];
  description?: string;
  quantity: number;
  category: ProductCategory;
};

export function parseProductInput(
  body: unknown
): { success: true; data: ProductInput } | { success: false; error: string } {
  const { name, price, images, description, quantity, category } = (body ?? {}) as {
    name?: string;
    price?: number;
    images?: string[];
    description?: string;
    quantity?: number;
    category?: string;
  };

  if (!name || typeof name !== "string") {
    return { success: false, error: "品名為必填欄位" };
  }
  if (price === undefined || typeof price !== "number" || Number.isNaN(price)) {
    return { success: false, error: "價格為必填欄位" };
  }
  if (images && (!Array.isArray(images) || images.length > 6)) {
    return { success: false, error: "產品圖最多只能上傳 6 張" };
  }
  if (description && description.length > 500) {
    return { success: false, error: "商品描述最多 500 字" };
  }
  if (
    quantity === undefined ||
    typeof quantity !== "number" ||
    Number.isNaN(quantity) ||
    quantity < 0
  ) {
    return { success: false, error: "商品數量為必填欄位，且不可為負數" };
  }
  if (!category || !PRODUCT_CATEGORIES.includes(category as ProductCategory)) {
    return { success: false, error: "請選擇正確的商品分類" };
  }

  return {
    success: true,
    data: {
      name,
      price,
      images: images ?? [],
      description,
      quantity,
      category: category as ProductCategory,
    },
  };
}

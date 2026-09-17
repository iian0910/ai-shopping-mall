import { connectToDatabase } from "@/lib/mongodb";
import { Product, type IProduct } from "@/models/Product";
import { PRODUCT_CATEGORIES, type ProductCategory } from "@/lib/constants";

export const PRODUCTS_PAGE_SIZE = 12;

export type ProductListParams = {
  category?: string;
  page?: number;
  limit?: number;
};

export type ProductListResult = {
  products: IProduct[];
  total: number;
  page: number;
  totalPages: number;
  category: ProductCategory | null;
};

export function isProductCategory(value: string | undefined): value is ProductCategory {
  return !!value && (PRODUCT_CATEGORIES as readonly string[]).includes(value);
}

export async function getProducts({
  category,
  page = 1,
  limit = PRODUCTS_PAGE_SIZE,
}: ProductListParams = {}): Promise<ProductListResult> {
  await connectToDatabase();

  const normalizedCategory = isProductCategory(category) ? category : null;
  const filter = normalizedCategory ? { category: normalizedCategory } : {};

  const total = await Product.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * limit)
    .limit(limit)
    .lean<IProduct[]>();

  return {
    products,
    total,
    page: currentPage,
    totalPages,
    category: normalizedCategory,
  };
}

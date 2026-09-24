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

// 熱門商品：依熱門度百分比由高到低排序，同分時以較新上架的商品優先。
export async function getPopularProducts(limit = 4): Promise<IProduct[]> {
  await connectToDatabase();

  return Product.find({})
    .sort({ popularity: -1, createdAt: -1 })
    .limit(limit)
    .lean<IProduct[]>();
}

// 台灣固定 UTC+8、無日光節約時間，直接用位移計算即可，不受伺服器時區影響。
const TAIPEI_OFFSET_MS = 8 * 60 * 60 * 1000;

function getTaipeiStartOfMonth(now = new Date()): Date {
  const taipeiNow = new Date(now.getTime() + TAIPEI_OFFSET_MS);
  const startUtc = Date.UTC(taipeiNow.getUTCFullYear(), taipeiNow.getUTCMonth(), 1);
  return new Date(startUtc - TAIPEI_OFFSET_MS);
}

// 本月新品：只取本月 1 日（台灣時間）之後上架的商品，依上架時間由新到舊排序。
export async function getNewArrivals(limit = 4): Promise<IProduct[]> {
  await connectToDatabase();

  const startOfMonth = getTaipeiStartOfMonth();

  return Product.find({ createdAt: { $gte: startOfMonth } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean<IProduct[]>();
}

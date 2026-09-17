import Link from "next/link";
import { getProducts, isProductCategory, PRODUCTS_PAGE_SIZE } from "@/lib/products";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { formatNumber } from "@/lib/format";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

function buildHref(category: string | null, page: number) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/products?${query}` : "/products";
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const { category: categoryParam, page: pageParam } = await searchParams;
  const requestedPage = Math.max(1, Number(pageParam) || 1);
  const activeCategory = isProductCategory(categoryParam) ? categoryParam : null;

  const { products, total, page, totalPages } = await getProducts({
    category: activeCategory ?? undefined,
    page: requestedPage,
  });

  const startIndex = total === 0 ? 0 : (page - 1) * PRODUCTS_PAGE_SIZE + 1;
  const endIndex = total === 0 ? 0 : startIndex + products.length - 1;

  return (
    <div className="mx-auto w-full max-w-[1120px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">所有商品</h1>
        <p className="mt-1 text-sm text-zinc-500">
          <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-300">
            首頁
          </Link>{" "}
          / 商品
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[240px_minmax(0,1fr)]">
        <aside>
          <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">商品分類</h2>
          <ul className="space-y-1 text-sm">
            <li>
              <Link
                href={buildHref(null, 1)}
                className={`block rounded-md px-2 py-1.5 ${
                  activeCategory === null
                    ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                全部商品
              </Link>
            </li>
            {PRODUCT_CATEGORIES.map((category) => (
              <li key={category}>
                <Link
                  href={buildHref(category, 1)}
                  className={`block rounded-md px-2 py-1.5 ${
                    activeCategory === category
                      ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                      : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div>
          {total > 0 && (
            <div className="mb-6 flex items-center justify-between text-sm text-zinc-500">
              <p>
                顯示第 {startIndex}-{endIndex} 筆，共 {formatNumber(total)} 筆
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={String(product._id)} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <p className="py-12 text-center text-sm text-zinc-500">
              目前沒有符合條件的商品。
            </p>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <Link
                href={buildHref(activeCategory, page - 1)}
                aria-disabled={page <= 1}
                className={`rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium dark:border-zinc-700 ${
                  page <= 1
                    ? "pointer-events-none opacity-40"
                    : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                }`}
              >
                上一頁
              </Link>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={buildHref(activeCategory, p)}
                  className={`rounded-md border px-3 py-1.5 text-sm font-medium ${
                    p === page
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                      : "border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  }`}
                >
                  {p}
                </Link>
              ))}

              <Link
                href={buildHref(activeCategory, page + 1)}
                aria-disabled={page >= totalPages}
                className={`rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium dark:border-zinc-700 ${
                  page >= totalPages
                    ? "pointer-events-none opacity-40"
                    : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                }`}
              >
                下一頁
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

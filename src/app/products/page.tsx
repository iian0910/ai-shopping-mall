import Link from "next/link";
import { getProducts, isProductCategory, PRODUCTS_PAGE_SIZE } from "@/lib/products";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { formatNumber } from "@/lib/format";
import ProductCard from "@/components/ProductCard";
import HeartIcon from "@/components/HeartIcon";

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
    <div className="relative mx-auto w-full max-w-[1120px] overflow-hidden px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="pointer-events-none absolute -right-16 -top-10 h-44 w-44 rounded-full bg-support/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative mb-10">
        <h1 className="flex items-center gap-2 text-3xl font-semibold text-slate-900 dark:text-slate-50">
          <HeartIcon className="h-6 w-6 text-accent" />
          所有商品
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-700 dark:hover:text-slate-300">
            首頁
          </Link>{" "}
          / 商品
        </p>
      </div>

      <div className="relative grid grid-cols-1 gap-10 md:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="h-fit rounded-[1.75rem] bg-white/70 p-4 shadow-sm ring-1 ring-primary/15 dark:bg-slate-900/60 dark:ring-slate-800">
          <h2 className="mb-3 px-2 text-sm font-semibold text-slate-900 dark:text-slate-50">商品分類</h2>
          <ul className="space-y-1 text-sm">
            <li>
              <Link
                href={buildHref(null, 1)}
                className={`block rounded-full px-3 py-1.5 transition ${
                  activeCategory === null
                    ? "bg-accent font-semibold text-accent-content shadow-sm"
                    : "text-slate-600 hover:-translate-y-0.5 hover:bg-primary/30 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                全部商品
              </Link>
            </li>
            {PRODUCT_CATEGORIES.map((category) => (
              <li key={category}>
                <Link
                  href={buildHref(category, 1)}
                  className={`block rounded-full px-3 py-1.5 transition ${
                    activeCategory === category
                      ? "bg-accent font-semibold text-accent-content shadow-sm"
                      : "text-slate-600 hover:-translate-y-0.5 hover:bg-primary/30 dark:text-slate-300 dark:hover:bg-slate-800"
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
            <div className="mb-6 flex items-center justify-between text-sm text-slate-500">
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
            <p className="flex flex-col items-center gap-2 py-12 text-center text-sm text-slate-500">
              <HeartIcon className="h-6 w-6 text-primary" />
              目前沒有符合條件的商品。
            </p>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <Link
                href={buildHref(activeCategory, page - 1)}
                aria-disabled={page <= 1}
                className={`rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium transition dark:border-slate-700 ${
                  page <= 1
                    ? "pointer-events-none opacity-40"
                    : "text-slate-700 hover:-translate-y-0.5 hover:bg-primary/30 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                上一頁
              </Link>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={buildHref(activeCategory, p)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                    p === page
                      ? "border-accent bg-accent text-accent-content shadow-sm"
                      : "border-slate-300 text-slate-700 hover:-translate-y-0.5 hover:bg-primary/30 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  {p}
                </Link>
              ))}

              <Link
                href={buildHref(activeCategory, page + 1)}
                aria-disabled={page >= totalPages}
                className={`rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium transition dark:border-slate-700 ${
                  page >= totalPages
                    ? "pointer-events-none opacity-40"
                    : "text-slate-700 hover:-translate-y-0.5 hover:bg-primary/30 dark:text-slate-200 dark:hover:bg-slate-800"
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

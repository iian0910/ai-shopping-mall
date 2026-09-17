import Link from "next/link";
import { getProducts } from "@/lib/products";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

const VALUE_PROPS = [
  {
    title: "分類齊全",
    description: "多元商品分類，快速找到你想要的商品。",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75h6v6h-6v-6ZM14.25 3.75h6v6h-6v-6ZM3.75 14.25h6v6h-6v-6ZM14.25 14.25h6v6h-6v-6Z" />
      </svg>
    ),
  },
  {
    title: "即時更新",
    description: "後台管理即時同步商品資訊與庫存狀態。",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
  },
  {
    title: "簡單瀏覽",
    description: "直覺化的商品頁面設計，輕鬆比較商品內容。",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
];

export default async function Home() {
  const { products: featuredProducts } = await getProducts({ limit: 4 });

  return (
    <div>
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            AI Shopping Mall
          </Link>
          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300 sm:flex">
              <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-50">
                首頁
              </Link>
              <Link href="/products" className="hover:text-zinc-900 dark:hover:text-zinc-50">
                所有商品
              </Link>
            </nav>
            <span
              aria-label="購物車"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 dark:border-zinc-700 dark:text-zinc-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.98-4.804 2.545-7.454a1.125 1.125 0 0 0-1.11-1.36H5.106M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
            </span>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-amber-200/60 blur-3xl dark:bg-amber-500/10" />
        <div className="pointer-events-none absolute -bottom-20 right-24 h-56 w-56 rounded-full bg-orange-300/40 blur-3xl dark:bg-orange-500/10" />

        <div className="relative mx-auto w-full max-w-[1120px] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <span className="inline-block rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-600/20 dark:bg-zinc-800/70 dark:text-amber-400">
            歡迎光臨
          </span>
          <h1 className="mt-4 max-w-xl text-4xl font-bold leading-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            簡單購物，
            <br />
            從瀏覽開始
          </h1>
          <p className="mt-4 max-w-md text-base text-zinc-600 dark:text-zinc-300">
            精心分類的商品目錄，搭配直覺的頁面設計，讓你快速找到喜歡的商品。
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-amber-300"
          >
            查看所有商品
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1120px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {VALUE_PROPS.map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-zinc-800 dark:text-amber-400">
                {item.icon}
              </div>
              <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1120px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">精選商品</h2>
          <Link
            href="/products"
            className="text-sm font-medium text-amber-600 hover:text-amber-500 dark:text-amber-400"
          >
            查看全部 →
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={String(product._id)} product={product} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-zinc-500">目前尚無上架商品。</p>
        )}
      </section>

      <section className="bg-zinc-900 py-16 dark:bg-zinc-950">
        <div className="mx-auto flex w-full max-w-[1120px] flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">準備好開始選購了嗎？</h2>
          <p className="max-w-md text-sm text-zinc-300">
            瀏覽{PRODUCT_CATEGORIES.length} 大分類，探索所有上架商品。
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-amber-300"
          >
            開始購物
          </Link>
        </div>
      </section>

      <footer className="border-t border-zinc-200 py-8 dark:border-zinc-800">
        <div className="mx-auto w-full max-w-[1120px] px-4 text-center text-xs text-zinc-500 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} AI Shopping Mall
        </div>
      </footer>
    </div>
  );
}

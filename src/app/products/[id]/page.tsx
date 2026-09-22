import { isValidObjectId } from "mongoose";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { Product, type IProduct } from "@/models/Product";
import { formatNumber } from "@/lib/format";
import ProductGallery from "@/components/ProductGallery";
import HeartIcon from "@/components/HeartIcon";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isValidObjectId(id)) {
    notFound();
  }

  await connectToDatabase();
  const product = await Product.findById(id).lean<IProduct>();

  if (!product) {
    notFound();
  }

  const inStock = product.quantity > 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="mx-auto w-full max-w-[1120px] flex-1 px-4 pb-8 pt-24 sm:px-6 sm:pb-12 sm:pt-28 lg:px-8">
        <p className="mb-8 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-700 dark:hover:text-slate-300">
            首頁
          </Link>{" "}
          /{" "}
          <Link href="/products" className="hover:text-slate-700 dark:hover:text-slate-300">
            商品
          </Link>{" "}
          / {product.name}
        </p>

        <div className="relative grid grid-cols-1 gap-10 md:grid-cols-2">
          <ProductGallery images={product.images ?? []} alt={product.name} />

          <div className="rounded-[2rem] bg-white/70 p-6 shadow-sm ring-1 ring-primary/15 dark:bg-slate-900/60 dark:ring-slate-800">
            <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-support/30 px-3 py-1 text-xs font-semibold text-ink dark:bg-slate-800 dark:text-slate-300">
              <HeartIcon className="h-3 w-3" />
              {product.category}
            </span>
            <h1 className="text-2xl font-semibold text-ink dark:text-slate-50">
              {product.name}
            </h1>
            <p className="mt-3 text-3xl font-bold text-ink dark:text-secondary">
              ${formatNumber(product.price)}
            </p>

            <button
              type="button"
              disabled={!inStock}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-content shadow-sm transition hover:-translate-y-0.5 hover:brightness-95 disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none dark:disabled:bg-slate-800 dark:disabled:text-slate-500 sm:w-auto"
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
              {inStock ? "加入購物車" : "缺貨"}
            </button>

            {product.description && (
              <div className="mt-10 border-t border-dashed border-primary/40 pt-6 dark:border-slate-800">
                <h2 className="mb-3 text-sm font-semibold text-ink dark:text-slate-50">
                  商品描述
                </h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

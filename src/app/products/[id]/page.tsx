import { isValidObjectId } from "mongoose";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { Product, type IProduct } from "@/models/Product";
import { formatNumber } from "@/lib/format";
import ProductGallery from "@/components/ProductGallery";

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
    <div className="mx-auto w-full max-w-[1120px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <p className="mb-8 text-sm text-zinc-500">
        <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-300">
          首頁
        </Link>{" "}
        /{" "}
        <Link href="/products" className="hover:text-zinc-700 dark:hover:text-zinc-300">
          商品
        </Link>{" "}
        / {product.name}
      </p>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <ProductGallery images={product.images ?? []} alt={product.name} />

        <div>
          <span className="mb-3 inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {product.category}
          </span>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {product.name}
          </h1>
          <p className="mt-3 text-3xl font-bold text-amber-600 dark:text-amber-400">
            ${formatNumber(product.price)}
          </p>

          <button
            type="button"
            disabled={!inStock}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500 sm:w-auto"
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
            <div className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800">
              <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                商品描述
              </h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

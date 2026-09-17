import Link from "next/link";
import type { IProduct } from "@/models/Product";
import { formatNumber } from "@/lib/format";

export default function ProductCard({ product }: { product: IProduct }) {
  return (
    <Link
      href={`/products/${product._id}`}
      className="flex flex-col overflow-hidden rounded-3xl bg-orange-50 p-3 shadow-sm ring-1 ring-black/5 transition hover:shadow-md dark:bg-zinc-900 dark:ring-white/10"
    >
      {product.images?.[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.images[0]}
          alt={product.name}
          className="aspect-[4/3] w-full rounded-2xl object-cover"
        />
      ) : (
        <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-orange-100 text-sm text-zinc-400 dark:bg-zinc-800">
          無圖片
        </div>
      )}

      <div className="flex flex-1 flex-col px-1 pt-4">
        <p className="text-base font-bold text-zinc-900 dark:text-zinc-50">{product.name}</p>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{product.category}</p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
            ${formatNumber(product.price)}
          </p>
          <span
            aria-label="加入購物車"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-400 text-zinc-900"
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
    </Link>
  );
}

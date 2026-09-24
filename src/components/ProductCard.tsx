import Link from "next/link";
import type { IProduct } from "@/models/Product";
import { formatNumber } from "@/lib/format";
import StarRating from "@/components/StarRating";

export default function ProductCard({
  product,
  showPopularity = false,
}: {
  product: IProduct;
  showPopularity?: boolean;
}) {
  return (
    <Link
      href={`/products/${product._id}`}
      className="flex flex-col overflow-hidden rounded-[1.75rem] bg-white p-3 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900 dark:ring-white/10"
    >
      {product.images?.[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.images[0]}
          alt={product.name}
          className="aspect-[4/3] w-full rounded-2xl object-cover"
        />
      ) : (
        <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-primary/20 text-sm text-slate-400 dark:bg-slate-800">
          無圖片
        </div>
      )}

      <div className="flex flex-1 flex-col px-1 pt-4">
        <p className="text-base font-bold text-slate-800 dark:text-slate-50">{product.name}</p>
        <span className="mt-1.5 inline-block w-fit rounded-full bg-support/25 px-2 py-0.5 text-[11px] font-medium text-ink dark:bg-slate-800 dark:text-slate-300">
          {product.category}
        </span>
        {showPopularity && <StarRating popularity={product.popularity} className="mt-2" />}

        <div className="mt-auto flex items-center justify-between pt-4">
          <p className="text-xl font-bold text-ink dark:text-secondary">
            ${formatNumber(product.price)}
          </p>
          <span
            aria-label="加入購物車"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-content transition hover:scale-110"
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

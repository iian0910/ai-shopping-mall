import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import { Product, type IProduct } from "@/models/Product";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  await connectToDatabase();
  const products = await Product.find().sort({ createdAt: -1 }).lean<IProduct[]>();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">商品列表</h1>
        <Link
          href="/products/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900"
        >
          新增商品
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {products.map((product) => (
          <div
            key={String(product._id)}
            className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700"
          >
            {product.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-40 w-full object-cover"
              />
            ) : (
              <div className="flex h-40 w-full items-center justify-center bg-zinc-100 text-sm text-zinc-400 dark:bg-zinc-800">
                無圖片
              </div>
            )}
            <div className="p-4">
              <p className="font-medium text-zinc-900 dark:text-zinc-50">{product.name}</p>
              <p className="text-sm text-zinc-500">${product.price}</p>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-sm text-zinc-500">目前沒有商品，點右上角「新增商品」開始建立。</p>
      )}
    </div>
  );
}

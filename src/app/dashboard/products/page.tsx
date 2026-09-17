import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import { Product, type IProduct } from "@/models/Product";
import DeleteProductButton from "@/components/DeleteProductButton";
import { formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

export default async function DashboardProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  await connectToDatabase();
  const total = await Product.countDocuments();
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const products = await Product.find()
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .lean<IProduct[]>();

  return (
    <div className="px-8 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">商品列表</h1>
        <Link
          href="/dashboard/products/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900"
        >
          新增商品
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">圖片</th>
              <th className="px-4 py-3 font-medium">品名</th>
              <th className="px-4 py-3 font-medium">分類</th>
              <th className="px-4 py-3 font-medium">價格</th>
              <th className="px-4 py-3 font-medium">數量</th>
              <th className="px-4 py-3 font-medium">描述</th>
              <th className="px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {products.map((product) => (
              <tr key={String(product._id)}>
                <td className="px-4 py-3">
                  {product.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-zinc-100 text-xs text-zinc-400 dark:bg-zinc-800">
                      無圖
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
                  {product.name}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                  {product.category ?? "-"}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                  ${formatNumber(product.price)}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                  {product.quantity !== undefined ? formatNumber(product.quantity) : "-"}
                </td>
                <td className="max-w-xs truncate px-4 py-3 text-zinc-500">
                  {product.description ?? "-"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/products/${product._id}/edit`}
                      className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    >
                      編輯
                    </Link>
                    <DeleteProductButton
                      productId={String(product._id)}
                      productName={product.name}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-zinc-500">
            目前沒有商品，點右上角「新增商品」開始建立。
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Link
            href={`/dashboard/products?page=${currentPage - 1}`}
            aria-disabled={currentPage <= 1}
            className={`rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium dark:border-zinc-700 ${
              currentPage <= 1
                ? "pointer-events-none opacity-40"
                : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
            }`}
          >
            上一頁
          </Link>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/dashboard/products?page=${p}`}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium ${
                p === currentPage
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                  : "border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              }`}
            >
              {p}
            </Link>
          ))}

          <Link
            href={`/dashboard/products?page=${currentPage + 1}`}
            aria-disabled={currentPage >= totalPages}
            className={`rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium dark:border-zinc-700 ${
              currentPage >= totalPages
                ? "pointer-events-none opacity-40"
                : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
            }`}
          >
            下一頁
          </Link>
        </div>
      )}
    </div>
  );
}

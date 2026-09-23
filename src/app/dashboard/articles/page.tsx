import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import { Article, type IArticle } from "@/models/Article";
import DeleteArticleButton from "@/components/DeleteArticleButton";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

export default async function DashboardArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  await connectToDatabase();
  const total = await Article.countDocuments();
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const articles = await Article.find()
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .lean<IArticle[]>();

  return (
    <div className="px-8 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink dark:text-slate-50">文章列表</h1>
        <Link
          href="/dashboard/articles/new"
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-content shadow-sm transition hover:-translate-y-0.5 hover:brightness-95"
        >
          新增文章
        </Link>
      </div>

      <div className="overflow-x-auto rounded-[1.75rem] border border-primary/30 shadow-sm dark:border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-primary/15 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">圖片</th>
              <th className="px-4 py-3 font-medium">標題</th>
              <th className="px-4 py-3 font-medium">建立時間</th>
              <th className="px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/20 dark:divide-slate-800">
            {articles.map((article) => (
              <tr key={String(article._id)}>
                <td className="px-4 py-3">
                  {article.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-xs text-slate-400 dark:bg-slate-800">
                      無圖
                    </div>
                  )}
                </td>
                <td className="max-w-md truncate px-4 py-3 font-medium text-ink dark:text-slate-50">
                  {article.title}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {formatDate(article.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/articles/${article._id}/edit`}
                      className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-primary/20 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      編輯
                    </Link>
                    <DeleteArticleButton
                      articleId={String(article._id)}
                      articleTitle={article.title}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {articles.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-slate-500">
            目前沒有文章，點右上角「新增文章」開始建立。
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Link
            href={`/dashboard/articles?page=${currentPage - 1}`}
            aria-disabled={currentPage <= 1}
            className={`rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium transition dark:border-slate-700 ${
              currentPage <= 1
                ? "pointer-events-none opacity-40"
                : "text-slate-700 hover:-translate-y-0.5 hover:bg-primary/20 dark:text-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            上一頁
          </Link>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/dashboard/articles?page=${p}`}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                p === currentPage
                  ? "border-accent bg-accent text-accent-content shadow-sm"
                  : "border-slate-300 text-slate-700 hover:-translate-y-0.5 hover:bg-primary/20 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              {p}
            </Link>
          ))}

          <Link
            href={`/dashboard/articles?page=${currentPage + 1}`}
            aria-disabled={currentPage >= totalPages}
            className={`rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium transition dark:border-slate-700 ${
              currentPage >= totalPages
                ? "pointer-events-none opacity-40"
                : "text-slate-700 hover:-translate-y-0.5 hover:bg-primary/20 dark:text-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            下一頁
          </Link>
        </div>
      )}
    </div>
  );
}

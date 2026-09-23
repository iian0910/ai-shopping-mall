import Link from "next/link";
import { getArticles, ARTICLES_PAGE_SIZE } from "@/lib/articles";
import { formatNumber } from "@/lib/format";
import ArticleCard from "@/components/ArticleCard";
import HeartIcon from "@/components/HeartIcon";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

function buildHref(page: number) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/articles?${query}` : "/articles";
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const requestedPage = Math.max(1, Number(pageParam) || 1);

  const { articles, total, page, totalPages } = await getArticles({
    page: requestedPage,
  });

  const startIndex = total === 0 ? 0 : (page - 1) * ARTICLES_PAGE_SIZE + 1;
  const endIndex = total === 0 ? 0 : startIndex + articles.length - 1;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="mx-auto w-full max-w-[1120px] flex-1 px-4 pb-8 pt-24 sm:px-6 sm:pb-12 sm:pt-28 lg:px-8">
        <div className="mb-10">
          <h1 className="flex items-center gap-2 text-3xl font-semibold text-slate-900 dark:text-slate-50">
            <HeartIcon className="h-6 w-6 text-accent" />
            文章
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-700 dark:hover:text-slate-300">
              首頁
            </Link>{" "}
            / 文章
          </p>
        </div>

        {total > 0 && (
          <div className="mb-6 flex items-center justify-between text-sm text-slate-500">
            <p>
              顯示第 {startIndex}-{endIndex} 筆，共 {formatNumber(total)} 筆
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard key={String(article._id)} article={article} />
          ))}
        </div>

        {articles.length === 0 && (
          <p className="flex flex-col items-center gap-2 py-12 text-center text-sm text-slate-500">
            <HeartIcon className="h-6 w-6 text-primary" />
            目前沒有文章。
          </p>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <Link
              href={buildHref(page - 1)}
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
                href={buildHref(p)}
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
              href={buildHref(page + 1)}
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

      <Footer />
    </div>
  );
}

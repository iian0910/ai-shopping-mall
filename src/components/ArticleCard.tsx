import Link from "next/link";
import type { IArticle } from "@/models/Article";
import { formatDate } from "@/lib/format";

function excerpt(content: string, length = 100) {
  const trimmed = content.trim();
  return trimmed.length > length ? `${trimmed.slice(0, length)}...` : trimmed;
}

export default function ArticleCard({ article }: { article: IArticle }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="flex flex-col overflow-hidden rounded-[1.75rem] bg-white p-3 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900 dark:ring-white/10"
    >
      {article.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.coverImage}
          alt={article.title}
          className="aspect-[16/9] w-full rounded-2xl object-cover"
        />
      ) : (
        <div className="flex aspect-[16/9] w-full items-center justify-center rounded-2xl bg-primary/20 text-sm text-slate-400 dark:bg-slate-800">
          無圖片
        </div>
      )}

      <div className="flex flex-1 flex-col px-1 pt-4">
        <span className="text-xs font-medium text-slate-400">{formatDate(article.createdAt)}</span>
        <h2 className="mt-2 text-lg font-bold text-slate-800 dark:text-slate-50">{article.title}</h2>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {excerpt(article.content)}
        </p>
        <span className="mt-4 text-sm font-medium text-secondary">閱讀更多 →</span>
      </div>
    </Link>
  );
}

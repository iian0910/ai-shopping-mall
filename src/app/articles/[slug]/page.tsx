import Link from "next/link";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { Article, type IArticle } from "@/models/Article";
import { formatDate } from "@/lib/format";
import HeartIcon from "@/components/HeartIcon";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  await connectToDatabase();
  const article = await Article.findOne({ slug }).lean<IArticle>();

  if (!article) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="mx-auto w-full max-w-[760px] flex-1 px-4 pb-8 pt-24 sm:px-6 sm:pb-12 sm:pt-28 lg:px-8">
        <p className="mb-8 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-700 dark:hover:text-slate-300">
            首頁
          </Link>{" "}
          /{" "}
          <Link href="/articles" className="hover:text-slate-700 dark:hover:text-slate-300">
            文章
          </Link>{" "}
          / {article.title}
        </p>

        <article className="rounded-[2rem] bg-white/70 p-8 shadow-sm ring-1 ring-primary/15 dark:bg-slate-900/60 dark:ring-slate-800">
          {article.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.coverImage}
              alt={article.title}
              className="mb-6 aspect-[16/9] w-full rounded-[1.5rem] object-cover"
            />
          )}
          <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-support/30 px-3 py-1 text-xs font-semibold text-ink dark:bg-slate-800 dark:text-slate-300">
            <HeartIcon className="h-3 w-3" />
            {formatDate(article.createdAt)}
          </span>
          <h1 className="mt-3 text-2xl font-semibold text-ink dark:text-slate-50">
            {article.title}
          </h1>
          <div className="mt-6 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {article.content}
          </div>
        </article>
      </div>

      <Footer />
    </div>
  );
}

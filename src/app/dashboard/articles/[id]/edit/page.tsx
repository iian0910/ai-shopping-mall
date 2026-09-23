import { notFound } from "next/navigation";
import ArticleForm from "@/components/ArticleForm";
import HeartIcon from "@/components/HeartIcon";
import { connectToDatabase } from "@/lib/mongodb";
import { Article, type IArticle } from "@/models/Article";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectToDatabase();
  const article = await Article.findById(id).lean<IArticle>();

  if (!article) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="mb-8 flex items-center gap-2 text-2xl font-semibold text-ink dark:text-slate-50">
        <HeartIcon className="h-5 w-5 text-accent" />
        編輯文章
      </h1>
      <div className="rounded-[1.75rem] bg-white/70 p-6 shadow-sm ring-1 ring-primary/15 dark:bg-slate-900/60 dark:ring-slate-800">
        <ArticleForm
          mode="edit"
          articleId={String(article._id)}
          initialValues={{
            title: article.title,
            content: article.content,
            coverImage: article.coverImage,
          }}
        />
      </div>
    </div>
  );
}

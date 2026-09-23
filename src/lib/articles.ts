import { connectToDatabase } from "@/lib/mongodb";
import { Article, type IArticle } from "@/models/Article";

export const ARTICLES_PAGE_SIZE = 10;

export type ArticleListParams = {
  page?: number;
  limit?: number;
};

export type ArticleListResult = {
  articles: IArticle[];
  total: number;
  page: number;
  totalPages: number;
};

export async function getArticles({
  page = 1,
  limit = ARTICLES_PAGE_SIZE,
}: ArticleListParams = {}): Promise<ArticleListResult> {
  await connectToDatabase();

  const total = await Article.countDocuments();
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const articles = await Article.find()
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * limit)
    .limit(limit)
    .lean<IArticle[]>();

  return {
    articles,
    total,
    page: currentPage,
    totalPages,
  };
}

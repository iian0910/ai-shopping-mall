import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Article } from "@/models/Article";
import { parseArticleInput } from "@/lib/validateArticle";
import { getSession } from "@/lib/session";
import { getArticles, ARTICLES_PAGE_SIZE } from "@/lib/articles";
import { slugify } from "@/lib/slugify";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Number(searchParams.get("page")) || 1;

  const result = await getArticles({ page, limit: ARTICLES_PAGE_SIZE });
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "未授權，請先登入" }, { status: 401 });
  }

  const body = await request.json();
  const result = parseArticleInput(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  await connectToDatabase();

  const baseSlug = slugify(result.data.title);
  let slug = baseSlug;
  let suffix = 2;
  while (await Article.exists({ slug })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const article = await Article.create({ ...result.data, slug });

  return NextResponse.json(article, { status: 201 });
}

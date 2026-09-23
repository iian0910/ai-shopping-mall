import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Article } from "@/models/Article";
import { parseArticleInput } from "@/lib/validateArticle";
import { getSession } from "@/lib/session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectToDatabase();
  const article = await Article.findById(id);
  if (!article) {
    return NextResponse.json({ error: "找不到文章" }, { status: 404 });
  }
  return NextResponse.json(article);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "未授權，請先登入" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const result = parseArticleInput(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  await connectToDatabase();
  const article = await Article.findByIdAndUpdate(id, result.data, {
    new: true,
    runValidators: true,
  });

  if (!article) {
    return NextResponse.json({ error: "找不到文章" }, { status: 404 });
  }

  return NextResponse.json(article);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "未授權，請先登入" }, { status: 401 });
  }

  const { id } = await params;
  await connectToDatabase();
  const article = await Article.findByIdAndDelete(id);

  if (!article) {
    return NextResponse.json({ error: "找不到文章" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

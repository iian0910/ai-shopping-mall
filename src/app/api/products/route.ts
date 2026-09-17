import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { parseProductInput } from "@/lib/validateProduct";
import { getSession } from "@/lib/session";
import { getProducts, PRODUCTS_PAGE_SIZE } from "@/lib/products";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") ?? undefined;
  const page = Number(searchParams.get("page")) || 1;

  const result = await getProducts({ category, page, limit: PRODUCTS_PAGE_SIZE });
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "未授權，請先登入" }, { status: 401 });
  }

  const body = await request.json();
  const result = parseProductInput(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  await connectToDatabase();
  const product = await Product.create(result.data);

  return NextResponse.json(product, { status: 201 });
}

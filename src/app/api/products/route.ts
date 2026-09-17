import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { parseProductInput } from "@/lib/validateProduct";
import { getSession } from "@/lib/session";

export async function GET() {
  await connectToDatabase();
  const products = await Product.find().sort({ createdAt: -1 });
  return NextResponse.json(products);
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

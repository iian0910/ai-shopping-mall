import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";

export async function GET() {
  await connectToDatabase();
  const products = await Product.find().sort({ createdAt: -1 });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, price, images } = body as {
    name?: string;
    price?: number;
    images?: string[];
  };

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "品名為必填欄位" }, { status: 400 });
  }
  if (price === undefined || typeof price !== "number" || Number.isNaN(price)) {
    return NextResponse.json({ error: "價格為必填欄位" }, { status: 400 });
  }
  if (images && (!Array.isArray(images) || images.length > 6)) {
    return NextResponse.json({ error: "產品圖最多只能上傳 6 張" }, { status: 400 });
  }

  await connectToDatabase();
  const product = await Product.create({
    name,
    price,
    images: images ?? [],
  });

  return NextResponse.json(product, { status: 201 });
}

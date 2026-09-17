import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { parseProductInput } from "@/lib/validateProduct";

export async function GET() {
  await connectToDatabase();
  const products = await Product.find().sort({ createdAt: -1 });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = parseProductInput(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  await connectToDatabase();
  const product = await Product.create(result.data);

  return NextResponse.json(product, { status: 201 });
}

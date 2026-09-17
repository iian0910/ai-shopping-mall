import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { parseProductInput } from "@/lib/validateProduct";
import { getSession } from "@/lib/session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectToDatabase();
  const product = await Product.findById(id);
  if (!product) {
    return NextResponse.json({ error: "找不到商品" }, { status: 404 });
  }
  return NextResponse.json(product);
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
  const result = parseProductInput(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  await connectToDatabase();
  const product = await Product.findByIdAndUpdate(id, result.data, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return NextResponse.json({ error: "找不到商品" }, { status: 404 });
  }

  return NextResponse.json(product);
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
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    return NextResponse.json({ error: "找不到商品" }, { status: 404 });
  }

  if (product.images?.length) {
    await del(product.images).catch(() => {});
  }

  return NextResponse.json({ success: true });
}

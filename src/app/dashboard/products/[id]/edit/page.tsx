import { notFound } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import { connectToDatabase } from "@/lib/mongodb";
import { Product, type IProduct } from "@/models/Product";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectToDatabase();
  const product = await Product.findById(id).lean<IProduct>();

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="mb-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">編輯商品</h1>
      <ProductForm
        mode="edit"
        productId={String(product._id)}
        initialValues={{
          name: product.name,
          price: product.price,
          description: product.description ?? "",
          quantity: product.quantity,
          category: product.category,
          images: product.images ?? [],
        }}
      />
    </div>
  );
}

import ProductForm from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="mb-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">新增商品</h1>
      <ProductForm mode="create" />
    </div>
  );
}

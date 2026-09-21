import ProductForm from "@/components/ProductForm";
import HeartIcon from "@/components/HeartIcon";

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="mb-8 flex items-center gap-2 text-2xl font-semibold text-ink dark:text-slate-50">
        <HeartIcon className="h-5 w-5 text-accent" />
        新增商品
      </h1>
      <div className="rounded-[1.75rem] bg-white/70 p-6 shadow-sm ring-1 ring-primary/15 dark:bg-slate-900/60 dark:ring-slate-800">
        <ProductForm mode="create" />
      </div>
    </div>
  );
}

"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PRODUCT_CATEGORIES } from "@/lib/constants";

const MAX_IMAGES = 6;
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_DESCRIPTION_LENGTH = 500;

export type ProductFormValues = {
  name: string;
  price: number;
  description?: string;
  quantity: number;
  category: string;
  images: string[];
};

type ProductFormProps = {
  mode: "create" | "edit";
  productId?: string;
  initialValues?: ProductFormValues;
};

export default function ProductForm({ mode, productId, initialValues }: ProductFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialValues?.name ?? "");
  const [price, setPrice] = useState(initialValues ? String(initialValues.price) : "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [quantity, setQuantity] = useState(initialValues ? String(initialValues.quantity) : "");
  const [category, setCategory] = useState<string>(initialValues?.category ?? PRODUCT_CATEGORIES[0]);
  const [existingImages, setExistingImages] = useState<string[]>(initialValues?.images ?? []);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);

  const totalImageCount = existingImages.length + files.length;

  function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const selected = Array.from(e.target.files ?? []);

    if (existingImages.length + selected.length > MAX_IMAGES) {
      setError(`產品圖最多只能上傳 ${MAX_IMAGES} 張`);
      return;
    }

    const oversized = selected.find((f) => f.size > MAX_FILE_SIZE);
    if (oversized) {
      setError(`「${oversized.name}」超過 20MB 上限`);
      return;
    }

    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  }

  function removeExistingImage(url: string) {
    setExistingImages((prev) => prev.filter((img) => img !== url));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("請輸入品名");
      return;
    }
    const priceNum = Number(price);
    if (!price || Number.isNaN(priceNum)) {
      setError("請輸入正確的價格");
      return;
    }
    const quantityNum = Number(quantity);
    if (!quantity || Number.isNaN(quantityNum) || quantityNum < 0) {
      setError("請輸入正確的商品數量");
      return;
    }
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      setError(`商品描述最多 ${MAX_DESCRIPTION_LENGTH} 字`);
      return;
    }
    if (!category) {
      setError("請選擇商品分類");
      return;
    }
    if (totalImageCount > MAX_IMAGES) {
      setError(`產品圖最多只能上傳 ${MAX_IMAGES} 張`);
      return;
    }

    setSubmitting(true);
    try {
      const newImageUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(`上傳圖片中 (${i + 1}/${files.length})...`);
        const blob = await upload(`products/${Date.now()}-${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        newImageUrls.push(blob.url);
      }

      const images = [...existingImages, ...newImageUrls];

      setProgress("儲存商品資料中...");
      const res = await fetch(mode === "edit" ? `/api/products/${productId}` : "/api/products", {
        method: mode === "edit" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: priceNum,
          images,
          description,
          quantity: quantityNum,
          category,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? (mode === "edit" ? "更新商品失敗" : "建立商品失敗"));
      }

      router.push("/dashboard/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生錯誤");
    } finally {
      setSubmitting(false);
      setProgress(null);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          品名
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="例如：無線藍牙耳機"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="price" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          價格
        </label>
        <input
          id="price"
          type="number"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="例如：990"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="quantity" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          商品數量
        </label>
        <input
          id="quantity"
          type="number"
          min="0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="例如：100"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          分類
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
        >
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          商品描述（最多 {MAX_DESCRIPTION_LENGTH} 字）
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={MAX_DESCRIPTION_LENGTH}
          rows={4}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="請輸入商品描述"
        />
        <p className="text-right text-xs text-zinc-400">
          {description.length}/{MAX_DESCRIPTION_LENGTH}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="images" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          產品圖（最多 {MAX_IMAGES} 張，單張限 20MB）
        </label>

        {existingImages.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {existingImages.map((url) => (
              <div key={url} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt="現有產品圖"
                  className="h-20 w-20 rounded-md border border-zinc-200 object-cover dark:border-zinc-700"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(url)}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white"
                  aria-label="移除圖片"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          id="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFilesChange}
          className="text-sm text-zinc-700 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-sm file:text-white dark:text-zinc-300"
        />
        {previews.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-3">
            {previews.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt={`預覽圖 ${i + 1}`}
                className="h-20 w-20 rounded-md border border-zinc-200 object-cover dark:border-zinc-700"
              />
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {progress && <p className="text-sm text-zinc-500">{progress}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
      >
        {submitting ? "送出中..." : mode === "edit" ? "儲存變更" : "建立商品"}
      </button>
    </form>
  );
}

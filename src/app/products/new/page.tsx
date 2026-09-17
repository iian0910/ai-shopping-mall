"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MAX_IMAGES = 6;
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export default function NewProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);

  function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const selected = Array.from(e.target.files ?? []);

    if (selected.length > MAX_IMAGES) {
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
    if (files.length > MAX_IMAGES) {
      setError(`產品圖最多只能上傳 ${MAX_IMAGES} 張`);
      return;
    }

    setSubmitting(true);
    try {
      const imageUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(`上傳圖片中 (${i + 1}/${files.length})...`);
        const blob = await upload(`products/${Date.now()}-${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        imageUrls.push(blob.url);
      }

      setProgress("儲存商品資料中...");
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price: priceNum, images: imageUrls }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "建立商品失敗");
      }

      router.push("/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生錯誤");
    } finally {
      setSubmitting(false);
      setProgress(null);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="mb-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">新增商品</h1>

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
          <label htmlFor="images" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            產品圖（最多 {MAX_IMAGES} 張，單張限 20MB）
          </label>
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
          {submitting ? "送出中..." : "建立商品"}
        </button>
      </form>
    </div>
  );
}

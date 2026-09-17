"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
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

type PendingImage = {
  id: string;
  file: File;
  previewUrl: string;
  progress: number;
  status: "uploading" | "done" | "error";
  url?: string;
  errorMessage?: string;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ProductForm({ mode, productId, initialValues }: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(initialValues?.name ?? "");
  const [price, setPrice] = useState(initialValues ? String(initialValues.price) : "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [quantity, setQuantity] = useState(initialValues ? String(initialValues.quantity) : "");
  const [category, setCategory] = useState<string>(initialValues?.category ?? PRODUCT_CATEGORIES[0]);
  const [existingImages, setExistingImages] = useState<string[]>(initialValues?.images ?? []);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const totalImageCount = existingImages.length + pendingImages.length;

  function updatePendingImage(id: string, patch: Partial<PendingImage>) {
    setPendingImages((prev) => prev.map((img) => (img.id === id ? { ...img, ...patch } : img)));
  }

  function startUpload(entry: PendingImage) {
    upload(`products/${Date.now()}-${entry.file.name}`, entry.file, {
      access: "public",
      handleUploadUrl: "/api/upload",
      onUploadProgress: ({ percentage }) => {
        updatePendingImage(entry.id, { progress: percentage });
      },
    })
      .then((blob) => {
        updatePendingImage(entry.id, { status: "done", progress: 100, url: blob.url });
      })
      .catch((err) => {
        updatePendingImage(entry.id, {
          status: "error",
          errorMessage: err instanceof Error ? err.message : "上傳失敗",
        });
      });
  }

  function addFiles(fileList: FileList | File[]) {
    setError(null);
    const incoming = Array.from(fileList);
    if (incoming.length === 0) return;

    const remainingSlots = MAX_IMAGES - totalImageCount;
    if (remainingSlots <= 0) {
      setError(`產品圖最多只能上傳 ${MAX_IMAGES} 張`);
      return;
    }

    const oversized = incoming.find((f) => f.size > MAX_FILE_SIZE);
    if (oversized) {
      setError(`「${oversized.name}」超過 20MB 上限`);
      return;
    }

    const accepted = incoming.slice(0, remainingSlots);
    if (incoming.length > remainingSlots) {
      setError(`產品圖最多只能上傳 ${MAX_IMAGES} 張，已略過多餘的圖片`);
    }

    const newEntries: PendingImage[] = accepted.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      status: "uploading",
    }));

    setPendingImages((prev) => [...prev, ...newEntries]);
    newEntries.forEach(startUpload);
  }

  function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    addFiles(e.target.files ?? []);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }

  function removeExistingImage(url: string) {
    setExistingImages((prev) => prev.filter((img) => img !== url));
  }

  function removePendingImage(id: string) {
    setPendingImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((img) => img.id !== id);
    });
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
    if (pendingImages.some((img) => img.status === "uploading")) {
      setError("圖片上傳中，請稍候再送出");
      return;
    }
    if (pendingImages.some((img) => img.status === "error")) {
      setError("有圖片上傳失敗，請先移除後再送出");
      return;
    }

    setSubmitting(true);
    try {
      const images = [
        ...existingImages,
        ...pendingImages.map((img) => img.url).filter((url): url is string => Boolean(url)),
      ];

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
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          產品圖（最多 {MAX_IMAGES} 張，單張限 20MB）
        </label>

        <div
          onClick={() => totalImageCount < MAX_IMAGES && fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            if (totalImageCount < MAX_IMAGES) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors ${
            totalImageCount >= MAX_IMAGES
              ? "cursor-not-allowed border-zinc-200 opacity-50 dark:border-zinc-800"
              : isDragging
                ? "cursor-pointer border-zinc-500 bg-zinc-50 dark:bg-zinc-900"
                : "cursor-pointer border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-8 w-8 text-zinc-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 8.25 12 3.75m0 0L7.5 8.25M12 3.75v12"
            />
          </svg>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            選擇檔案或拖放到這裡
          </p>
          <p className="text-xs text-zinc-400">JPEG、PNG、WEBP、GIF，單張最大 20MB</p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            disabled={totalImageCount >= MAX_IMAGES}
            className="mt-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-white disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            瀏覽檔案
          </button>
          <input
            ref={fileInputRef}
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            className="hidden"
          />
        </div>

        {(existingImages.length > 0 || pendingImages.length > 0) && (
          <div className="mt-1 flex flex-col gap-2">
            {existingImages.map((url) => (
              <div
                key={url}
                className="flex items-center gap-3 rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-700"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt="現有產品圖"
                  className="h-10 w-10 shrink-0 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-zinc-700 dark:text-zinc-300">既有圖片</p>
                  <p className="flex items-center gap-1 text-xs text-emerald-600">
                    <span>✓</span> 已上傳
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeExistingImage(url)}
                  aria-label="移除圖片"
                  className="shrink-0 text-zinc-400 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            ))}

            {pendingImages.map((img) => (
              <div
                key={img.id}
                className="flex items-center gap-3 rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-700"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.previewUrl}
                  alt={img.file.name}
                  className="h-10 w-10 shrink-0 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-zinc-700 dark:text-zinc-300">
                    {img.file.name}
                  </p>
                  <p className="text-xs text-zinc-400">{formatFileSize(img.file.size)}</p>

                  {img.status === "uploading" && (
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                        <div
                          className="h-full rounded-full bg-zinc-900 transition-all dark:bg-zinc-300"
                          style={{ width: `${img.progress}%` }}
                        />
                      </div>
                      <span className="shrink-0 text-xs text-zinc-400">上傳中...</span>
                    </div>
                  )}
                  {img.status === "done" && (
                    <p className="flex items-center gap-1 text-xs text-emerald-600">
                      <span>✓</span> 已完成
                    </p>
                  )}
                  {img.status === "error" && (
                    <p className="text-xs text-red-600">{img.errorMessage ?? "上傳失敗"}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removePendingImage(img.id)}
                  aria-label="移除圖片"
                  className="shrink-0 text-zinc-400 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting || pendingImages.some((img) => img.status === "uploading")}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
      >
        {submitting ? "送出中..." : mode === "edit" ? "儲存變更" : "建立商品"}
      </button>
    </form>
  );
}

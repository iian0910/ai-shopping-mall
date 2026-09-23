"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const MAX_TITLE_LENGTH = 200;
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export type ArticleFormValues = {
  title: string;
  content: string;
  coverImage?: string;
};

type ArticleFormProps = {
  mode: "create" | "edit";
  articleId?: string;
  initialValues?: ArticleFormValues;
};

type CoverImageState =
  | { status: "idle" }
  | { status: "uploading"; previewUrl: string; progress: number }
  | { status: "done"; previewUrl: string; url: string }
  | { status: "error"; previewUrl: string; errorMessage: string };

export default function ArticleForm({ mode, articleId, initialValues }: ArticleFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [coverImage, setCoverImage] = useState<CoverImageState>(
    initialValues?.coverImage
      ? { status: "done", previewUrl: initialValues.coverImage, url: initialValues.coverImage }
      : { status: "idle" }
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError(null);
    if (file.size > MAX_FILE_SIZE) {
      setError("封面圖片超過 20MB 上限");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setCoverImage({ status: "uploading", previewUrl, progress: 0 });

    upload(`articles/${Date.now()}-${file.name}`, file, {
      access: "public",
      handleUploadUrl: "/api/upload",
      onUploadProgress: ({ percentage }) => {
        setCoverImage((prev) =>
          prev.status === "uploading" ? { ...prev, progress: percentage } : prev
        );
      },
    })
      .then((blob) => {
        setCoverImage({ status: "done", previewUrl, url: blob.url });
      })
      .catch((err) => {
        setCoverImage({
          status: "error",
          previewUrl,
          errorMessage: err instanceof Error ? err.message : "上傳失敗",
        });
      });
  }

  function removeCoverImage() {
    setCoverImage({ status: "idle" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("請輸入標題");
      return;
    }
    if (title.length > MAX_TITLE_LENGTH) {
      setError(`標題最多 ${MAX_TITLE_LENGTH} 字`);
      return;
    }
    if (!content.trim()) {
      setError("請輸入內容");
      return;
    }
    if (coverImage.status === "uploading") {
      setError("圖片上傳中，請稍候再送出");
      return;
    }
    if (coverImage.status === "error") {
      setError("封面圖片上傳失敗，請重新選擇圖片");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(mode === "edit" ? `/api/articles/${articleId}` : "/api/articles", {
        method: mode === "edit" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          coverImage: coverImage.status === "done" ? coverImage.url : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? (mode === "edit" ? "更新文章失敗" : "建立文章失敗"));
      }

      router.push("/dashboard/articles");
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
        <label htmlFor="title" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          標題
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={MAX_TITLE_LENGTH}
          className="rounded-2xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-secondary dark:border-slate-700 dark:bg-slate-900"
          placeholder="例如：療癒系列：慢下來的生活提案"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="content" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          內容
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={14}
          className="rounded-2xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-secondary dark:border-slate-700 dark:bg-slate-900"
          placeholder="請輸入文章內容"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          封面圖片（單張限 20MB）
        </label>

        {coverImage.status === "idle" ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[1.75rem] border-2 border-dashed border-slate-300 px-6 py-8 text-center transition-colors hover:bg-primary/10 dark:border-slate-700 dark:hover:bg-slate-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-8 w-8 text-slate-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 8.25 12 3.75m0 0L7.5 8.25M12 3.75v12"
              />
            </svg>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              選擇檔案或拖放到這裡
            </p>
            <p className="text-xs text-slate-400">JPEG、PNG、WEBP、GIF，單張最大 20MB</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="mt-1 rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-white dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              瀏覽檔案
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-3 py-2 dark:border-slate-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage.previewUrl}
              alt="封面圖片預覽"
              className="h-10 w-10 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              {coverImage.status === "uploading" && (
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-full rounded-full bg-secondary transition-all"
                      style={{ width: `${coverImage.progress}%` }}
                    />
                  </div>
                  <span className="shrink-0 text-xs text-slate-400">上傳中...</span>
                </div>
              )}
              {coverImage.status === "done" && (
                <p className="flex items-center gap-1 text-xs text-emerald-600">
                  <span>✓</span> 已完成
                </p>
              )}
              {coverImage.status === "error" && (
                <p className="text-xs text-red-600">{coverImage.errorMessage}</p>
              )}
            </div>
            <button
              type="button"
              onClick={removeCoverImage}
              aria-label="移除圖片"
              className="shrink-0 text-slate-400 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          id="coverImage"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting || coverImage.status === "uploading"}
        className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-content shadow-sm transition hover:-translate-y-0.5 hover:brightness-95 disabled:translate-y-0 disabled:opacity-50"
      >
        {submitting ? "送出中..." : mode === "edit" ? "儲存變更" : "建立文章"}
      </button>
    </form>
  );
}

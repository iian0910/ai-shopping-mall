"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function DeleteArticleButton({
  articleId,
  articleTitle,
}: {
  articleId: string;
  articleTitle: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/articles/${articleId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "刪除文章失敗");
      }
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生錯誤");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
        className="rounded-full border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:-translate-y-0.5 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
      >
        刪除
      </button>

      <ConfirmDialog
        open={open}
        title="刪除文章"
        description={`確定要刪除「${articleTitle}」嗎？此操作無法復原。`}
        error={error}
        confirmText="刪除"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}

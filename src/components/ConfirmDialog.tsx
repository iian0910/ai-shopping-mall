"use client";

import { useEffect, useRef } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  error?: string | null;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "danger" | "default";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  error,
  confirmText = "確定",
  cancelText = "取消",
  confirmVariant = "default",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-sm rounded-[1.75rem] bg-white p-6 shadow-xl ring-1 ring-primary/15 dark:bg-slate-900 dark:ring-slate-800"
      >
        <h2
          id="confirm-dialog-title"
          className="text-base font-semibold text-ink dark:text-slate-50"
        >
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
        )}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-primary/20 disabled:translate-y-0 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-full px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50 ${
              confirmVariant === "danger"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-accent text-accent-content hover:brightness-95"
            }`}
          >
            {loading ? "處理中..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

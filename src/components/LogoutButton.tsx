"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-full px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-primary/40 disabled:opacity-50 disabled:translate-y-0 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      {loading ? "登出中..." : "登出"}
    </button>
  );
}

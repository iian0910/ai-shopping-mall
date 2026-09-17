import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 shrink-0 flex-col justify-between border-r border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <div>
          <h2 className="mb-6 text-lg font-semibold text-zinc-900 dark:text-zinc-50">後台管理</h2>
          <nav className="flex flex-col gap-1">
            <Link
              href="/dashboard/products"
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              商品列表
            </Link>
            <Link
              href="/dashboard/products/new"
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              新增商品
            </Link>
          </nav>
        </div>
        <LogoutButton />
      </aside>
      <main className="flex-1 bg-white dark:bg-black">{children}</main>
    </div>
  );
}

import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import HeartIcon from "@/components/HeartIcon";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="flex h-full w-56 shrink-0 flex-col justify-between overflow-y-auto border-r border-primary/30 bg-primary/10 p-6 dark:border-slate-800 dark:bg-slate-950">
        <div>
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-ink dark:text-slate-50">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-content">
              <HeartIcon className="h-4 w-4" />
            </span>
            後台管理
          </h2>
          <nav className="flex flex-col gap-1">
            <Link
              href="/dashboard/products"
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-primary/40 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              商品列表
            </Link>
            <Link
              href="/dashboard/products/new"
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-primary/40 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              新增商品
            </Link>
            <Link
              href="/dashboard/articles"
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-primary/40 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              文章列表
            </Link>
            <Link
              href="/dashboard/articles/new"
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-primary/40 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              新增文章
            </Link>
          </nav>
        </div>
        <LogoutButton />
      </aside>
      <main className="h-full flex-1 overflow-y-auto bg-white dark:bg-slate-950">{children}</main>
    </div>
  );
}

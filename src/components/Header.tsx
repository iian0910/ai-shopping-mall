"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import HeartIcon from "@/components/HeartIcon";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 0);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-16 border-b transition-colors duration-300 ${
        scrolled
          ? "border-primary/40 bg-white/80 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-900/80"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-full w-full max-w-[1120px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-ink dark:text-slate-50">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-content">
            <HeartIcon className="h-4 w-4" />
          </span>
          心靈療癒小窩
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 sm:flex">
            <Link href="/" className="rounded-full px-3 py-1.5 transition hover:bg-primary/20 hover:text-ink dark:hover:text-slate-50">
              首頁
            </Link>
            <Link href="/products" className="rounded-full px-3 py-1.5 transition hover:bg-primary/20 hover:text-ink dark:hover:text-slate-50">
              所有商品
            </Link>
            <Link href="/articles" className="rounded-full px-3 py-1.5 transition hover:bg-primary/20 hover:text-ink dark:hover:text-slate-50">
              文章
            </Link>
          </nav>
          <span
            aria-label="購物車"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/60 bg-primary/10 text-ink dark:border-slate-700 dark:bg-transparent dark:text-slate-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.98-4.804 2.545-7.454a1.125 1.125 0 0 0-1.11-1.36H5.106M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          </span>
        </div>
      </div>
    </header>
  );
}

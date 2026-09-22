import Link from "next/link";
import { getProducts } from "@/lib/products";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import ProductCard from "@/components/ProductCard";
import HeartIcon from "@/components/HeartIcon";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

const VALUE_PROPS = [
  {
    title: "分類齊全",
    description: "多元商品分類，快速找到你想要的商品。",
    accent: "bg-primary text-white dark:bg-slate-800 dark:text-primary",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75h6v6h-6v-6ZM14.25 3.75h6v6h-6v-6ZM3.75 14.25h6v6h-6v-6ZM14.25 14.25h6v6h-6v-6Z" />
      </svg>
    ),
  },
  {
    title: "即時更新",
    description: "後台管理即時同步商品資訊與庫存狀態。",
    accent: "bg-support text-ink dark:bg-slate-800 dark:text-support",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
  },
  {
    title: "簡單瀏覽",
    description: "直覺化的商品頁面設計，輕鬆比較商品內容。",
    accent: "bg-accent text-accent-content dark:bg-slate-800 dark:text-accent",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
];

export default async function Home() {
  const { products: featuredProducts } = await getProducts({ limit: 4 });

  return (
    <div>
      <Header />

      <section
        className="relative overflow-hidden bg-cover bg-center lg:h-[600px]"
        style={{ backgroundImage: "url(/hero-bg.webp)" }}
      >
        <div className="relative mx-auto flex w-full min-w-0 max-w-[1400px] flex-col items-center gap-8 px-6 py-12 sm:gap-10 sm:px-10 sm:py-16 lg:h-full lg:flex-row lg:justify-center lg:gap-16 lg:py-0">
          <div className="w-full min-w-0 max-w-md rounded-[2rem] bg-white/70 p-6 text-center shadow-sm ring-1 ring-primary/15 backdrop-blur-sm sm:p-8 lg:w-auto lg:max-w-lg lg:flex-1 lg:text-left">
            <h1 className="font-hero text-2xl font-bold text-ink sm:text-3xl lg:text-4xl xl:text-5xl">
              每個小朋友，都需要一位抱抱好朋友
            </h1>
            <p className="font-hero mt-3 text-sm text-[#7a5645] sm:text-base lg:text-lg">
              開心的時候一起笑，難過的時候抱一抱。
              <br />
              找到屬於你的小動物，陪你一起長大。
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-content shadow-lg transition hover:-translate-y-0.5 hover:brightness-95 sm:text-base"
            >
              查看所有商品
            </Link>
          </div>

          <div className="w-full max-w-[280px] sm:max-w-xs lg:max-w-md lg:flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero-photo.webp"
              alt="熊熊和兔兔玩偶"
              className="w-full drop-shadow-[0_18px_20px_rgba(91,58,41,0.25)]"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-2xl px-4 py-14 text-center sm:px-6 lg:px-8">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
          <HeartIcon className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-2xl font-bold text-ink dark:text-slate-50">
          溫柔陪伴，是我們的初衷
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base">
          我們相信，每個孩子都值得擁有一位陪伴自己長大的好朋友。AI Shopping Mall
          用心挑選每一件絨毛玩偶，希望不論開心或難過，都有一份柔軟的擁抱，陪著你們一起成長、一起勇敢。
        </p>
      </section>

      <section className="mx-auto w-full max-w-[1120px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent-content ring-1 ring-accent/30 dark:bg-accent/20 dark:text-accent dark:ring-accent/40">
              <HeartIcon className="h-3 w-3" />
              本週嚴選
            </span>
            <h2 className="text-2xl font-bold text-ink dark:text-slate-50">精選商品</h2>
          </div>
          <Link
            href="/products"
            className="rounded-full border border-primary/40 px-4 py-2 text-sm font-medium text-ink/80 transition hover:bg-primary/15 hover:text-ink dark:border-slate-700 dark:text-slate-300 dark:hover:text-slate-50"
          >
            查看全部 →
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={String(product._id)} product={product} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-slate-500">目前尚無上架商品。</p>
        )}
      </section>

      <section className="relative mx-auto w-full max-w-[1120px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-3">
          {VALUE_PROPS.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center rounded-[2rem] bg-white/70 p-6 text-center shadow-sm ring-1 ring-primary/15 transition hover:-translate-y-1 hover:shadow-md dark:bg-slate-900/60 dark:ring-slate-800"
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-full ${item.accent}`}>
                {item.icon}
              </div>
              <h3 className="mt-4 text-base font-semibold text-ink dark:text-slate-50">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="relative mx-auto w-full max-w-[1120px] overflow-hidden rounded-[2.5rem] bg-ink py-16">
          <div className="pointer-events-none absolute -left-8 -top-8 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-6 bottom-0 h-36 w-36 rounded-full bg-secondary/20 blur-3xl" />
          <div className="pointer-events-none absolute right-1/4 top-6 h-20 w-20 rounded-full bg-support/20 blur-2xl" />

          <div className="relative mx-auto flex w-full max-w-[1120px] flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-accent">
              <HeartIcon className="h-6 w-6" />
            </span>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">準備好開始選購了嗎？</h2>
            <p className="max-w-md text-sm text-secondary">
              瀏覽{PRODUCT_CATEGORIES.length} 大分類，探索所有上架商品。
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-content transition hover:-translate-y-0.5 hover:brightness-95"
            >
              開始購物
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

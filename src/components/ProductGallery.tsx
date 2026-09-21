"use client";

import { useState } from "react";

export default function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-[1.75rem] border border-primary/40 bg-primary/10 text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-800">
        無圖片
      </div>
    );
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-[1.75rem] shadow-sm ring-1 ring-primary/15 dark:ring-slate-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[activeIndex]}
          alt={alt}
          className="aspect-square w-full object-cover"
        />

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`第 ${index + 1} 張圖片`}
                className={`h-1.5 w-1.5 rounded-full transition ${
                  index === activeIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`顯示第 ${index + 1} 張圖片`}
              className={`h-20 w-20 shrink-0 snap-start overflow-hidden rounded-2xl border transition hover:-translate-y-0.5 ${
                index === activeIndex
                  ? "border-accent ring-2 ring-accent/40"
                  : "border-primary/40 dark:border-slate-700"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt={alt} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

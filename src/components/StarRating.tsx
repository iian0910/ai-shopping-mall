const TOTAL_STARS = 5;

// 將熱門度百分比換算成 0–5 顆星，每 20% 一顆（四捨五入）。
export function popularityToStars(popularity: number): number {
  const clamped = Math.min(100, Math.max(0, popularity || 0));
  return Math.round(clamped / (100 / TOTAL_STARS));
}

export default function StarRating({
  popularity,
  className,
}: {
  popularity: number;
  className?: string;
}) {
  const filled = popularityToStars(popularity);

  return (
    <div
      role="img"
      aria-label={`熱門度 ${filled} / ${TOTAL_STARS} 顆星`}
      className={`flex items-center gap-0.5 ${className ?? ""}`}
    >
      {Array.from({ length: TOTAL_STARS }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className={`h-4 w-4 ${i < filled ? "text-yellow-400" : "text-slate-300 dark:text-slate-600"}`}
        >
          <path d="M11.48 3.5a.56.56 0 0 1 1.04 0l2.13 5.11a.56.56 0 0 0 .48.35l5.52.44c.5.04.7.66.32.99l-4.2 3.6a.56.56 0 0 0-.19.56l1.29 5.38a.56.56 0 0 1-.84.61l-4.73-2.88a.56.56 0 0 0-.59 0l-4.73 2.88a.56.56 0 0 1-.84-.61l1.28-5.38a.56.56 0 0 0-.18-.56l-4.2-3.6a.56.56 0 0 1 .31-.99l5.52-.44a.56.56 0 0 0 .48-.35l2.13-5.11Z" />
        </svg>
      ))}
    </div>
  );
}

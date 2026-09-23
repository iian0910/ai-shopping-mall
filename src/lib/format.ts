export function formatNumber(value: number): string {
  return value.toLocaleString("zh-TW");
}

export function formatDate(value: Date | string): string {
  return new Date(value).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

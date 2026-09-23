export function slugify(title: string): string {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return base || Math.random().toString(36).slice(2, 10);
}

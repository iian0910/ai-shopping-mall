const MAX_TITLE_LENGTH = 200;

export type ArticleInput = {
  title: string;
  content: string;
  coverImage?: string;
};

export function parseArticleInput(
  body: unknown
): { success: true; data: ArticleInput } | { success: false; error: string } {
  const { title, content, coverImage } = (body ?? {}) as {
    title?: string;
    content?: string;
    coverImage?: string;
  };

  if (!title || typeof title !== "string" || !title.trim()) {
    return { success: false, error: "標題為必填欄位" };
  }
  if (title.length > MAX_TITLE_LENGTH) {
    return { success: false, error: `標題最多 ${MAX_TITLE_LENGTH} 字` };
  }
  if (!content || typeof content !== "string" || !content.trim()) {
    return { success: false, error: "內容為必填欄位" };
  }
  if (coverImage && typeof coverImage !== "string") {
    return { success: false, error: "封面圖片格式錯誤" };
  }

  return {
    success: true,
    data: { title: title.trim(), content, coverImage: coverImage || undefined },
  };
}

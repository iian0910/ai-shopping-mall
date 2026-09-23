import { Schema, models, model, type Types } from "mongoose";

export interface IArticle {
  _id: Types.ObjectId;
  title: string;
  content: string;
  slug: string;
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: {
      type: String,
      required: true,
      maxlength: [200, "標題最多 200 字"],
    },
    content: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    coverImage: {
      type: String,
    },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== "production" && models.Article) {
  delete models.Article;
}

export const Article = models.Article ?? model<IArticle>("Article", ArticleSchema);

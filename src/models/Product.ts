import { Schema, models, model, type Types } from "mongoose";
import { PRODUCT_CATEGORIES, type ProductCategory } from "@/lib/constants";

export { PRODUCT_CATEGORIES };
export type { ProductCategory };

export interface IProduct {
  _id: Types.ObjectId;
  name: string;
  price: number;
  images: string[];
  description?: string;
  quantity: number;
  category: ProductCategory;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (images: string[]) => images.length <= 6,
        message: "images 最多只能上傳 6 張",
      },
    },
    description: {
      type: String,
      maxlength: [500, "商品描述最多 500 字"],
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "商品數量不可為負數"],
    },
    category: {
      type: String,
      required: true,
      enum: PRODUCT_CATEGORIES,
    },
  },
  { timestamps: true }
);

// mongoose 的 model registry 是跨模組熱重載的全域單例，dev 模式下修改 schema
// 後若沿用舊的已註冊 model，新欄位會被靜默忽略，因此開發環境每次都強制重新註冊。
if (process.env.NODE_ENV !== "production" && models.Product) {
  delete models.Product;
}

export const Product = models.Product ?? model<IProduct>("Product", ProductSchema);

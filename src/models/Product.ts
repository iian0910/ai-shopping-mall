import { Schema, models, model, type Types } from "mongoose";

export interface IProduct {
  _id: Types.ObjectId;
  name: string;
  price: number;
  images: string[];
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
  },
  { timestamps: true }
);

export const Product = models.Product ?? model<IProduct>("Product", ProductSchema);

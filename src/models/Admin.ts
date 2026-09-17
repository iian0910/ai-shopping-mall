import { Schema, models, model, type Types } from "mongoose";

export interface IAdmin {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== "production" && models.Admin) {
  delete models.Admin;
}

export const Admin = models.Admin ?? model<IAdmin>("Admin", AdminSchema);

import mongoose, { Schema, models, model } from "mongoose";

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  order: number;
  createdAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    icon: { type: String, default: "🍽️" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Category = models.Category || model("Category", CategorySchema);

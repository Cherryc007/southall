import { Schema, models, model } from "mongoose";

export interface IMenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  portions: { name: string; price: number }[];
  gst: number;
  category: string;
  image: string;
  tags: string[];
  available: boolean;
  isSpecial: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    portions: [{ name: { type: String, required: true }, price: { type: Number, required: true } }],
    gst: { type: Number, default: 5 },
    category: { type: String, required: true },
    image: { type: String, default: "" },
    tags: [{ type: String }],
    available: { type: Boolean, default: true },
    isSpecial: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

delete models.MenuItem;
export const MenuItem = models.MenuItem || model("MenuItem", MenuItemSchema);

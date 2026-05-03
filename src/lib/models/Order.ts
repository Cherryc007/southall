import { Schema, models, model } from "mongoose";

export interface IOrderItem {
  menuItemId: string;
  name: string;
  portionName?: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = "new" | "preparing" | "ready" | "completed" | "cancelled";

export interface IOrder {
  _id: string;
  orderId: string;
  items: IOrderItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
  phone: string;
  chamber: string;
  notes: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  menuItemId: { type: String, required: true },
  name: { type: String, required: true },
  portionName: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, default: "" },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    phone: { type: String, required: true },
    chamber: { type: String, default: "" },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["new", "preparing", "ready", "completed", "cancelled"],
      default: "new",
    },
  },
  { timestamps: true }
);

export const Order = models.Order || model("Order", OrderSchema);

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order";
import { isDiscountActive } from "@/lib/helpers";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const date = searchParams.get("date");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (status) filter.status = status;
    if (date === "today") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      filter.createdAt = { $gte: start, $lte: end };
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.phone || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Phone and items are required" },
        { status: 400 }
      );
    }

    const discount = await isDiscountActive(body.chamber);
    const subtotal = body.items.reduce(
      (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
      0
    );
    const discountAmount = discount.active ? (subtotal * discount.percent) / 100 : 0;
    const total = subtotal - discountAmount;

    // Generate a short ID: 1 Letter + 3 Digits (e.g., SK-F101)
    const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const digits = "0123456789";
    const shortId = 
      letters.charAt(Math.floor(Math.random() * letters.length)) +
      Array.from({ length: 3 }, () => digits.charAt(Math.floor(Math.random() * digits.length))).join("");
    const orderId = `SK-${shortId}`;

    const order = await Order.create({
      orderId,
      items: body.items,
      subtotal: Math.round(subtotal * 100) / 100,
      discountPercent: discount.active ? discount.percent : 0,
      discountAmount: Math.round(discountAmount * 100) / 100,
      total: Math.round(total * 100) / 100,
      phone: body.phone,
      chamber: body.chamber || "",
      notes: body.notes || "",
      status: "new",
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ success: false, error: "Failed to place order" }, { status: 500 });
  }
}

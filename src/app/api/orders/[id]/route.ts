import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const order = await Order.findOne({
      $or: [{ _id: id.length === 24 ? id : null }, { orderId: id }],
    });
    if (!order) return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const validStatuses = ["new", "preparing", "ready", "completed", "cancelled"];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { ...(body.status && { status: body.status }) },
      { new: true }
    );

    if (!order) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    await Order.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Order deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to delete order" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { MenuItem } from "@/lib/models/MenuItem";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const item = await MenuItem.findById(id);
    if (!item) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to fetch item" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const item = await MenuItem.findByIdAndUpdate(
      id,
      {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.price !== undefined && { price: Number(body.price) }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.tags !== undefined && { tags: body.tags }),
        ...(body.available !== undefined && { available: body.available }),
        ...(body.isSpecial !== undefined && { isSpecial: body.isSpecial }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.portions !== undefined && { portions: body.portions }),
        ...(body.gst !== undefined && { gst: Number(body.gst) }),
      },
      { new: true }
    );

    if (!item) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    await MenuItem.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to delete item" }, { status: 500 });
  }
}

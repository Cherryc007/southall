import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { MenuItem } from "@/lib/models/MenuItem";
import { seedDefaultData } from "@/lib/helpers";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const available = searchParams.get("available");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (category) filter.category = category;
    if (available === "true") filter.available = true;

    const items = await MenuItem.find(filter).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("GET /api/menu error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch menu" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const item = await MenuItem.create({
      name: body.name,
      description: body.description || "",
      price: Number(body.price),
      category: body.category,
      image: body.image || "",
      tags: body.tags || [],
      available: body.available !== false,
      isSpecial: body.isSpecial === true,
      order: body.order || 0,
      portions: body.portions || [],
      gst: body.gst !== undefined ? Number(body.gst) : 5,
    });

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("POST /api/menu error:", error);
    return NextResponse.json({ success: false, error: "Failed to create item" }, { status: 500 });
  }
}

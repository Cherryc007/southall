import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Category } from "@/lib/models/Category";
import { seedDefaultData } from "@/lib/helpers";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ order: 1 });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const category = await Category.create({
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, "-"),
      icon: body.icon || "🍽️",
      order: body.order || 0,
    });
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to create category" }, { status: 500 });
  }
}

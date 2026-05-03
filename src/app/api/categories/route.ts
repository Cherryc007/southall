import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Category } from "@/lib/models/Category";
import { seedDefaultData } from "@/lib/helpers";

export async function GET() {
  try {
    await connectDB();
    await seedDefaultData(); // Ensure base categories exist
    const categories = await Category.find().sort({ order: 1 });
    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    console.error("API GET Categories Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to fetch categories",
      details: error.name === "MongooseServerSelectionError" ? "Could not connect to MongoDB Atlas. Please check if your IP is whitelisted (0.0.0.0/0) in Atlas." : "Internal Server Error"
    }, { status: 500 });
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

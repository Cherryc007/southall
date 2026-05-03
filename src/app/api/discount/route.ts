import { NextResponse } from "next/server";
import { isDiscountActive } from "@/lib/helpers";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    const settings = await getOrCreateSettings();
    return NextResponse.json({ 
      success: true, 
      data: {
        global: { active: settings.globalDiscountEnabled, percent: settings.globalDiscountPercent },
        chamber: { active: settings.chamberDiscountEnabled, percent: settings.chamberDiscountPercent }
      } 
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

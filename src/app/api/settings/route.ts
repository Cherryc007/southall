import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Settings } from "@/lib/models/Settings";
import { getOrCreateSettings } from "@/lib/helpers";

export async function GET() {
  try {
    await connectDB();
    const settings = await getOrCreateSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(body);
    } else {
      Object.assign(settings, body);
      await settings.save();
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 });
  }
}

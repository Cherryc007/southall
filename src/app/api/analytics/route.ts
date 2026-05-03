import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order";

export async function GET() {
  try {
    await connectDB();
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const todayOrders = await Order.find({
      createdAt: { $gte: start, $lte: end },
      status: { $ne: "cancelled" },
    });

    const totalOrders = todayOrders.length;
    const totalRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);

    // Top selling items
    const itemMap: Record<string, { name: string; count: number; revenue: number }> = {};
    for (const order of todayOrders) {
      for (const item of order.items) {
        if (!itemMap[item.menuItemId]) {
          itemMap[item.menuItemId] = { name: item.name, count: 0, revenue: 0 };
        }
        itemMap[item.menuItemId].count += item.quantity;
        itemMap[item.menuItemId].revenue += item.price * item.quantity;
      }
    }
    const topItems = Object.entries(itemMap)
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Status breakdown
    const statusCounts = { new: 0, preparing: 0, ready: 0, completed: 0, cancelled: 0 };
    const allToday = await Order.find({ createdAt: { $gte: start, $lte: end } });
    for (const o of allToday) {
      statusCounts[o.status as keyof typeof statusCounts]++;
    }

    return NextResponse.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        topItems,
        statusCounts,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 });
  }
}

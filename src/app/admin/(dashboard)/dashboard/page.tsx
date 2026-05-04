"use client";
import { useEffect, useState } from "react";
import OrderCard from "@/components/admin/OrderCard";

export default function DashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);

  const fetchOrders = async () => {
    try {
      const [ordersRes, settingsRes] = await Promise.all([
        fetch("/api/orders?date=today"),
        fetch("/api/settings")
      ]);
      const data = await ordersRes.json();
      const sett = await settingsRes.json();
      if (data.success) {
        setOrders(data.data);
      }
      if (sett.success) {
        setSettings(sett.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const activeOrders = orders.filter(o => ["new", "preparing", "ready"].includes(o.status));
  
  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div className="spinner spinner-dark" />
    </div>
  );

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Live Orders</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {settings?.globalDiscountEnabled && (
            <div style={{ background: "rgba(255,107,0,0.1)", padding: "6px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600, color: "var(--brand-gold)", border: "1px solid rgba(255,107,0,0.2)" }}>
              🎉 {settings.globalDiscountPercent}% Global Discount Active
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)", display: "inline-block", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>Live Updates</span>
          </div>
        </div>
      </div>

      {activeOrders.length === 0 ? (
        <div className="card card-pad" style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🍽️</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--brand-dark)" }}>No active orders right now</h3>
          <p style={{ color: "var(--text-muted)" }}>New orders will appear here in real-time.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {activeOrders.map(order => (
            <OrderCard key={order._id} order={order} onUpdate={fetchOrders} />
          ))}
        </div>
      )}
    </div>
  );
}

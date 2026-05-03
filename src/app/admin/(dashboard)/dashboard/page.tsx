"use client";
import { useEffect, useState } from "react";
import OrderCard from "@/components/admin/OrderCard";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Dashboard() {
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
    const interval = setInterval(fetchOrders, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const activeOrders = orders.filter(o => ["new", "preparing", "ready"].includes(o.status));
  
  if (loading) return <div className="spinner spinner-dark" />;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Live Orders</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {settings?.globalDiscountEnabled && (
            <a href="/admin/discounts" style={{ textDecoration: "none", background: "rgba(212,160,23,0.15)", padding: "6px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600, color: "var(--brand-gold-light)", display: "flex", alignItems: "center", gap: 6, border: "1px solid rgba(212,160,23,0.3)" }}>
              <span>🎉</span> {settings.globalDiscountPercent}% Global Discount Active
            </a>
          )}
          {settings?.chamberDiscountEnabled && (
            <a href="/admin/discounts" style={{ textDecoration: "none", background: "rgba(33,150,243,0.15)", padding: "6px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600, color: "#2196f3", display: "flex", alignItems: "center", gap: 6, border: "1px solid rgba(33,150,243,0.3)" }}>
              <span>👔</span> Staff/Chamber Active
            </a>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)", display: "inline-block", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>Live Updates</span>
          </div>
        </div>
      </div>

      {activeOrders.length === 0 ? (
        <div style={{ background: "white", padding: 60, textAlign: "center", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🍽️</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--brand-dark)" }}>No active orders right now</h3>
          <p style={{ color: "var(--text-muted)" }}>Orders will appear here automatically when placed.</p>
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

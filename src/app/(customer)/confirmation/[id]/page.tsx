"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface OrderItem { name: string; price: number; quantity: number; }
interface Order {
  _id: string; orderId: string; items: OrderItem[];
  subtotal: number; discountPercent: number; discountAmount: number; total: number;
  phone: string; chamber: string; notes: string; status: string; createdAt: string;
}

function fmt(n: number) { return `₹${n.toFixed(2)}`; }

const STATUS_INFO: Record<string, { label: string; color: string; icon: string; message: string }> = {
  new: { label: "Order Received", color: "#1565c0", icon: "✅", message: "We've received your order and are reviewing it." },
  preparing: { label: "Being Prepared", color: "#e65100", icon: "👨‍🍳", message: "Your food is being freshly prepared!" },
  ready: { label: "Ready!", color: "#2e7d32", icon: "🎉", message: "Your order is ready. Please collect or wait for delivery." },
  completed: { label: "Completed", color: "#6a1b9a", icon: "🌟", message: "Order completed. Thank you for dining with us!" },
  cancelled: { label: "Cancelled", color: "#880e4f", icon: "❌", message: "This order has been cancelled. Please contact us for help." },
};

export default function ConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<{ restaurantName: string; restaurantPhone: string; restaurantAddress: string }>({ restaurantName: "Southall Kitchen", restaurantPhone: "", restaurantAddress: "" });
  const [id, setId] = useState("");

  useEffect(() => {
    params.then(p => {
      setId(p.id);
      Promise.all([
        fetch(`/api/orders/${p.id}`).then(r => r.json()),
        fetch("/api/settings").then(r => r.json()),
      ]).then(([orderData, settData]) => {
        if (!orderData.success) { setError("Order not found"); return; }
        setOrder(orderData.data);
        if (settData.data) setSettings(settData.data);
      }).catch(() => setError("Failed to load order")).finally(() => setLoading(false));
    });
  }, [params]);

  // Auto-refresh status every 30s
  useEffect(() => {
    if (!id || !order || order.status === "completed" || order.status === "cancelled") return;
    const interval = setInterval(async () => {
      const r = await fetch(`/api/orders/${id}`);
      const d = await r.json();
      if (d.success) setOrder(d.data);
    }, 30000);
    return () => clearInterval(interval);
  }, [id, order]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)" }}>
      <div className="spinner spinner-dark" style={{ width: 40, height: 40 }} />
    </div>
  );

  if (error || !order) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24, background: "var(--bg-primary)" }}>
      <div style={{ fontSize: 48 }}>❌</div>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Order Not Found</h1>
      <p style={{ color: "var(--text-muted)", textAlign: "center" }}>{error}</p>
      <Link href="/" className="btn btn-primary">Back to Menu</Link>
    </div>
  );

  const statusInfo = STATUS_INFO[order.status] || STATUS_INFO.new;

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ background: "var(--brand-dark)", padding: "20px 20px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>{statusInfo.icon}</div>
        <h1 style={{ color: "white", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{statusInfo.label}</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>{statusInfo.message}</p>
      </div>

      <div style={{ maxWidth: 480, margin: "-16px auto 0", padding: "0 16px" }}>
        {/* Order ID Card */}
        <div className="card card-pad slide-up" style={{ marginBottom: 16, textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 4 }}>Order ID</p>
          <p style={{ fontSize: 26, fontWeight: 900, letterSpacing: 2, color: "var(--brand-dark)" }}>{order.orderId}</p>
          <p style={{ color: "var(--text-light)", fontSize: 12, marginTop: 4 }}>{new Date(order.createdAt).toLocaleString()}</p>
          {order.chamber && <div style={{ marginTop: 8 }}><span className="badge badge-blue">📍 {order.chamber}</span></div>}
        </div>

        {/* Items */}
        <div className="card slide-up" style={{ marginBottom: 16, animationDelay: "0.1s" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-light)", fontWeight: 700, fontSize: 15 }}>Order Items</div>
          <div style={{ padding: "12px 20px" }}>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < order.items.length - 1 ? "1px dashed var(--border-light)" : "none" }}>
                <span style={{ color: "var(--text-secondary)" }}>{item.name} <span style={{ color: "var(--text-light)" }}>× {item.quantity}</span></span>
                <span style={{ fontWeight: 600 }}>{fmt(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: "12px 20px", background: "var(--bg-secondary)", borderTop: "1px solid var(--border-light)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
              <span>{fmt(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, color: "var(--success)" }}>
                <span>🎉 Discount ({order.discountPercent}%)</span>
                <span>−{fmt(order.discountAmount)}</span>
              </div>
            )}
            <div className="divider" />
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 18 }}>
              <span>Total Paid</span>
              <span style={{ color: "var(--brand-dark)" }}>{fmt(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="card card-pad slide-up" style={{ marginBottom: 20, animationDelay: "0.2s" }}>
          <p style={{ fontWeight: 700, marginBottom: 8 }}>📞 Need help with your order?</p>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 4 }}>{settings.restaurantName}</p>
          {settings.restaurantPhone && <p style={{ color: "var(--brand-gold)", fontSize: 15, fontWeight: 600 }}>{settings.restaurantPhone}</p>}
          {settings.restaurantAddress && <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>{settings.restaurantAddress}</p>}
        </div>

        <Link href="/" className="btn btn-dark btn-full" style={{ display: "flex" }}>← Back to Menu</Link>
      </div>
    </div>
  );
}

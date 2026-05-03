"use client";
import { useState } from "react";

interface OrderItem { name: string; price: number; quantity: number; }
interface Order {
  _id: string; orderId: string; items: OrderItem[]; total: number;
  phone: string; chamber: string; notes: string; status: string; createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: "status-new",
  preparing: "status-preparing",
  ready: "status-ready",
  completed: "status-completed",
  cancelled: "status-cancelled",
};

export default function OrderCard({ order, onUpdate }: { order: Order; onUpdate: () => void }) {
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: string) {
    setLoading(true);
    await fetch(`/api/orders/${order._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setLoading(false);
    onUpdate();
  }

  return (
    <div className="order-card fade-in">
      <div className="order-card-header">
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: "var(--brand-dark)" }}>{order.orderId}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        <span className={`badge ${STATUS_COLORS[order.status]}`} style={{ padding: "6px 12px", fontSize: 13 }}>
          {order.status.toUpperCase()}
        </span>
      </div>
      
      <div className="order-card-body">
        {/* Customer Info */}
        <div style={{ marginBottom: 16, fontSize: 14 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
            <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>📞 {order.phone}</span>
            {order.chamber && <span className="badge badge-gray">📍 {order.chamber}</span>}
          </div>
          {order.notes && (
            <div style={{ background: "var(--warning-bg)", color: "var(--warning)", padding: "8px 12px", borderRadius: "var(--radius-sm)", fontSize: 13, marginTop: 8 }}>
              <strong>Note:</strong> {order.notes}
            </div>
          )}
        </div>

        {/* Items */}
        <div style={{ borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)", padding: "12px 0", marginBottom: 16 }}>
          {order.items.map((item, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 14 }}>
              <span style={{ fontWeight: 500 }}><span style={{ color: "var(--brand-gold)", fontWeight: 800, marginRight: 8 }}>{item.quantity}x</span> {item.name}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ color: "var(--text-secondary)" }}>Total</span>
          <span style={{ fontWeight: 800, fontSize: 18, color: "var(--brand-dark)" }}>₹{order.total.toFixed(2)}</span>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {order.status === "new" && (
            <>
              <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => updateStatus("cancelled")} disabled={loading}>Cancel</button>
              <button className="btn btn-primary btn-sm" style={{ flex: 2 }} onClick={() => updateStatus("preparing")} disabled={loading}>Accept & Prepare</button>
            </>
          )}
          {order.status === "preparing" && (
            <button className="btn btn-primary btn-sm" style={{ flex: 1, background: "var(--success)", color: "white" }} onClick={() => updateStatus("ready")} disabled={loading}>Mark Ready</button>
          )}
          {order.status === "ready" && (
            <button className="btn btn-dark btn-sm" style={{ flex: 1 }} onClick={() => updateStatus("completed")} disabled={loading}>Complete Order</button>
          )}
        </div>
      </div>
    </div>
  );
}

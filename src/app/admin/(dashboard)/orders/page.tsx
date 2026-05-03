"use client";
import { useEffect, useState } from "react";
import OrderCard from "@/components/admin/OrderCard";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function OrdersHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div className="spinner spinner-dark" />;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>All Orders History</h1>

      {orders.length === 0 ? (
        <div style={{ background: "white", padding: 60, textAlign: "center", borderRadius: "var(--radius-lg)" }}>
          <p style={{ color: "var(--text-muted)" }}>No orders found.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {orders.map(order => (
            <OrderCard key={order._id} order={order} onUpdate={fetchOrders} />
          ))}
        </div>
      )}
    </div>
  );
}

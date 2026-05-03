"use client";
import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Analytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then(r => r.json())
      .then(d => {
        if (d.success) setData(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner spinner-dark" />;
  if (!data) return <div>Failed to load analytics</div>;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Today's Analytics</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 32 }}>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-value">{data.totalOrders}</div>
          <div className="stat-label">Total Orders Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">₹{data.totalRevenue.toFixed(2)}</div>
          <div className="stat-label">Revenue Today</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Top Items */}
        <div className="card">
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-light)", fontWeight: 700 }}>
            Top Selling Items
          </div>
          <div style={{ padding: "12px 20px" }}>
            {data.topItems.length === 0 ? (
              <div style={{ color: "var(--text-muted)", padding: 12 }}>No items sold yet today.</div>
            ) : (
              data.topItems.map((item: any, i: number) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: i < data.topItems.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{item.count} units sold</div>
                  </div>
                  <div style={{ fontWeight: 700, color: "var(--brand-dark)" }}>
                    ₹{item.revenue.toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="card">
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-light)", fontWeight: 700 }}>
            Orders Status Breakdown
          </div>
          <div style={{ padding: "12px 20px" }}>
            {Object.entries(data.statusCounts).map(([status, count]: any) => (
              <div key={status} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0" }}>
                <span style={{ textTransform: "capitalize", fontWeight: 500 }}>{status}</span>
                <span className="badge badge-gray">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

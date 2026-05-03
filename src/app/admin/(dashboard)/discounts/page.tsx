"use client";
import { useEffect, useState } from "react";

export default function DiscountsPage() {
  const [settings, setSettings] = useState({
    globalDiscountEnabled: false,
    globalDiscountPercent: 10,
    chamberDiscountEnabled: false,
    chamberDiscountPercent: 20
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(d => {
      if (d.success && d.data) setSettings(d.data);
      setLoading(false);
    });
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setMsg("Discounts saved successfully!");
        setTimeout(() => setMsg(""), 3000);
      }
    } catch (error) {
      console.error(error);
      setMsg("Error saving discounts.");
    }
    setSaving(false);
  };

  if (loading) return <div className="spinner spinner-dark" />;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Discount Control</h1>
      
      <div className="card card-pad" style={{ maxWidth: 600 }}>
        <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          
          {/* Global Discount */}
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Global Discount</h3>
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 16 }}>Applies automatically to all items for all customers on the website.</p>
            
            <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, cursor: "pointer" }}>
              <input 
                type="checkbox" 
                checked={settings.globalDiscountEnabled} 
                onChange={e => setSettings({...settings, globalDiscountEnabled: e.target.checked})} 
                style={{ width: 18, height: 18 }}
              />
              <span style={{ fontWeight: 600 }}>Enable Global Discount</span>
            </label>

            {settings.globalDiscountEnabled && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, background: "var(--bg-secondary)", padding: 16, borderRadius: "var(--radius-sm)" }}>
                <div className="form-group">
                  <label className="form-label">Discount Percentage (%)</label>
                  <input type="number" min="0" max="100" className="form-input" value={settings.globalDiscountPercent} onChange={e => setSettings({...settings, globalDiscountPercent: Number(e.target.value)})} />
                </div>
              </div>
            )}
          </div>

          <div className="divider" />

          {/* Chamber / Staff Discount */}
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Chamber / Staff Discount</h3>
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 16 }}>Applies only when a customer provides a Chamber Number during checkout.</p>
            
            <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, cursor: "pointer" }}>
              <input 
                type="checkbox" 
                checked={settings.chamberDiscountEnabled} 
                onChange={e => setSettings({...settings, chamberDiscountEnabled: e.target.checked})} 
                style={{ width: 18, height: 18 }}
              />
              <span style={{ fontWeight: 600 }}>Enable Chamber Discount</span>
            </label>

            {settings.chamberDiscountEnabled && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, background: "var(--bg-secondary)", padding: 16, borderRadius: "var(--radius-sm)" }}>
                <div className="form-group">
                  <label className="form-label">Discount Percentage (%)</label>
                  <input type="number" min="0" max="100" className="form-input" value={settings.chamberDiscountPercent} onChange={e => setSettings({...settings, chamberDiscountPercent: Number(e.target.value)})} />
                </div>
              </div>
            )}
          </div>

          {msg && <div style={{ color: msg.includes("Error") ? "var(--error)" : "var(--success)", background: msg.includes("Error") ? "var(--error-bg)" : "var(--success-bg)", padding: 12, borderRadius: "var(--radius-sm)" }}>{msg}</div>}

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Discounts"}
          </button>
        </form>
      </div>
    </div>
  );
}

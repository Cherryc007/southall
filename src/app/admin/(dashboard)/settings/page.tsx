"use client";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    restaurantName: "Southall Kitchen",
    bannerMessage: "Fresh food, fast service",
    restaurantPhone: "",
    restaurantAddress: ""
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
        setMsg("Settings saved successfully!");
        setTimeout(() => setMsg(""), 3000);
      }
    } catch (error) {
      console.error(error);
      setMsg("Error saving settings.");
    }
    setSaving(false);
  };

  if (loading) return <div className="spinner spinner-dark" />;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>System Settings</h1>
      
      <div className="card card-pad" style={{ maxWidth: 600 }}>
        <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Restaurant Name</label>
                <input type="text" className="form-input" value={settings.restaurantName} onChange={e => setSettings({...settings, restaurantName: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Banner Message</label>
                <input type="text" className="form-input" value={settings.bannerMessage} onChange={e => setSettings({...settings, bannerMessage: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Support Phone</label>
                <input type="text" className="form-input" value={settings.restaurantPhone} onChange={e => setSettings({...settings, restaurantPhone: e.target.value})} />
              </div>
            </div>


          {msg && <div style={{ color: msg.includes("Error") ? "var(--error)" : "var(--success)", background: msg.includes("Error") ? "var(--error-bg)" : "var(--success-bg)", padding: 12, borderRadius: "var(--radius-sm)" }}>{msg}</div>}

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </div>
    </div>
  );
}

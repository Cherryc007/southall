"use client";
import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MenuManagement() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    _id: "", name: "", description: "", price: "", category: "", 
    image: "", tags: "", available: true, isSpecial: false, order: 0,
    hasPortions: false, portions: [] as {name: string, price: string}[], gst: 5
  });
  const [uploading, setUploading] = useState(false);

  const fetchAll = async () => {
    try {
      const [m, c] = await Promise.all([
        fetch("/api/menu").then(r => r.json()),
        fetch("/api/categories").then(r => r.json())
      ]);
      if (m.success) setItems(m.data);
      if (c.success) setCategories(c.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openNew = () => {
    setForm({ 
      _id: "", name: "", description: "", price: "", category: categories[0]?.slug || "", 
      image: "", tags: "", available: true, isSpecial: false, order: 0,
      hasPortions: false, portions: [{ name: "Full", price: "" }, { name: "Half", price: "" }], gst: 5
    });
    setIsEditing(true);
  };

  const openEdit = (item: any) => {
    const hasPortions = item.portions && item.portions.length > 0;
    setForm({
      ...item,
      tags: item.tags?.join(", ") || "",
      hasPortions,
      portions: hasPortions ? item.portions.map((p: any) => ({ name: p.name, price: String(p.price) })) : [{ name: "Full", price: "" }, { name: "Half", price: "" }],
      gst: item.gst || 0
    });
    setIsEditing(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setForm(prev => ({ ...prev, image: data.url }));
      } else {
        alert(data.error);
      }
    } catch (e) {
      alert("Upload failed");
    }
    setUploading(false);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: form.hasPortions ? 0 : Number(form.price),
      portions: form.hasPortions ? form.portions.map(p => ({ name: p.name, price: Number(p.price) })).filter(p => p.name && !isNaN(p.price)) : [],
      tags: form.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
    };
    
    const url = form._id ? `/api/menu/${form._id}` : "/api/menu";
    const method = form._id ? "PUT" : "POST";
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    setIsEditing(false);
    fetchAll();
  };

  const del = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/menu/${id}`, { method: "DELETE" });
    fetchAll();
  };

  const togglePause = async (item: any) => {
    await fetch(`/api/menu/${item._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !item.available })
    });
    fetchAll();
  };

  if (loading) return <div className="spinner spinner-dark" />;

  if (isEditing) return (
    <div className="card card-pad" style={{ maxWidth: 800 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800 }}>{form._id ? "Edit Menu Item" : "New Menu Item"}</h2>
      </div>

      <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Item Name</label>
          <input className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        </div>
        
        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-input" required value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
            <option value="">Select Category...</option>
            {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">GST (%)</label>
          <select className="form-input" value={form.gst} onChange={e => setForm({...form, gst: Number(e.target.value)})}>
            <option value={0}>0%</option>
            <option value={5}>5%</option>
            <option value={12}>12%</option>
            <option value={18}>18%</option>
          </select>
        </div>

        <div className="form-group">
          <label style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
            <input type="checkbox" checked={form.hasPortions || false} onChange={e => setForm({...form, hasPortions: e.target.checked})} />
            Item has multiple portions (e.g. Half/Full)?
          </label>
        </div>

        {form.hasPortions ? (
          <div className="form-group" style={{ background: "var(--bg-primary)", padding: 16, borderRadius: 8, border: "1px solid var(--border-light)" }}>
            <label className="form-label">Define Portions</label>
            {form.portions.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <input className="form-input" placeholder="Name (e.g. Full)" value={p.name} onChange={e => {
                  const newP = [...form.portions]; newP[i].name = e.target.value; setForm({...form, portions: newP});
                }} />
                <input type="number" className="form-input" placeholder="Price" value={p.price} onChange={e => {
                  const newP = [...form.portions]; newP[i].price = e.target.value; setForm({...form, portions: newP});
                }} />
                <button type="button" className="btn btn-ghost" style={{ color: "var(--error)", padding: "0 12px" }} onClick={() => {
                  const newP = form.portions.filter((_, idx) => idx !== i); setForm({...form, portions: newP});
                }}>✕</button>
              </div>
            ))}
            <button type="button" className="btn btn-ghost btn-sm" style={{ width: "100%", background: "white" }} onClick={() => setForm({...form, portions: [...form.portions, {name: "", price: ""}]})}>+ Add Portion</button>
          </div>
        ) : (
          <div className="form-group">
            <label className="form-label">Price (₹)</label>
            <input type="number" step="0.01" className="form-input" required={!form.hasPortions} value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Tags & Image (Optional)</label>
          <input className="form-input" placeholder="Tags (comma separated)" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} style={{ marginBottom: 10 }} />
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {form.image && <img src={form.image} alt="Preview" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 4 }} />}
            <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
            {uploading && <span className="spinner spinner-dark" />}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button type="button" className="btn btn-ghost" onClick={() => setIsEditing(false)}>Cancel</button>
          <button className="btn btn-primary" style={{ background: "var(--brand-gold)" }}>{form._id ? "Update Item" : "Create Item"}</button>
        </div>
      </form>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
        <button className="btn btn-primary" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border-color)", fontWeight: 600 }} onClick={openNew}>Manage Menu</button>
      </div>

      <div className="card" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--border-light)", textAlign: "left", color: "var(--text-secondary)" }}>
              <th style={{ padding: 16, fontWeight: 600 }}>Item Name</th>
              <th style={{ padding: 16, fontWeight: 600 }}>Category</th>
              <th style={{ padding: 16, fontWeight: 600 }}>Pricing Detail</th>
              <th style={{ padding: 16, fontWeight: 600 }}>GST</th>
              <th style={{ padding: 16, textAlign: "right", fontWeight: 600 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                <td style={{ padding: 16, fontWeight: 500, color: "var(--brand-dark)" }}>{item.name}</td>
                <td style={{ padding: 16 }}>
                  <span style={{ padding: "4px 10px", background: "#d1fae5", color: "#065f46", borderRadius: 12, fontSize: 12, fontWeight: 600, textTransform: "capitalize" }}>{item.category}</span>
                </td>
                <td style={{ padding: 16, color: "var(--text-secondary)" }}>
                  {item.portions && item.portions.length > 0 ? (
                    <div style={{ fontSize: 13 }}>
                      {item.portions.map((p: any, i: number) => <div key={i}>{p.name}: ₹{p.price.toFixed(2)}</div>)}
                    </div>
                  ) : (
                    <span>₹{item.price.toFixed(2)}</span>
                  )}
                </td>
                <td style={{ padding: 16 }}>{item.gst || 0}%</td>
                <td style={{ padding: 16, textAlign: "right" }}>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button 
                      className="btn btn-sm" 
                      style={{ 
                        border: "1px solid", 
                        borderColor: item.available ? "var(--border-color)" : "var(--error)", 
                        background: item.available ? "white" : "var(--error-bg)",
                        color: item.available ? "var(--text-primary)" : "var(--error)",
                        fontSize: 12 
                      }} 
                      onClick={() => togglePause(item)}
                    >
                      {item.available ? "Pause" : "Resume"}
                    </button>
                    <button className="btn btn-ghost btn-sm" style={{ border: "1px solid var(--border-light)", padding: "4px 8px" }} onClick={() => openEdit(item)}>✏️</button>
                    <button className="btn btn-ghost btn-sm" style={{ border: "1px solid var(--error)", color: "var(--error)", padding: "4px 8px" }} onClick={() => del(item._id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

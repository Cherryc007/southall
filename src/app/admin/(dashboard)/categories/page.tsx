"use client";
import { useEffect, useState } from "react";

export default function CategoryManagement() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ _id: "", name: "", slug: "", icon: "🍽️", order: 0 });

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openNew = () => {
    setForm({ _id: "", name: "", slug: "", icon: "🍽️", order: categories.length + 1 });
    setIsEditing(true);
  };

  const openEdit = (cat: any) => {
    setForm({ ...cat });
    setIsEditing(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = form._id ? `/api/categories/${form._id}` : "/api/categories";
    const method = form._id ? "PUT" : "POST";
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    
    setIsEditing(false);
    fetchCategories();
  };

  const del = async (id: string) => {
    if (!confirm("Are you sure? Deleting this category will not delete its menu items, but they will become orphaned.")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  if (loading) return <div className="spinner spinner-dark" />;

  if (isEditing) return (
    <div className="card card-pad" style={{ maxWidth: 600 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800 }}>{form._id ? "Edit Category" : "New Category"}</h2>
      </div>

      <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Category Name</label>
          <input className="form-input" required value={form.name} onChange={e => {
            const name = e.target.value;
            // auto slug
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
            setForm({...form, name, slug: form._id ? form.slug : slug});
          }} />
        </div>
        
        <div className="form-group">
          <label className="form-label">Slug (URL ID)</label>
          <input className="form-input" required value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} />
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Emoji Icon</label>
            <input className="form-input" required value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Sort Order</label>
            <input type="number" className="form-input" required value={form.order} onChange={e => setForm({...form, order: Number(e.target.value)})} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button type="button" className="btn btn-ghost" onClick={() => setIsEditing(false)}>Cancel</button>
          <button className="btn btn-primary" style={{ background: "var(--brand-gold)" }}>{form._id ? "Update Category" : "Create Category"}</button>
        </div>
      </form>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Manage Categories</h1>
        <button className="btn btn-primary" onClick={openNew}>+ New Category</button>
      </div>

      <div className="card" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--border-light)", textAlign: "left", color: "var(--text-secondary)" }}>
              <th style={{ padding: 16, width: 60 }}>Icon</th>
              <th style={{ padding: 16, fontWeight: 600 }}>Category Name</th>
              <th style={{ padding: 16, fontWeight: 600 }}>Slug</th>
              <th style={{ padding: 16, fontWeight: 600 }}>Sort Order</th>
              <th style={{ padding: 16, textAlign: "right", fontWeight: 600 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                <td style={{ padding: 16, fontSize: 20 }}>{cat.icon}</td>
                <td style={{ padding: 16, fontWeight: 600, color: "var(--brand-dark)" }}>{cat.name}</td>
                <td style={{ padding: 16, color: "var(--text-secondary)" }}>{cat.slug}</td>
                <td style={{ padding: 16, color: "var(--text-secondary)" }}>{cat.order}</td>
                <td style={{ padding: 16, textAlign: "right" }}>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button className="btn btn-ghost btn-sm" style={{ border: "1px solid var(--border-light)", padding: "4px 8px" }} onClick={() => openEdit(cat)}>✏️</button>
                    <button className="btn btn-ghost btn-sm" style={{ border: "1px solid var(--error)", color: "var(--error)", padding: "4px 8px" }} onClick={() => del(cat._id)}>🗑️</button>
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

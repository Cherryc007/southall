"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/admin/orders", label: "All Orders", icon: "📋" },
    { href: "/admin/categories", label: "Categories", icon: "📑" },
    { href: "/admin/menu", label: "Menu Items", icon: "🍔" },
    { href: "/admin/analytics", label: "Analytics", icon: "📈" },
    { href: "/admin/discounts", label: "Discounts", icon: "🎟️" },
    { href: "/admin/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="admin-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div style={{ padding: "24px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--brand-gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "var(--brand-dark)", flexShrink: 0 }}>🍽️</div>
          <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.5 }}>Southall Kitchen</div>
        </div>

        <nav style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: 4 }}>
          {links.map(link => {
            const active = pathname.startsWith(link.href);
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`admin-nav-link ${active ? "active" : ""}`}
                onClick={() => setSidebarOpen(false)}
                style={{ borderRadius: "var(--radius-md)" }}
              >
                <span style={{ fontSize: 18 }}>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "20px 10px" }}>
          <button 
            className="admin-nav-link" 
            style={{ width: "100%", borderRadius: "var(--radius-md)", color: "#ff8a80" }}
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
          >
            <span style={{ fontSize: 18 }}>🚪</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <header className="admin-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button 
              className="btn-icon" 
              style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, background: "var(--bg-secondary)" }}
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
              {links.find(l => pathname.startsWith(l.href))?.label || "Admin Panel"}
            </h2>
          </div>
          <div>
            <Link href="/" target="_blank" className="btn btn-outline btn-sm">
              View Site ↗
            </Link>
          </div>
        </header>
        <div className="admin-body">
          {children}
        </div>
      </main>
    </div>
  );
}

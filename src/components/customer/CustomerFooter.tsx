"use client";
import { useEffect, useState } from "react";

interface Settings {
  restaurantName: string;
  bannerMessage: string;
  restaurantPhone: string;
  restaurantEmail: string;
  instagramUrl: string;
  googleMapsUrl: string;
}

export default function CustomerFooter() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(d => {
      if (d.success) setSettings(d.data);
    });
  }, []);

  if (!settings) return null;

  const waNumber = settings.restaurantPhone.replace(/\D/g, "");

  return (
    <footer style={{ background: "var(--brand-dark)", color: "white", padding: "40px 20px 100px", marginTop: "auto" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        {/* Restaurant Info */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 4 }}>{settings.restaurantName}</h2>
          <p style={{ color: "var(--brand-gold)", fontSize: 14, fontWeight: 600 }}>{settings.bannerMessage}</p>
        </div>

        {/* Google Maps Highlight */}
        <a 
          href={settings.googleMapsUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
            background: "var(--brand-gold)", color: "var(--brand-dark)",
            padding: "16px 24px", borderRadius: "var(--radius-lg)",
            fontWeight: 800, fontSize: 16, textDecoration: "none",
            marginBottom: 32, boxShadow: "0 8px 24px rgba(212,160,23,0.3)",
            transition: "transform 0.2s"
          }}
          onPointerDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
          onPointerUp={e => (e.currentTarget.style.transform = "scale(1)")}
        >
          <span style={{ fontSize: 22 }}>📍</span> Find Us on Map
        </a>

        {/* Contact Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 32 }}>
          <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="footer-action">
            <span className="footer-action-icon">💬</span>
            <span className="footer-action-label">WhatsApp</span>
          </a>
          <a href={`tel:${settings.restaurantPhone}`} className="footer-action">
            <span className="footer-action-icon">📞</span>
            <span className="footer-action-label">Call</span>
          </a>
          <a href={`mailto:${settings.restaurantEmail}`} className="footer-action">
            <span className="footer-action-icon">✉️</span>
            <span className="footer-action-label">Email</span>
          </a>
        </div>

        {/* Social */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24 }}>
          <a 
            href={settings.instagramUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}
          >
            <span style={{ fontSize: 20 }}>📸</span> Follow us on Instagram
          </a>
        </div>

        <p style={{ marginTop: 40, fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
          &copy; {new Date().getFullYear()} {settings.restaurantName}. All rights reserved.
        </p>
      </div>

      <style jsx>{`
        .footer-action {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.05);
          padding: 16px 8px;
          border-radius: var(--radius-md);
          text-decoration: none;
          color: white;
          transition: all 0.2s;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .footer-action:active {
          background: rgba(255,255,255,0.1);
          transform: translateY(2px);
        }
        .footer-action-icon {
          font-size: 24px;
        }
        .footer-action-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: rgba(255,255,255,0.6);
        }
      `}</style>
    </footer>
  );
}

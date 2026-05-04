"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";

interface DiscountConfig { active: boolean; percent: number; }
interface Discounts { global: DiscountConfig; chamber: DiscountConfig; }

function fmt(n: number) { return `₹${n.toFixed(2)}`; }

export default function CartDrawer({ onClose, discounts }: { onClose: () => void; discounts: Discounts | null }) {
  const { items, updateQty, remove, total, clear } = useCart();
  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const [phone, setPhone] = useState("");
  const [chamber, setChamber] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Calculate active discount
  let activeDiscountPercent = 0;
  let activeDiscountName = "";

  if (chamber.trim() && discounts?.chamber.active) {
    activeDiscountPercent = discounts.chamber.percent;
    activeDiscountName = "Chamber/Staff";
  } else if (discounts?.global.active) {
    activeDiscountPercent = discounts.global.percent;
    activeDiscountName = "Global";
  }

  const discountAmount = activeDiscountPercent > 0 ? (total * activeDiscountPercent) / 100 : 0;
  const finalTotal = total - discountAmount;

  async function placeOrder() {
    if (!phone.trim()) { setError("Please enter your phone number"); return; }
    if (phone.trim().length < 7) { setError("Please enter a valid phone number"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, phone: phone.trim(), chamber: chamber.trim(), notes: notes.trim() }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to place order");
      clear();
      onClose();
      router.push(`/confirmation/${data.data._id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <div className="cart-drawer">
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--border-color)" }} />
        </div>

        <div style={{ padding: "0 20px 20px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800 }}>{step === "cart" ? "🛒 Your Cart" : "📋 Checkout"}</h2>
            <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ fontSize: 20, padding: "4px 8px" }}>✕</button>
          </div>

          {step === "cart" ? (
            <>
              {/* Cart Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                {items.map(item => (
                  <div key={item.cartItemId} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", background: "var(--bg-secondary)", borderRadius: "var(--radius-md)" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{item.name} {item.portionName && <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>({item.portionName})</span>}</div>
                      <div style={{ color: "var(--text-muted)", fontSize: 13 }}>{fmt(item.price)} each</div>
                    </div>
                    <div className="qty-control" style={{ background: "white" }}>
                      <button className="qty-btn" onClick={() => updateQty(item.cartItemId, item.quantity - 1)}>−</button>
                      <span className="qty-count">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.cartItemId, item.quantity + 1)}>+</button>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14, minWidth: 52, textAlign: "right" }}>{fmt(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div style={{ background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", padding: 16, marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>{fmt(total)}</span>
                </div>
                {activeDiscountPercent > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "var(--success)" }}>
                    <span>🎉 {activeDiscountName} Discount ({activeDiscountPercent}%)</span>
                    <span style={{ fontWeight: 600 }}>−{fmt(discountAmount)}</span>
                  </div>
                )}
                <div className="divider" />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 800, fontSize: 17 }}>Total Payable</span>
                  <span style={{ fontWeight: 800, fontSize: 17, color: "var(--brand-dark)" }}>{fmt(finalTotal)}</span>
                </div>
              </div>

              <button className="btn btn-primary btn-full btn-lg" onClick={() => setStep("checkout")}>Proceed to Checkout →</button>
            </>
          ) : (
            <>
              {/* Checkout Form */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input className="form-input" type="tel" placeholder="+44 7xxx xxxxxx" value={phone} onChange={e => setPhone(e.target.value)} autoFocus />
                </div>
                <div className="form-group">
                  <label className="form-label">Chamber Number and Building (optional)</label>
                  <input className="form-input" type="text" placeholder="e.g. Building 1, Chamber 5" value={chamber} onChange={e => setChamber(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Special Notes (optional)</label>
                  <textarea className="form-input" placeholder="Allergies, special requests..." value={notes} onChange={e => setNotes(e.target.value)} rows={3} />
                </div>
              </div>

              {/* Order Summary */}
              <div style={{ background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", padding: 14, marginBottom: 16, fontSize: 13 }}>
                {items.map(i => (
                  <div key={i.cartItemId} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: "var(--text-secondary)" }}>{i.name} {i.portionName ? `(${i.portionName})` : ''} × {i.quantity}</span>
                    <span style={{ fontWeight: 600 }}>{fmt(i.price * i.quantity)}</span>
                  </div>
                ))}
                <div className="divider" />
                {activeDiscountPercent > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--success)", marginBottom: 4 }}>
                    <span>{activeDiscountName} Discount ({activeDiscountPercent}%)</span>
                    <span>−{fmt(discountAmount)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800 }}>
                  <span>Total Payable</span>
                  <span style={{ color: "var(--brand-dark)", fontSize: 16 }}>{fmt(finalTotal)}</span>
                </div>
              </div>

              {error && (
                <div style={{ background: "var(--error-bg)", color: "var(--error)", padding: "10px 14px", borderRadius: "var(--radius-md)", marginBottom: 12, fontSize: 14 }}>{error}</div>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-outline" onClick={() => setStep("cart")} disabled={loading}>← Back</button>
                <button className="btn btn-primary btn-full btn-lg" onClick={placeOrder} disabled={loading}>
                  {loading ? <><span className="spinner" />Placing Order...</> : "Place Order 🎉"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

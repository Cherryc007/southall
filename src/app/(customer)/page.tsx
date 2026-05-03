"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useCart } from "@/lib/CartContext";
import CartDrawer from "@/components/customer/CartDrawer";

// Portion Dialog Component
function PortionDialog({ item, discountPercent, onClose, onAdd }: { item: MenuItem; discountPercent: number; onClose: () => void; onAdd: (portionName: string, price: number) => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div className="slide-up" style={{ background: "var(--bg-primary)", width: "100%", maxWidth: 600, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 800 }}>{item.name}</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Select Portion</p>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ fontSize: 24, padding: 0, width: 32, height: 32 }}>✕</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {item.portions.map(p => {
            const currentPrice = p.price;
            const discountedPrice = currentPrice * (1 - discountPercent / 100);
            return (
              <div key={p.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, border: "1px solid var(--border-color)", borderRadius: 12, background: "var(--bg-secondary)" }}>
                <span style={{ fontWeight: 600, fontSize: 16 }}>{p.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  {discountPercent > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "var(--brand-gold)" }}>{fmt(discountedPrice)}</span>
                      <span style={{ fontSize: 12, textDecoration: "line-through", color: "var(--text-muted)", marginTop: -4 }}>{fmt(currentPrice)}</span>
                    </div>
                  ) : (
                    <span style={{ fontWeight: 700, fontSize: 16 }}>{fmt(currentPrice)}</span>
                  )}
                  <button className="btn btn-primary btn-sm" onClick={() => onAdd(p.name, discountedPrice)}>Add</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface Category { _id: string; name: string; slug: string; icon: string; }
interface MenuItem { _id: string; name: string; description: string; price: number; portions: { name: string; price: number }[]; gst: number; category: string; image: string; tags: string[]; available: boolean; isSpecial: boolean; }
interface DiscountConfig { active: boolean; percent: number; }
interface Discounts { global: DiscountConfig; chamber: DiscountConfig; }

function fmt(n: number) { return `₹${n.toFixed(2)}`; }

function MenuCard({ item, discountPercent, onSelectPortion }: { item: MenuItem; discountPercent: number; onSelectPortion: (item: MenuItem) => void }) {
  const { items, updateQty, add, remove } = useCart();

  const currentPrice = item.price;
  const discountedPrice = currentPrice * (1 - discountPercent / 100);
  const isDiscounted = discountPercent > 0;
  const hasPortions = item.portions && item.portions.length > 0;
  
  const cartItemId = `${item._id}-base`;
  const cartItem = items.find(i => i.cartItemId === cartItemId);
  const qty = cartItem?.quantity ?? 0;

  if (!item.available) return null;

  const handleAdd = () => {
    if (hasPortions) {
      onSelectPortion(item);
    } else {
      add({ menuItemId: item._id, name: item.name, portionName: undefined, price: discountedPrice, image: item.image });
    }
  };

  return (
    <div className="menu-item-card fade-in">
      {item.isSpecial && (
        <div style={{ position: "absolute", top: 10, left: 10, zIndex: 2 }}>
          <span className="badge badge-gold">⭐ Special</span>
        </div>
      )}
      {item.image ? (
        <Image src={item.image} alt={item.name} width={400} height={300} className="menu-item-img" style={{ objectFit: "cover" }} />
      ) : (
        <div className="menu-item-img-placeholder">
          {item.category === "beverages" ? "🥤" : item.category === "starters" ? "🥗" : item.category === "wraps" ? "🌯" : item.category === "mains" ? "🍛" : item.category === "combos" ? "🎁" : "🍽️"}
        </div>
      )}
      <div className="menu-item-body">
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
          {item.tags.map(t => (
            <span key={t} className={`badge ${t === "Best Seller" ? "badge-orange" : t === "Vegetarian" ? "badge-green" : "badge-blue"}`}>{t}</span>
          ))}
        </div>
        <div className="menu-item-name">{item.name}</div>
        <div className="menu-item-desc">{item.description}</div>
        <div className="menu-item-footer" style={{ marginTop: 'auto' }}>
          <div className="menu-item-price">
            {hasPortions ? (
              <span style={{ color: "var(--brand-dark)", fontWeight: 700 }}>{item.portions.map(p => fmt(p.price)).join(" / ")}</span>
            ) : isDiscounted ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: "var(--brand-gold)" }}>{fmt(discountedPrice)}</span>
                <span style={{ fontSize: 12, textDecoration: "line-through", color: "var(--text-muted)", marginTop: -4 }}>{fmt(currentPrice)}</span>
              </div>
            ) : (
              fmt(currentPrice)
            )}
          </div>
          {qty === 0 || hasPortions ? (
            <button className="btn btn-primary btn-sm" onClick={handleAdd}>
              {hasPortions ? "Options" : "Add"}
            </button>
          ) : (
            <div className="qty-control">
              <button className="qty-btn" onClick={() => updateQty(cartItemId, qty - 1)}>−</button>
              <span className="qty-count">{qty}</span>
              <button className="qty-btn" onClick={() => updateQty(cartItemId, qty + 1)}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MenuPage() {
  const { add, items, count, total } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [discounts, setDiscounts] = useState<Discounts | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedPortionItem, setSelectedPortionItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<{ restaurantName: string; bannerMessage: string; restaurantPhone: string }>({ restaurantName: "Southall Kitchen", bannerMessage: "Fresh food, fast service", restaurantPhone: "" });
  const catBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then(r => r.json()),
      fetch("/api/menu?available=true").then(r => r.json()),
      fetch("/api/discount").then(r => r.json()),
      fetch("/api/settings").then(r => r.json()),
    ]).then(([cats, menu, disc, sett]) => {
      const catList: Category[] = cats.data || [];
      setCategories(catList);
      setMenuItems(menu.data || []);
      setDiscounts(disc.data);
      if (sett.data) setSettings(sett.data);
      if (catList.length) setActiveCategory(catList[0].slug);
    }).finally(() => setLoading(false));
  }, []);

  const specials = menuItems.filter(i => i.isSpecial);
  const filtered = activeCategory === "specials"
    ? specials
    : menuItems.filter(i => i.category === activeCategory);

  const discountedTotal = discounts?.global.active ? total * (1 - discounts.global.percent / 100) : total;
  const savings = total - discountedTotal;

  function scrollCatIntoView(slug: string) {
    setActiveCategory(slug);
    const el = catBarRef.current?.querySelector(`[data-slug="${slug}"]`) as HTMLElement;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, background: "var(--bg-primary)" }}>
      <div style={{ fontSize: 48 }}>🍽️</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: "var(--brand-dark)" }}>Southall Kitchen</div>
      <div className="spinner spinner-dark" style={{ width: 32, height: 32 }} />
    </div>
  );

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", paddingBottom: 120 }}>
      {/* Header */}
      <header style={{ background: "var(--brand-dark)", padding: "20px 16px 0" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--brand-gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🍽️</div>
            <div>
              <h1 style={{ color: "white", fontSize: 22, fontWeight: 800, lineHeight: 1.2 }}>{settings.restaurantName}</h1>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{settings.bannerMessage}</p>
            </div>
          </div>
          {discounts?.global.active && (
            <div style={{ background: "rgba(212,160,23,0.2)", border: "1px solid rgba(212,160,23,0.4)", borderRadius: "var(--radius-md)", padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>🎉</span>
              <span style={{ color: "var(--brand-gold-light)", fontSize: 14, fontWeight: 600 }}>{discounts.global.percent}% discount is active on all items today!</span>
            </div>
          )}
          {/* Category Bar */}
          <div ref={catBarRef} style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 16, scrollbarWidth: "none" }}>
            {categories.map(cat => (
              <button key={cat.slug} data-slug={cat.slug}
                onClick={() => scrollCatIntoView(cat.slug)}
                style={{
                  flexShrink: 0, padding: "8px 16px", borderRadius: "var(--radius-full)",
                  background: activeCategory === cat.slug ? "var(--brand-gold)" : "rgba(255,255,255,0.12)",
                  color: activeCategory === cat.slug ? "var(--brand-dark)" : "rgba(255,255,255,0.8)",
                  fontWeight: 600, fontSize: 13, transition: "all 0.2s", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                <span>{cat.icon}</span>{cat.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Menu Grid */}
      <main style={{ maxWidth: 600, margin: "0 auto", padding: "20px 16px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
            <p style={{ fontSize: 16 }}>No items in this category</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {filtered.map(item => (
              <MenuCard key={item._id} item={item} discountPercent={discounts?.global.active ? discounts.global.percent : 0} onSelectPortion={setSelectedPortionItem} />
            ))}
          </div>
        )}
      </main>

      {/* Floating Cart */}
      {count > 0 && (
        <div className="floating-cart">
          <button className="btn btn-primary btn-lg" onClick={() => setCartOpen(true)}
            style={{ boxShadow: "0 8px 24px rgba(212,160,23,0.5)", minWidth: 280, position: "relative" }}>
            <span style={{ background: "var(--brand-dark)", color: "var(--brand-gold)", borderRadius: "50%", width: 24, height: 24, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>{count}</span>
            View Cart
            <span style={{ marginLeft: "auto" }}>
              {discounts?.global.active ? (
                <span>
                  <span style={{ textDecoration: "line-through", opacity: 0.6, fontSize: 13 }}>{fmt(total)}</span>{" "}
                  {fmt(discountedTotal)}
                </span>
              ) : fmt(total)}
            </span>
          </button>
        </div>
      )}

      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} discounts={discounts} />}

      {selectedPortionItem && (
        <PortionDialog 
          item={selectedPortionItem} 
          discountPercent={discounts?.global.active ? discounts.global.percent : 0}
          onClose={() => setSelectedPortionItem(null)}
          onAdd={(portionName, price) => {
            add({ menuItemId: selectedPortionItem._id, name: selectedPortionItem.name, portionName, price, image: selectedPortionItem.image });
            setSelectedPortionItem(null);
          }}
        />
      )}
    </div>
  );
}

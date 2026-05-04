"use client";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/lib/CartContext";
import CartDrawer from "@/components/customer/CartDrawer";

interface Category { _id: string; name: string; slug: string; icon: string; }
interface MenuItem { _id: string; name: string; description: string; price: number; portions: { name: string; price: number }[]; gst: number; category: string; image: string; tags: string[]; available: boolean; isSpecial: boolean; }
interface DiscountConfig { active: boolean; percent: number; }
interface Discounts { global: DiscountConfig; chamber: DiscountConfig; }

function fmt(n: number) { return `₹${n.toFixed(2)}`; }

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
                  <button className="btn btn-primary btn-sm" onClick={() => onAdd(p.name, p.price)}>Add</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}



function MenuCard({ item, discountPercent, onSelectPortion, orderMode }: { item: MenuItem; discountPercent: number; onSelectPortion: (item: MenuItem) => void, orderMode: boolean }) {
  const { items, updateQty, add } = useCart();

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
      add({ menuItemId: item._id, name: item.name, portionName: undefined, price: currentPrice, image: item.image });
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
        <img src={item.image} alt={item.name} className="menu-item-img" loading="lazy" />
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
        <div className="menu-item-footer">
          <div className="menu-item-price">
            {hasPortions ? (
              <span style={{ color: "var(--brand-dark)", fontWeight: 700, fontSize: 13 }}>Starts ₹{Math.min(...item.portions.map(p => p.price))}</span>
            ) : isDiscounted ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: "var(--brand-gold)" }}>{fmt(discountedPrice)}</span>
                <span style={{ fontSize: 11, textDecoration: "line-through", color: "var(--text-muted)", marginTop: -4 }}>{fmt(currentPrice)}</span>
              </div>
            ) : (
              fmt(currentPrice)
            )}
          </div>
          {orderMode && (
            qty === 0 || hasPortions ? (
              <button className="btn btn-primary btn-sm" onClick={handleAdd} style={{ padding: "6px 12px", minWidth: 60 }}>
                {hasPortions ? "Options" : "Add"}
              </button>
            ) : (
              <div className="qty-control">
                <button className="qty-btn" onClick={() => updateQty(cartItemId, qty - 1)}>−</button>
                <span className="qty-count">{qty}</span>
                <button className="qty-btn" onClick={() => updateQty(cartItemId, qty + 1)}>+</button>
              </div>
            )
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
  const [orderMode, setOrderMode] = useState(false);
  const [discounts, setDiscounts] = useState<Discounts | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedPortionItem, setSelectedPortionItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<{ restaurantName: string; bannerMessage: string; restaurantPhone: string }>({ restaurantName: "Southall Kitchens", bannerMessage: "Treat the Buds", restaurantPhone: "" });
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

  // Scroll Spy logic
  useEffect(() => {
    const handleScroll = () => {
      if (categories.length === 0 || loading) return;

      const categoryElements = categories.map(cat => ({
        slug: cat.slug,
        el: document.getElementById(`cat-${cat.slug}`)
      })).filter(item => item.el !== null);

      const scrollPosition = window.scrollY + 150; // Offset for sticky header

      let currentActive = categories[0]?.slug;
      for (const item of categoryElements) {
        if (item.el!.offsetTop <= scrollPosition) {
          currentActive = item.slug;
        } else {
          break;
        }
      }

      if (currentActive && currentActive !== activeCategory) {
        setActiveCategory(currentActive);
        
        // Auto-scroll the category bar to keep active item in view
        const activeBtn = catBarRef.current?.querySelector(`[data-slug="${currentActive}"]`) as HTMLElement;
        if (activeBtn && catBarRef.current) {
          const container = catBarRef.current;
          const left = activeBtn.offsetLeft - (container.offsetWidth / 2) + (activeBtn.offsetWidth / 2);
          container.scrollTo({ left, behavior: "smooth" });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories, activeCategory, loading]);

  const discountedTotal = discounts?.global.active ? total * (1 - discounts.global.percent / 100) : total;

  function scrollToCategory(slug: string) {
    setActiveCategory(slug);
    const el = document.getElementById(`cat-${slug}`);
    if (el) {
      const offset = 130; // Account for sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, background: "var(--bg-primary)" }}>
      <img src="/logo.jpeg" alt="Logo" style={{ width: 120, height: 120, objectFit: "contain" }} className="fade-in" />
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: "var(--brand-dark)" }}>Southall Kitchens</div>
        <div style={{ fontSize: 14, color: "var(--brand-gold)", fontWeight: 600 }}>Treat the Buds</div>
      </div>
      <div className="spinner spinner-dark" style={{ width: 28, height: 28, marginTop: 10 }} />
    </div>
  );

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", paddingBottom: 140 }}>
      {/* Sticky Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "var(--brand-dark)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <header style={{ padding: "16px 16px 8px" }}>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
              <img src="/logo.jpeg" alt="Logo" style={{ width: 44, height: 44, objectFit: "contain", background: "white", borderRadius: "50%", padding: 2 }} />
              <div>
                <h1 style={{ color: "white", fontSize: 18, fontWeight: 800, lineHeight: 1.2 }}>{settings.restaurantName}</h1>
                <p style={{ color: "var(--brand-gold)", fontSize: 12, fontWeight: 600 }}>{settings.bannerMessage}</p>
              </div>
            </div>
            {/* Category Bar */}
            <div ref={catBarRef} style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
              {categories.map(cat => (
                <button key={cat.slug}
                  data-slug={cat.slug}
                  onClick={() => scrollToCategory(cat.slug)}
                  style={{
                    flexShrink: 0, padding: "6px 14px", borderRadius: "var(--radius-full)",
                    background: activeCategory === cat.slug ? "var(--brand-gold)" : "rgba(255,255,255,0.12)",
                    color: activeCategory === cat.slug ? "var(--brand-dark)" : "rgba(255,255,255,0.8)",
                    fontWeight: 600, fontSize: 12, transition: "all 0.2s", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 4,
                  }}>
                  <span>{cat.icon}</span>{cat.name}
                </button>
              ))}
            </div>
          </div>
        </header>
      </div>

      {/* Main Menu List */}
      <main style={{ maxWidth: 600, margin: "0 auto", padding: "16px" }}>
        {discounts?.global.active && (
          <div style={{ background: "rgba(212,160,23,0.1)", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "var(--radius-md)", padding: "10px 14px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>🎉</span>
            <span style={{ color: "var(--brand-gold)", fontSize: 13, fontWeight: 600 }}>{discounts.global.percent}% discount active today!</span>
          </div>
        )}

        {categories.map(cat => {
          const catItems = menuItems.filter(i => i.category === cat.slug || (cat.slug === "specials" && i.isSpecial));
          if (catItems.length === 0) return null;

          return (
            <div key={cat.slug} id={`cat-${cat.slug}`} style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 24 }}>{cat.icon}</span>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--brand-dark)" }}>{cat.name}</h2>
                <div style={{ flex: 1, height: 1, background: "var(--border-light)", marginLeft: 8 }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {catItems.map(item => (
                  <MenuCard
                    key={item._id}
                    item={item}
                    orderMode={orderMode}
                    discountPercent={discounts?.global.active ? discounts.global.percent : 0}
                    onSelectPortion={setSelectedPortionItem}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </main>

      {/* Persistent Order Mode Toggle */}
      {!orderMode ? (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 60, width: "100%", maxWidth: 400, padding: "0 20px" }}>
          <button className="btn btn-primary btn-lg btn-full" onClick={() => setOrderMode(true)}
            style={{
              boxShadow: "0 12px 32px rgba(212,160,23,0.5)",
              fontSize: 16,
              fontWeight: 800,
              height: 60,
              borderRadius: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10
            }}>
            📍 Nearby? Order Now!
          </button>
        </div>
      ) : (
        /* Floating Cart when in Order Mode */
        count > 0 && (
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
        )
      )}

      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} discounts={discounts} />}

      {selectedPortionItem && (
        <PortionDialog
          item={selectedPortionItem}
          discountPercent={discounts?.global.active ? discounts.global.percent : 0}
          onClose={() => setSelectedPortionItem(null)}
          onAdd={(portionName, originalPrice) => {
            // Re-fetch original price from item.portions to be safe, or just use passed original price
            const portion = selectedPortionItem.portions.find(p => p.name === portionName);
            if (portion) {
              add({ menuItemId: selectedPortionItem._id, name: selectedPortionItem.name, portionName, price: portion.price, image: selectedPortionItem.image });
            }
            setSelectedPortionItem(null);
          }}
        />
      )}
    </div>
  );
}


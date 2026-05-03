"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

export interface CartItem {
  cartItemId: string;
  menuItemId: string;
  name: string;
  portionName?: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity" | "cartItemId">) => void;
  remove: (cartItemId: string) => void;
  updateQty: (cartItemId: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = useCallback((item: Omit<CartItem, "quantity" | "cartItemId">) => {
    setItems(prev => {
      const cartItemId = `${item.menuItemId}-${item.portionName || 'base'}`;
      const existing = prev.find(i => i.cartItemId === cartItemId);
      if (existing) return prev.map(i => i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, cartItemId, quantity: 1 }];
    });
  }, []);

  const remove = useCallback((cartItemId: string) => {
    setItems(prev => prev.filter(i => i.cartItemId !== cartItemId));
  }, []);

  const updateQty = useCallback((cartItemId: string, qty: number) => {
    if (qty <= 0) { remove(cartItemId); return; }
    setItems(prev => prev.map(i => i.cartItemId === cartItemId ? { ...i, quantity: qty } : i));
  }, [remove]);

  const clear = useCallback(() => setItems([]), []);

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, updateQty, clear, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}

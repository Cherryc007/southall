"use client";
import { CartProvider } from "@/lib/CartContext";
import CustomerFooter from "@/components/customer/CustomerFooter";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <div style={{ flex: 1 }}>{children}</div>
        <CustomerFooter />
      </div>
    </CartProvider>
  );
}

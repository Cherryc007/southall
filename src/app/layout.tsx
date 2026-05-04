import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Southall Kitchens — Treat the Buds",
  description: "Order fresh, authentic Indian food from Southall Kitchens. Browse our menu and place your order instantly.",
  keywords: "Southall Kitchens, Indian food, restaurant ordering, wraps, curry",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Southall Kitchen — Fresh Food, Fast Service",
  description: "Order fresh, authentic Indian food from Southall Kitchen. Browse our menu and place your order instantly.",
  keywords: "Southall Kitchen, Indian food, restaurant ordering, wraps, curry",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

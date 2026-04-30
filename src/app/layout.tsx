import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import GrainOverlay from "@/components/GrainOverlay";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ROBBIE CAN'T BEAT ME",
  description: "Limited drop. Own the proof.",
  openGraph: {
    title: "ROBBIE CAN'T BEAT ME",
    description: "Limited drop. Own the proof.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-black text-white antialiased">
        <CartProvider>
          <GrainOverlay />
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

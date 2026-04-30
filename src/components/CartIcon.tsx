"use client";

import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

export default function CartIcon() {
  const { totalQuantity, setCartOpen } = useCart();

  return (
    <button
      onClick={() => setCartOpen(true)}
      className="relative p-2 text-white hover:text-zinc-300 transition-colors"
      aria-label="Open cart"
    >
      <ShoppingBag className="w-6 h-6" />
      <AnimatePresence>
        {totalQuantity > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 bg-white text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
          >
            {totalQuantity > 9 ? "9+" : totalQuantity}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

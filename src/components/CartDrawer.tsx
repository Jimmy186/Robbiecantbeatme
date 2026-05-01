"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/shopify";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateLine, removeLine, checkout, loading } = useCart();

  const lines = cart?.lines.edges.map((e) => e.node) ?? [];
  const total = cart?.estimatedCost.totalAmount;

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-zinc-950 border-l border-white/10 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-white" />
                <h2 className="text-white font-bold text-lg tracking-wide">YOUR CART</h2>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lines */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {lines.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-4">
                  <ShoppingBag className="w-12 h-12 opacity-30" />
                  <p className="text-sm">Your cart is empty.</p>
                </div>
              ) : (
                lines.map((line) => (
                  <motion.div
                    key={line.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex gap-4 bg-white/5 rounded-xl p-3"
                  >
                    {line.merchandise.product.featuredImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={line.merchandise.product.featuredImage.url}
                        alt={line.merchandise.product.featuredImage.altText ?? line.merchandise.product.title}
                        className="w-16 h-16 object-cover rounded-lg bg-zinc-800"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">
                        {line.merchandise.product.title}
                      </p>
                      <p className="text-zinc-400 text-xs mt-0.5">{line.merchandise.title}</p>
                      <p className="text-white text-sm font-bold mt-1">
                        {formatPrice(line.merchandise.price.amount, line.merchandise.price.currencyCode)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeLine(line.id)}
                        className="text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2 bg-white/10 rounded-lg px-2 py-1">
                        <button
                          onClick={() => updateLine(line.id, Math.max(0, line.quantity - 1))}
                          className="text-zinc-400 hover:text-white transition-colors"
                          disabled={loading}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-white text-sm w-4 text-center">{line.quantity}</span>
                        <button
                          onClick={() => updateLine(line.id, line.quantity + 1)}
                          className="text-zinc-400 hover:text-white transition-colors"
                          disabled={loading}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {lines.length > 0 && (
              <div className="p-6 border-t border-white/10 space-y-4">
                <div className="flex justify-between text-white">
                  <span className="text-zinc-400">Estimated Total</span>
                  <span className="font-bold text-lg">
                    {total ? formatPrice(total.amount, total.currencyCode) : "—"}
                  </span>
                </div>
                <button
                  onClick={checkout}
                  disabled={loading}
                  className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 transition-colors text-sm tracking-widest uppercase disabled:opacity-50"
                >
                  Checkout
                </button>
                <p className="text-zinc-500 text-xs text-center">
                  Secure checkout via Shopify
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

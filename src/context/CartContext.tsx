"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  ShopifyCart,
  createCart,
  addToCart as shopifyAddToCart,
  updateCartLine as shopifyUpdateCartLine,
  removeFromCart as shopifyRemoveFromCart,
  getCart,
} from "@/lib/shopify";

interface CartContextValue {
  cart: ShopifyCart | null;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  updateLine: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
  checkout: () => void;
  totalQuantity: number;
  loading: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_ID_KEY = "shopify_cart_id";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const initCart = useCallback(async () => {
    const storedId = localStorage.getItem(CART_ID_KEY);
    if (storedId) {
      const existing = await getCart(storedId);
      if (existing) {
        setCart(existing);
        return;
      }
    }
    const newCart = await createCart();
    localStorage.setItem(CART_ID_KEY, newCart.id);
    setCart(newCart);
  }, []);

  useEffect(() => {
    initCart();
  }, [initCart]);

  const addToCart = async (variantId: string, quantity = 1) => {
    setLoading(true);
    try {
      let cartId = cart?.id;
      if (!cartId) {
        const newCart = await createCart();
        localStorage.setItem(CART_ID_KEY, newCart.id);
        cartId = newCart.id;
      }
      const updated = await shopifyAddToCart(cartId, variantId, quantity);
      setCart(updated);
      setCartOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const updateLine = async (lineId: string, quantity: number) => {
    if (!cart) return;
    setLoading(true);
    try {
      const updated = await shopifyUpdateCartLine(cart.id, lineId, quantity);
      setCart(updated);
    } finally {
      setLoading(false);
    }
  };

  const removeLine = async (lineId: string) => {
    if (!cart) return;
    setLoading(true);
    try {
      const updated = await shopifyRemoveFromCart(cart.id, [lineId]);
      setCart(updated);
    } finally {
      setLoading(false);
    }
  };

  const checkout = () => {
    if (cart?.checkoutUrl) {
      // Shopify returns checkoutUrl using the store's custom domain, which points
      // to this Next.js app — rewrite it to the myshopify.com domain so Shopify
      // handles the checkout page instead of Next.js routing it as a 404.
      const url = cart.checkoutUrl.replace(
        /^https?:\/\/(www\.)?robbiecantbeatme\.com/,
        "https://x7x1ww-y8.myshopify.com"
      );
      window.location.href = url;
    }
  };

  const totalQuantity = cart?.totalQuantity ?? 0;

  return (
    <CartContext.Provider
      value={{ cart, cartOpen, setCartOpen, addToCart, updateLine, removeLine, checkout, totalQuantity, loading }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
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
  const cartRef = useRef<ShopifyCart | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateCart = useCallback((newCart: ShopifyCart | null) => {
    cartRef.current = newCart;
    setCart(newCart);
  }, []);

  const initCart = useCallback(async () => {
    try {
      const storedId = localStorage.getItem(CART_ID_KEY);
      if (storedId) {
        const existing = await getCart(storedId);
        if (existing) {
          updateCart(existing);
          return;
        }
      }
      const newCart = await createCart();
      localStorage.setItem(CART_ID_KEY, newCart.id);
      updateCart(newCart);
    } catch {
      // Shopify not configured — cart will be created lazily on first add
    }
  }, [updateCart]);

  useEffect(() => {
    initCart();
  }, [initCart]);

  const addToCart = async (variantId: string, quantity = 1) => {
    setLoading(true);
    try {
      let cartId = cartRef.current?.id;
      if (!cartId) {
        const newCart = await createCart();
        localStorage.setItem(CART_ID_KEY, newCart.id);
        updateCart(newCart);
        cartId = newCart.id;
      }
      const updated = await shopifyAddToCart(cartId, variantId, quantity);
      updateCart(updated);
      setCartOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const updateLine = async (lineId: string, quantity: number) => {
    if (!cartRef.current) return;
    setLoading(true);
    try {
      const updated = await shopifyUpdateCartLine(cartRef.current.id, lineId, quantity);
      updateCart(updated);
    } finally {
      setLoading(false);
    }
  };

  const removeLine = async (lineId: string) => {
    if (!cartRef.current) return;
    setLoading(true);
    try {
      const updated = await shopifyRemoveFromCart(cartRef.current.id, [lineId]);
      updateCart(updated);
    } finally {
      setLoading(false);
    }
  };

  const checkout = () => {
    const checkoutUrl = cartRef.current?.checkoutUrl;
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
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

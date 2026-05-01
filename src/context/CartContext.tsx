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
  addToCart: (variantId: string, quantity?: number) => Promise<ShopifyCart>;
  updateLine: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
  checkout: (checkoutUrlOverride?: string) => void;
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
    console.log("[CART:init] stored cart id:", storedId);
    if (storedId) {
      const existing = await getCart(storedId);
      if (existing) {
        console.log("[CART:init] loaded existing cart:", existing.id, "checkoutUrl:", existing.checkoutUrl);
        setCart(existing);
        return;
      }
      console.log("[CART:init] stored cart not found, creating new one");
    }
    const newCart = await createCart();
    console.log("[CART:init] created new cart:", newCart.id, "checkoutUrl:", newCart.checkoutUrl);
    localStorage.setItem(CART_ID_KEY, newCart.id);
    setCart(newCart);
  }, []);

  useEffect(() => {
    initCart();
  }, [initCart]);

  const addToCart = async (variantId: string, quantity = 1): Promise<ShopifyCart> => {
    console.log("[CART:add] addToCart called — variantId:", variantId, "qty:", quantity);
    console.log("[CART:add] current cart id:", cart?.id ?? "none");
    setLoading(true);
    try {
      let cartId = cart?.id;
      if (!cartId) {
        console.log("[CART:add] no cart yet, creating one...");
        const newCart = await createCart();
        localStorage.setItem(CART_ID_KEY, newCart.id);
        cartId = newCart.id;
        console.log("[CART:add] new cart created:", newCart.id, "checkoutUrl:", newCart.checkoutUrl);
      }
      const updated = await shopifyAddToCart(cartId, variantId, quantity);
      console.log("[CART:add] cart updated. checkoutUrl:", updated.checkoutUrl, "totalQty:", updated.totalQuantity);
      setCart(updated);
      setCartOpen(true);
      return updated;
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

  const checkout = (checkoutUrlOverride?: string) => {
    console.log("[CHECKOUT] checkout() called");
    console.log("[CHECKOUT] cart state at call time:", cart ? { id: cart.id, checkoutUrl: cart.checkoutUrl, totalQty: cart.totalQuantity } : null);
    console.log("[CHECKOUT] checkoutUrlOverride:", checkoutUrlOverride ?? "(none)");

    const rawUrl = checkoutUrlOverride ?? cart?.checkoutUrl;

    if (!rawUrl) {
      console.error("[CHECKOUT] FAILED — no checkoutUrl available. cart:", cart, "override:", checkoutUrlOverride);
      return;
    }

    console.log("[CHECKOUT] raw URL from Shopify:", rawUrl);

    // Rewrite any custom-domain variants back to the myshopify host so we
    // skip the Vercel → robbiecantbeatme.com DNS hop entirely.
    const url = rawUrl
      .replace(/https?:\/\/(www\.)?robbiecantbeatme\.com/g, "https://x7x1ww-y8.myshopify.com");

    console.log("[CHECKOUT] final redirect URL:", url);
    console.log("[CHECKOUT] navigating now...");
    window.location.href = url;
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

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CartIcon from "@/components/CartIcon";
import { ShopifyProduct, formatPrice } from "@/lib/shopify";
import { useCart } from "@/context/CartContext";
import { SOLD_OUT } from "@/lib/config";

interface Props {
  products: ShopifyProduct[];
}

// Placeholder for when Shopify isn't connected yet
const PLACEHOLDER_PRODUCT = {
  id: "placeholder",
  handle: "robbie-cant-beat-me-tee",
  title: "ROBBIE CAN'T BEAT ME — Tee",
  description: "The shirt that says everything.",
  priceRange: { minVariantPrice: { amount: "60.00", currencyCode: "USD" } },
  featuredImage: null,
  variants: { edges: [] },
};

export default function ShopClient({ products }: Props) {
  const router = useRouter();
  const { addToCart, loading } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const product = products[0] ?? PLACEHOLDER_PRODUCT;
  const isPlaceholder = product.id === "placeholder";

  const variants = (product as ShopifyProduct).variants?.edges.map((e) => e.node) ?? [];
  const sizes = variants.map((v) => v.title);
  const selectedVariant = variants.find((v) => v.title === selectedSize);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addToCart(selectedVariant.id);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const price = isPlaceholder
    ? "$35.00"
    : formatPrice(
        (product as ShopifyProduct).priceRange.minVariantPrice.amount,
        (product as ShopifyProduct).priceRange.minVariantPrice.currencyCode
      );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-md border-b border-white/[0.06]">
        <Link href="/" className="text-zinc-400 hover:text-white transition-colors text-sm tracking-widest uppercase">
          ← Back
        </Link>
        <span className="text-white font-black text-sm tracking-[0.3em] uppercase">
          RCBM
        </span>
        <CartIcon />
      </nav>

      {/* Hero */}
      <div className="pt-24 pb-16 px-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-white/10 border border-white/20 text-white text-xs tracking-[0.3em] uppercase px-4 py-1.5 rounded-full mb-6">
            Limited Drop
          </span>
          <h1 className="font-black text-4xl sm:text-6xl tracking-tight leading-none">
            THE DROP
          </h1>
          <p className="text-zinc-500 mt-3 text-sm tracking-widest">One product. No questions.</p>
        </motion.div>

        {/* Product Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full max-w-sm"
        >
          <div className="relative group bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl hover:border-white/25 transition-all duration-500">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

            {/* Product image */}
            <Link href={`/product/${product.handle}`} className="block aspect-square bg-zinc-900 relative overflow-hidden cursor-pointer">
              {(product as ShopifyProduct).featuredImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={(product as ShopifyProduct).featuredImage!.url}
                  alt={(product as ShopifyProduct).featuredImage!.altText ?? product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700">
                  <div className="w-32 h-32 border-2 border-zinc-700 rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl font-black">RC</span>
                  </div>
                  <p className="text-xs tracking-widest uppercase text-zinc-600">Shirt mockup</p>
                </div>
              )}

              {/* Limited badge */}
              <div className="absolute top-3 left-3 bg-black/80 border border-white/20 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full tracking-wider">
                Limited
              </div>
            </Link>

            {/* Card body */}
            <div className="p-5 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-bold text-white text-sm leading-tight">{product.title}</h2>
                  <p className="text-zinc-500 text-xs mt-1">Premium heavyweight tee</p>
                </div>
                <span className="text-white font-black text-xl">{price}</span>
              </div>

              {/* Size selector */}
              {SOLD_OUT ? (
                <div className="space-y-2">
                  <p className="text-zinc-500 text-xs tracking-widest uppercase">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {["S", "M", "L", "XL"].map((size) => (
                      <div key={size} className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-white/10 text-zinc-600 line-through cursor-not-allowed">
                        {size}
                      </div>
                    ))}
                  </div>
                </div>
              ) : sizes.length > 0 && (
                <div className="space-y-2">
                  <p className="text-zinc-500 text-xs tracking-widest uppercase">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 ${
                          selectedSize === size
                            ? "bg-white text-black border-white"
                            : "bg-transparent text-zinc-400 border-white/20 hover:border-white/50 hover:text-white"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {!selectedSize && (
                    <p className="text-zinc-600 text-xs">Select a size to add to cart</p>
                  )}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-2">
                {SOLD_OUT ? (
                  <div className="flex-1 py-3 text-sm font-black tracking-widest uppercase rounded-xl bg-white/5 border border-white/10 text-zinc-500 text-center cursor-not-allowed">
                    SOLD OUT
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={loading || (!selectedVariant && !isPlaceholder) || addedFeedback}
                    className={`flex-1 py-3 text-sm font-bold tracking-widest uppercase rounded-xl transition-all duration-300 ${
                      addedFeedback
                        ? "bg-green-500 text-white"
                        : selectedVariant || isPlaceholder
                        ? "bg-white text-black hover:bg-zinc-200"
                        : "bg-white/10 text-zinc-500 cursor-not-allowed"
                    }`}
                  >
                    {addedFeedback ? "Added ✓" : loading ? "Adding…" : "Add to Cart"}
                  </button>
                )}
                <Link
                  href={`/product/${product.handle}`}
                  className="px-4 py-3 text-sm font-bold tracking-wider border border-white/20 rounded-xl text-white hover:border-white/50 transition-all duration-200 whitespace-nowrap"
                >
                  Details
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* More products if they exist */}
        {products.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-4xl mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {products.slice(1).map((p) => (
              <div
                key={p.id}
                onClick={() => router.push(`/product/${p.handle}`)}
                className="bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-white/25 transition-all duration-300 group"
              >
                <div className="aspect-square bg-zinc-900">
                  {p.featuredImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.featuredImage.url}
                      alt={p.featuredImage.altText ?? p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-white text-sm font-bold">{p.title}</h3>
                  <p className="text-zinc-400 text-sm font-bold mt-1">
                    {formatPrice(p.priceRange.minVariantPrice.amount, p.priceRange.minVariantPrice.currencyCode)}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

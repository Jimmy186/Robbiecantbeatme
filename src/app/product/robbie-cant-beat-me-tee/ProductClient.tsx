"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Minus, Plus, Star } from "lucide-react";
import { ShopifyProduct, ShopifyProductVariant, formatPrice } from "@/lib/shopify";
import { useCart } from "@/context/CartContext";
import CartIcon from "@/components/CartIcon";

interface Props {
  product: ShopifyProduct | null;
}

const JOKE_REVIEWS = [
  {
    author: "BirdieMachine_88",
    rating: 5,
    text: "Wore this on the first tee. Robbie took one look at it and three-putted every hole. Shirt works as advertised.",
    date: "March 2025",
    label: "Fan Review",
  },
  {
    author: "FairwayPhilosopher",
    rating: 5,
    text: "I had a 22 handicap before this shirt. Now I'm a 21. Coincidence? Robbie doesn't think so.",
    date: "February 2025",
    label: "Fan Review",
  },
  {
    author: "Back9Believer",
    rating: 5,
    text: "Robbie saw me warming up on the range wearing this and suddenly remembered he had 'other plans.' Classic.",
    date: "April 2025",
    label: "Fan Review",
  },
  {
    author: "BunkerBetter_OG",
    rating: 5,
    text: "Hit my first eagle wearing this shirt. My caddy said it was skill. My caddy is wrong — it's the shirt.",
    date: "January 2025",
    label: "Fan Review",
  },
];

const PLACEHOLDER = {
  id: "placeholder",
  handle: "robbie-cant-beat-me-tee",
  title: "ROBBIE CAN'T BEAT ME — Tee",
  description:
    "Premium heavyweight cotton tee. 100% ringspun cotton. Pre-shrunk. The only shirt that doubles as a warning.",
  descriptionHtml: "",
  featuredImage: null,
  images: { edges: [] },
  priceRange: { minVariantPrice: { amount: "60.00", currencyCode: "USD" } },
  variants: { edges: [] },
};

export default function ProductClient({ product }: Props) {
  const resolvedProduct = product ?? (PLACEHOLDER as unknown as ShopifyProduct);
  const isPlaceholder = !product;

  const variants: ShopifyProductVariant[] =
    resolvedProduct.variants?.edges.map((e) => e.node) ?? [];
  const sizes = variants.map((v) => v.title);
  const images = resolvedProduct.images?.edges.map((e) => e.node) ?? [];

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const { addToCart, checkout, loading, cart } = useCart();

  const selectedVariant = variants.find((v) => v.title === selectedSize);

  const price = isPlaceholder
    ? "$35.00"
    : formatPrice(
        resolvedProduct.priceRange.minVariantPrice.amount,
        resolvedProduct.priceRange.minVariantPrice.currencyCode
      );

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addToCart(selectedVariant.id, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const handleCheckout = async () => {
    if (!selectedVariant) return;
    await addToCart(selectedVariant.id, quantity);
    checkout();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-md border-b border-white/[0.06]">
        <Link
          href="/shop"
          className="text-zinc-400 hover:text-white transition-colors text-sm tracking-widest uppercase"
        >
          ← Shop
        </Link>
        <span className="text-white font-black text-sm tracking-[0.3em] uppercase">RCBM</span>
        <CartIcon />
      </nav>

      <div className="pt-24 pb-24 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-4"
          >
            {/* Main image */}
            <div className="aspect-square bg-zinc-950 rounded-2xl border border-white/10 overflow-hidden relative">
              {images[activeImage] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={images[activeImage].url}
                  alt={images[activeImage].altText ?? resolvedProduct.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700">
                  <div className="w-48 h-48 border-2 border-zinc-700 rounded-full flex items-center justify-center mb-4">
                    <span className="text-6xl font-black tracking-tight">RC</span>
                  </div>
                  <p className="text-xs tracking-[0.4em] uppercase text-zinc-600 mt-4">
                    Shirt Mockup
                  </p>
                </div>
              )}
              <div className="absolute top-4 left-4 bg-black/80 border border-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full tracking-wider">
                Limited Drop
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border transition-all ${
                      activeImage === i ? "border-white" : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.altText ?? ""} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-8"
          >
            <div className="space-y-3">
              <span className="text-zinc-500 text-xs tracking-[0.4em] uppercase">
                Robbie Can&apos;t Beat Me™
              </span>
              <h1 className="text-white font-black text-3xl sm:text-4xl leading-tight">
                {resolvedProduct.title}
              </h1>
              <p className="text-white font-black text-3xl">{price}</p>
              <p className="text-zinc-400 text-sm leading-relaxed">{resolvedProduct.description}</p>
            </div>

            {/* Size selector */}
            {sizes.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-white text-sm font-semibold tracking-widest uppercase">Size</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const v = variants.find((vv) => vv.title === size);
                    const available = v?.availableForSale ?? true;
                    return (
                      <button
                        key={size}
                        onClick={() => available && setSelectedSize(size)}
                        disabled={!available}
                        className={`relative px-5 py-2.5 text-sm font-semibold rounded-xl border transition-all duration-200 ${
                          selectedSize === size
                            ? "bg-white text-black border-white"
                            : available
                            ? "bg-transparent text-zinc-300 border-white/20 hover:border-white/60 hover:text-white"
                            : "bg-transparent text-zinc-700 border-white/10 cursor-not-allowed line-through"
                        }`}
                      >
                        {size}
                        {!available && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-full h-px bg-zinc-700 rotate-12 block" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {!selectedSize && (
                  <p className="text-zinc-600 text-xs">Please select a size</p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <p className="text-white text-sm font-semibold tracking-widest uppercase">Quantity</p>
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-white font-bold text-lg w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={loading || (!selectedVariant && !isPlaceholder) || addedFeedback}
                className={`w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300 ${
                  addedFeedback
                    ? "bg-green-500 text-white"
                    : selectedVariant || isPlaceholder
                    ? "bg-white text-black hover:bg-zinc-200"
                    : "bg-white/10 text-zinc-500 cursor-not-allowed"
                }`}
              >
                {addedFeedback ? "Added to Cart ✓" : loading ? "Adding…" : "Add to Cart"}
              </button>
              <button
                onClick={handleCheckout}
                disabled={loading || (!selectedVariant && !isPlaceholder)}
                className={`w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase border transition-all duration-300 ${
                  selectedVariant || isPlaceholder
                    ? "border-white/40 text-white hover:bg-white hover:text-black"
                    : "border-white/10 text-zinc-600 cursor-not-allowed"
                }`}
              >
                {loading ? "Processing…" : "Buy Now →"}
              </button>
            </div>

            {/* Details */}
            <div className="space-y-4 border-t border-white/10 pt-6">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-white text-sm font-semibold tracking-widest uppercase py-2">
                  Product Details
                  <span className="text-zinc-500 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <div className="text-zinc-400 text-sm space-y-2 pt-3 pb-2">
                  <p>• 100% cotton</p>
                  <p>• Pre-shrunk for a perfect fit</p>
                  <p>• Comfortable everyday wear</p>
                  <p>• Screen printed graphics — built to last</p>
                  <p>• Unisex sizing</p>
                </div>
              </details>

              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-white text-sm font-semibold tracking-widest uppercase py-2">
                  Shipping
                  <span className="text-zinc-500 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <div className="text-zinc-400 text-sm space-y-2 pt-3 pb-2">
                  <p>• Ships within 3–5 business days</p>
                  <p>• Free shipping on orders over $75</p>
                  <p>• Tracking provided via email</p>
                  <p>• Fulfilled and shipped through Shopify</p>
                </div>
              </details>

              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-white text-sm font-semibold tracking-widest uppercase py-2">
                  Returns
                  <span className="text-zinc-500 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <div className="text-zinc-400 text-sm space-y-2 pt-3 pb-2">
                  <p>• 30-day return window for unworn items</p>
                  <p>• Free exchanges on sizing issues</p>
                  <p>• Contact us and we&apos;ll make it right</p>
                </div>
              </details>
            </div>
          </motion.div>
        </div>

        {/* Reviews section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-24 max-w-4xl mx-auto"
        >
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-white font-black text-2xl sm:text-3xl">Reviews</h2>
              <p className="text-zinc-500 text-sm mt-1">From the Bunker Betters community.</p>
            </div>
            <div className="text-right hidden sm:block">
              <div className="flex items-center gap-1 justify-end">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-white text-white" />
                ))}
              </div>
              <p className="text-zinc-400 text-xs mt-1">4 joke reviews</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {JOKE_REVIEWS.map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-950 border border-white/10 rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white text-sm font-semibold">{review.author}</p>
                    <p className="text-zinc-600 text-xs">{review.date}</p>
                  </div>
                  <span className="text-xs bg-white/5 border border-white/10 text-zinc-400 px-2 py-0.5 rounded-full">
                    {review.label}
                  </span>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className={`w-3 h-3 ${
                        j < review.rating ? "fill-white text-white" : "text-zinc-700"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed">{review.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

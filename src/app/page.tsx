"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function EnterPage() {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  const handleEnter = () => {
    setLeaving(true);
    setTimeout(() => router.push("/shop"), 800);
  };

  return (
    <AnimatePresence>
      {!leaving ? (
        <motion.main
          key="enter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="flex flex-col min-h-screen bg-black overflow-hidden"
        >
          {/* Sticky header — same style as shop page */}
          <nav className="sticky top-0 z-30 flex items-center justify-center px-6 py-4 bg-black/80 backdrop-blur-md border-b border-white/[0.06]">
            <span className="text-white font-black text-sm tracking-[0.3em] uppercase">RCBM</span>
          </nav>

          {/* Image + content area */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden">

            {/* Solid black background */}
            <div className="absolute inset-0 bg-black" />

            {/* Mobile: cover */}
            <motion.div
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute inset-0 bg-center bg-no-repeat sm:hidden"
              style={{
                backgroundImage: "url('/hero-bg.png')",
                backgroundSize: "cover",
              }}
            />

            {/* Desktop: blurred color sides + contained image */}
            <div
              className="absolute inset-0 hidden sm:block"
              style={{
                backgroundImage: "url('/hero-bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center center",
                filter: "blur(40px) brightness(0.4) saturate(1.4)",
                transform: "scale(1.1)",
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute inset-0 bg-center bg-no-repeat hidden sm:block"
              style={{
                backgroundImage: "url('/hero-bg.png')",
                backgroundSize: "contain",
              }}
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent" />

            {/* Scanlines */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.025]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
              }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-12 px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
                className="space-y-2"
              >
                <p className="text-zinc-400 text-sm tracking-[0.4em] uppercase font-mono font-bold"
                  style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,1)" }}
                >
                  Limited Drop
                </p>
                <h1 className="text-white font-black tracking-tight leading-none"
                  style={{ fontSize: "clamp(2rem, 5vw, 4rem)", textShadow: "0 4px 32px rgba(0,0,0,0.9)" }}
                >
                  ROBBIE CAN&apos;T
                  <br />
                  BEAT ME
                </h1>
                <p className="text-zinc-400 text-base tracking-[0.3em] uppercase font-semibold"
                  style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,1)" }}
                >
                  Wear the truth.
                </p>
              </motion.div>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                className="w-24 h-px bg-white/20"
              />

              <motion.button
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                onClick={handleEnter}
                className="group relative px-12 py-4 border border-white/20 text-white text-sm tracking-[0.4em] uppercase font-semibold hover:border-white/60 transition-all duration-300 overflow-hidden"
              >
                <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 group-hover:text-black transition-colors duration-300">
                  Enter
                </span>
              </motion.button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="text-zinc-400 text-sm tracking-widest uppercase font-semibold"
                style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,1)" }}
              >
                One shirt. One statement.
              </motion.p>
            </div>

            {/* Corner marks */}
            {["top-6 left-6", "top-6 right-6", "bottom-6 left-6", "bottom-6 right-6"].map((pos, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className={`absolute ${pos} w-4 h-4 border-white/20 hidden sm:block`}
                style={{
                  borderTop: pos.includes("top") ? "1px solid" : "none",
                  borderBottom: pos.includes("bottom") ? "1px solid" : "none",
                  borderLeft: pos.includes("left") ? "1px solid" : "none",
                  borderRight: pos.includes("right") ? "1px solid" : "none",
                }}
              />
            ))}
          </div>
        </motion.main>
      ) : (
        <motion.div
          key="transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black z-50"
        />
      )}
    </AnimatePresence>
  );
}

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <p className="text-white font-black text-lg tracking-[0.2em] uppercase">
              ROBBIE CAN&apos;T BEAT ME
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8 text-zinc-500 text-xs tracking-widest uppercase">
            <Link href="/shop" className="hover:text-white transition-colors">
              Shop
            </Link>
            <Link href="/product/robbie-cant-beat-me-tee" className="hover:text-white transition-colors">
              Product
            </Link>
            <a href="mailto:contact@robbiecantbeatme.com" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-zinc-700 text-xs">
          <p>Robbie Can&apos;t Beat Me 2026</p>
        </div>
      </div>
    </footer>
  );
}

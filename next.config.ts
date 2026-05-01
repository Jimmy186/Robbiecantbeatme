import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/cart/c/:path*",
        destination: "https://x7x1ww-y8.myshopify.com/cart/c/:path*",
        permanent: false,
      },
      {
        source: "/checkouts/:path*",
        destination: "https://x7x1ww-y8.myshopify.com/checkouts/:path*",
        permanent: false,
      },
      {
        source: "/a/pay",
        destination: "https://x7x1ww-y8.myshopify.com/a/pay",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

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
        source: "/cart/:path*",
        destination: "https://x7x1ww-y8.myshopify.com/cart/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

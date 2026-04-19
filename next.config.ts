import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tidy-wardrobe-h8x-lqdlri0.t3.storageapi.dev",
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed basePath to simplify routing
  images: {
    unoptimized: true,
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;

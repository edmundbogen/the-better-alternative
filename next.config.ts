import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/the-better-alternative',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: process.cwd(),
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  /* config options here */
  // cacheComponents: true,
  // partialPrefetching: true,
  // turbopack: {
  // rules: {
  // "*.css": {
  // loaders: ["@tailwindcss/turbopack"],
  // as: "*.css",
  // },
  // },
  // },
};

export default nextConfig;

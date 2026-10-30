// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: process.cwd(),
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

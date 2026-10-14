
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Generate static HTML, CSS, and JavaScript
  output: "export",

  // GitHub Pages supports folder-based routes
  trailingSlash: true,

  // Empty locally, /forever-proposal on GitHub Pages
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",

  // Avoid server-based image optimization
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

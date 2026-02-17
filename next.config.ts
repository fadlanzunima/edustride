import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
  },
  
  // Experimental features
  experimental: {
    // Enable if needed
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);

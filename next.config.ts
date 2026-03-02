import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public", // Where the service worker files will be generated
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development", // Disable in dev to prevent caching issues
});

const nextConfig: NextConfig = {
  /* Your existing config options here */
  experimental: {
    // Keep this if you are using Turbopack as seen in your error logs
  },
  turbopack: {},
};

export default withPWA(nextConfig);

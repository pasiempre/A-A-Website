import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import path from "node:path";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
    qualities: [68, 70, 75, 80],
  },
  async redirects() {
    return [
      {
        source: "/admin.html",
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/employee.html",
        destination: "/employee",
        permanent: false,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);

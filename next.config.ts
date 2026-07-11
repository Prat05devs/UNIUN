import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // The plans/prices page moved when "Pricing" was renamed — the app is
      // open source, the paid part is only the cloud inference gateway.
      { source: "/pricing", destination: "/ai-inference", permanent: true }
    ];
  },
  async headers() {
    return [
      {
        source: "/.well-known/apple-app-site-association",
        headers: [{ key: "Content-Type", value: "application/json" }]
      }
    ];
  }
};

export default nextConfig;

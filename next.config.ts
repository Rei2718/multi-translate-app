import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "/api/compliance-check": ["./docs/**/*"],
    },
  },
};

export default nextConfig;

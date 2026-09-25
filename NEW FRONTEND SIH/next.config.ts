import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Backend 1: Core Service (Auth, Users, Issues)
      {
        source: "/api/backend-core/:path*",
        destination: "http://localhost:8001/api/v1/:path*",
      },
      // Backend 2: Social-X Core Gateway & AI (Problems, OCR, Speech)
      {
        source: "/api/backend-socialx/:path*",
        destination: "http://localhost:8002/api/:path*",
      },
      // Backend 3: Routing & Governance Workflow Engine
      {
        source: "/api/backend-routing/:path*",
        destination: "http://localhost:8003/api/v1/:path*",
      },
      // Backend 4: Central Analytics & Notification Service
      {
        source: "/api/backend-analytics/:path*",
        destination: "http://localhost:8004/:path*",
      },
    ];
  },
};

export default nextConfig;

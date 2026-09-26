import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const port = process.env.BACKEND_PORT || "8000";
    return [
      // Backend 1: Core Service (Auth, Users, Issues) -> Unified Backend
      {
        source: "/api/backend-core/:path*",
        destination: `http://localhost:${port}/api/v1/:path*`,
      },
      // Backend 2: Social-X Core Gateway & AI (Problems, OCR, Speech) -> Unified Backend
      {
        source: "/api/backend-socialx/:path*",
        destination: `http://localhost:${port}/api/:path*`,
      },
      // Backend 3: Routing & Governance Workflow Engine -> Unified Backend
      {
        source: "/api/backend-routing/:path*",
        destination: `http://localhost:${port}/api/v1/:path*`,
      },
      // Backend 4: Central Analytics & Notification Service -> Unified Backend
      {
        source: "/api/backend-analytics/:path*",
        destination: `http://localhost:${port}/:path*`,
      },
    ];
  },

};

export default nextConfig;

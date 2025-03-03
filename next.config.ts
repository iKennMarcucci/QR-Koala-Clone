import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  runtime: "nodejs", // 👈 Forzar el runtime de Node.js
};

export default nextConfig;

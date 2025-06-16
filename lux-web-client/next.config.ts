import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: process.env.NODE_ENV === "development",
  output: "export",
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  basePath: "/online-medication",
  assetPrefix: "/online-medication/",
  images: { unoptimized: true },
};

export default nextConfig;

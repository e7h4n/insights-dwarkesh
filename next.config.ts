import type { NextConfig } from "next";

const isPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isPages ? "/insights-dwarkesh" : "",
  assetPrefix: isPages ? "/insights-dwarkesh/" : "",
};

export default nextConfig;

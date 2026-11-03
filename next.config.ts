import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // These packages ship native / dynamically-resolved bindings that the
  // bundler cannot trace. Keeping them external lets Node load them normally.
  serverExternalPackages: ["mongoose", "cloudinary"],
};

export default nextConfig;

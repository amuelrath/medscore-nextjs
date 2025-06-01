/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  reactStrictMode: false,
  experimental: {
    reactCompiler: {
      compilationMode: "infer"
    }
  }
};

const withBundleAnalyzer = require("@next/bundle-analyzer")();

module.exports =
  process.env.ANALYZE === "true" ? withBundleAnalyzer(nextConfig) : nextConfig;

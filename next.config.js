/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
};

const withBundleAnalyzer = require("@next/bundle-analyzer")();

module.exports =
  process.env.ANALYZE === "true" ? withBundleAnalyzer(nextConfig) : nextConfig;

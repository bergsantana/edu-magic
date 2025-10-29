import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // webpack: (config) => {
  //   config.watchOptions = {
  //     poll: 1000,
  //     aggregateTimeout: 300,
  //     ignored: /node_modules/,
  //   }
  //   return config
  // },
  // Enable experimental features that might help with hot reload
  experimental: {
    turbo: {
      loaders: {},
    },
  },
};

export default nextConfig;

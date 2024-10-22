import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  swcMinify: true, // Enable SWC minification
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  compiler: {
    relay: {
      src: './src', 
      artifactDirectory: './src/__generated__', 
      language: 'typescript', 
    },
  },
};

export default nextConfig;

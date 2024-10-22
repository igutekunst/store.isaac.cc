import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  swcMinify: true, // Enable SWC minification
  reactStrictMode: true,
  compiler: {
    relay: {
      src: './src', 
      artifactDirectory: './src/__generated__', 
      language: 'typescript', 
    },
  },
};

export default nextConfig;

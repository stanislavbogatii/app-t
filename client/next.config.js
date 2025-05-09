/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fresco.md',
        pathname: '/**', 
      },
    ],
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  // Keep dev and production artifacts separate so switching between
  // `next dev` and `next build` does not leave stale server chunk paths behind.
  distDir: isDev ? '.next-dev' : '.next',
};

module.exports = nextConfig;

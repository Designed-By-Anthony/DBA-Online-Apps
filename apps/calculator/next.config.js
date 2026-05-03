/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  distDir: 'dist',
  transpilePackages: ['@dba/ui'],
};

export default nextConfig;

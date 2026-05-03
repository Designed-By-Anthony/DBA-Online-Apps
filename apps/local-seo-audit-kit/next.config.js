/** @type {import("next").NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  transpilePackages: ['@dba/ui'],
};

export default nextConfig;

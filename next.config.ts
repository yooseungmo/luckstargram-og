/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: false,  
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL
  }
};
module.exports = nextConfig;
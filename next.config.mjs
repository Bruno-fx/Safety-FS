/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Tells Netlify to serve your logo directly without optimization
  },
};

export default nextConfig;
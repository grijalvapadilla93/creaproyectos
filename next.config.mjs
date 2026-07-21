/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.qwenlm.ai',
      },
    ],
  },
};

export default nextConfig;

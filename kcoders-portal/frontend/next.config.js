/** @type {import('next').NextConfig} */
const API_HOST = process.env.API_HOST || 'http://localhost:5003';

const nextConfig = {
  images: {
    domains: ['localhost', 'kcoders.org'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_HOST}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;

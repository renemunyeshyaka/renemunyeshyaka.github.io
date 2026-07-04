/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'kcoders.org'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:5003/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;

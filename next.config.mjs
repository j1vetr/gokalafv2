/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    tsconfigPath: './tsconfig.next.json',
  },
  images: {
    domains: ['gokalaf.com', 'www.gokalaf.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.gokalaf.com',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        // Proxy SPA routes to Express backend (these don't exist in Next.js)
        {
          source: '/giris',
          destination: 'http://localhost:5000/giris',
        },
        {
          source: '/kayit',
          destination: 'http://localhost:5000/kayit',
        },
        {
          source: '/panel/:path*',
          destination: 'http://localhost:5000/panel/:path*',
        },
        {
          source: '/odeme/:path*',
          destination: 'http://localhost:5000/odeme/:path*',
        },
        {
          source: '/gokadmin/:path*',
          destination: 'http://localhost:5000/gokadmin/:path*',
        },
      ],
      afterFiles: [
        // API routes proxy to Express backend
        {
          source: '/api/:path*',
          destination: 'http://localhost:5000/api/:path*',
        },
      ],
    };
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;

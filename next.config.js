/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "http://192.168.1.187:3000",
    "http://192.168.1.187",
  ],

  // Prevent Vercel builds from failing on ESLint config/runtime issues.
  // Lint still runs locally via `npm run lint` if you use it.
  eslint: { ignoreDuringBuilds: true },

  // Allow all local network origins in dev mode
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: '*' },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'rmgreatdane.org',
      },
    ],
  },
};

module.exports = nextConfig;

const { SWOP_URL } = process.env;

module.exports = {
  reactStrictMode: true,
  transpilePackages: ["ui"],
  images: {
    domains: ["pickasso.nyc3.cdn.digitaloceanspaces.com"],
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: `/:path*`,
      },
      {
        source: '/swop',
        destination: `${SWOP_URL}/swop`,
      },
      {
        source: '/swop/:path*',
        destination: `${SWOP_URL}/swop/:path*`,
      },
    ]
  },
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};

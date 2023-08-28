const { SWOP_URL } = process.env;
const withImages = require("next-images");

module.exports = withImages({
  reactStrictMode: true,
  transpilePackages: ["ui"],
  images: {
    domains: ["pickasso.nyc3.cdn.digitaloceanspaces.com"],
  },
  async rewrites() {
    return [
      // {
      //   source: '/:path*',
      //   destination: `/:path*`,
      // },
      {
        source: '/swop',
        destination: `https://byquokkas-swop.vercel.app/swop`,
      },
      {
        source: '/swop/:path*',
        destination: `https://byquokkas-swop.vercel.app/swop/:path*`,
      },
      {
        source: '/swop/accept-offer/:path',
        destination: `https://byquokkas-swop.vercel.app/swop/accept-offer/:path`,
      },
      // {
      //   source: '/swop/accept-offer/:path*',
      //   destination: `https://byquokkas-swop.vercel.app/swop/accept-offer/:path*`,
      // },
      // {
      //   source: '/swop/_next/:path*',
      //   destination: `https://byquokkas-swop.vercel.app/swop/_next/:path*`,
      // }
    ]
  },
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
});

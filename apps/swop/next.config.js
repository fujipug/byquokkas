const withImages = require("next-images");

module.exports = withImages({
  reactStrictMode: true,
  transpilePackages: ["ui"],
  images: {
    domains: ["pickasso.nyc3.cdn.digitaloceanspaces.com"],
  },
  basePath: '/swop',
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
});

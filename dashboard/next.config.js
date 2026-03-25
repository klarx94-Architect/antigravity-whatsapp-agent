/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/antigravity-whatsapp-agent',
  assetPrefix: '/antigravity-whatsapp-agent/',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig

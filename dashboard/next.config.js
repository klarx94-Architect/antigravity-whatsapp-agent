/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  basePath: isProd ? '/antigravity-whatsapp-agent' : '',
  assetPrefix: isProd ? 'https://klarx94-Architect.github.io/antigravity-whatsapp-agent/' : '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig

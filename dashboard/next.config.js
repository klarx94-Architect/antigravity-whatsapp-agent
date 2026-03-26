/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  // Configuración estándar para Vercel (v4.8.0)
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig

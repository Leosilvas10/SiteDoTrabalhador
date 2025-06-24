
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Configurações de imagens
  images: {
    domains: ['localhost'],
    unoptimized: true
  },

  // Configurações experimentais
  experimental: {
    forceSwcTransforms: true
  },

  // Configurações de compilação
  compiler: {
    styledComponents: true
  },

  // Headers para CORS se necessário
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Configurações de imagens
  images: {
    domains: ["localhost"],
    unoptimized: true,
  },

  // Configurações experimentais
  experimental: {
    forceSwcTransforms: true,
  },

  // Configurações de compilação
  compiler: {
    styledComponents: true,
  },

  // Configuração do Webpack para resolver módulos Node.js
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        child_process: false,
        net: false,
        fs: false,
        "pg-hstore": false,
        memcached: false,
        sequelize: false,
        pg: false,
        "pg-connection-string": false,
      };
    }
    return config;
  },

  // Headers para CORS se necessário
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

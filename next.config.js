/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  // Desabilita o Service Worker em desenvolvimento
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      // Força a desativação do Service Worker em produção também, se necessário
      config.plugins = config.plugins.filter(plugin => {
        return plugin.constructor.name !== 'GenerateSW';
      });
    }
    return config;
  },
}

// Desabilita o Service Worker em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  console.log('Modo de desenvolvimento: Service Worker desabilitado');
}

module.exports = nextConfig

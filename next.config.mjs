/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Disable Next.js built-in i18n since we're using custom middleware
  // i18n: undefined,
  
  // Enable server components to access headers
  serverExternalPackages: [],
  
  // Webpack configuration for i18n optimization
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add i18n optimization rules for production builds
    if (!dev && !isServer) {
      // Configure code splitting for translation files
      config.optimization = config.optimization || {}
      config.optimization.splitChunks = config.optimization.splitChunks || {}
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        // Split translation files into separate chunks
        i18n: {
          test: /[\\/]locales[\\/]/,
          name: 'i18n',
          chunks: 'all',
          enforce: true,
          priority: 30
        },
        // Split by language for better caching
        i18nLanguages: {
          test: /[\\/]locales[\\/][a-z]{2}(-[A-Z]{2})?[\\/]/,
          name(module) {
            const match = module.resource.match(/[\\/]locales[\\/]([a-z]{2}(?:-[A-Z]{2})?)[\\/]/)
            return match ? `i18n-${match[1]}` : 'i18n-misc'
          },
          chunks: 'all',
          enforce: true,
          priority: 25
        },
        // Split by namespace for lazy loading
        i18nNamespaces: {
          test: /[\\/]locales[\\/][^/]+[\\/]([^/]+)\.json$/,
          name(module) {
            const match = module.resource.match(/[\\/]locales[\\/][^/]+[\\/]([^/]+)\.json$/)
            return match ? `i18n-${match[1]}` : 'i18n-misc'
          },
          chunks: 'all',
          enforce: true,
          priority: 20
        }
      }

      // Add compression for translation files if plugin is available
      try {
        const CompressionPlugin = require('compression-webpack-plugin')
        config.plugins.push(
          new CompressionPlugin({
            test: /locales.*\.json$/,
            algorithm: 'gzip',
            threshold: 1024,
            minRatio: 0.8
          })
        )
      } catch (error) {
        console.warn('compression-webpack-plugin not available, skipping compression')
      }

      // Custom loader disabled for now - requires loader-utils dependency
      // config.module.rules.push({
      //   test: /\.json$/,
      //   include: /locales/,
      //   use: [
      //     defaultLoaders.babel,
      //     {
      //       loader: './lib/i18n/webpack-loaders/tree-shake-translations-loader.js',
      //       options: {
      //         minificationLevel: 'basic',
      //         keepUnused: false
      //       }
      //     }
      //   ]
      // })
    }

    // Add bundle analyzer in development
    if (process.env.ANALYZE === 'true') {
      try {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerPort: 8888,
            openAnalyzer: true
          })
        )
      } catch (error) {
        console.warn('webpack-bundle-analyzer not available, skipping bundle analysis')
      }
    }

    return config
  },
  
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@/lib/i18n'],
    webpackBuildWorker: true
  },
  

  
  // Configure redirects for root path
  async redirects() {
    return [
      // The middleware will handle root redirects
    ]
  },
  
  // Configure rewrites for clean URLs
  async rewrites() {
    return {
      beforeFiles: [
        // These rewrites are checked after headers/redirects
        // and before all files including _next/static files
      ],
      afterFiles: [
        // These rewrites are checked after static files
        // but before dynamic routes
      ],
      fallback: [
        // These rewrites are checked after both pages/public files
        // and dynamic routes are checked
      ],
    }
  },
}

export default nextConfig

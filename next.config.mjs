/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  swcMinify: true,
  output: "standalone",
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Disable Next.js built-in i18n since we're using custom middleware
  // i18n: undefined,

  // Enable server components to access headers
  serverExternalPackages: ["@prisma/client", "bcryptjs", "jose"],

  // Environment variables for build
  env: {
    DATABASE_URL:
      process.env.DATABASE_URL ||
      "postgresql://placeholder:placeholder@localhost:5432/placeholder",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "build-secret",
    JWT_SECRET: process.env.JWT_SECRET || "build-jwt-secret",
  },

  // Webpack configuration for i18n optimization and build fixes
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Handle missing modules gracefully
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    // Add i18n optimization rules for production builds
    if (!dev && !isServer) {
      // Configure code splitting for translation files
      config.optimization = config.optimization || {};
      config.optimization.splitChunks = config.optimization.splitChunks || {};
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        // Split translation files into separate chunks
        i18n: {
          test: /[\\/]locales[\\/]/,
          name: "i18n",
          chunks: "all",
          enforce: true,
          priority: 30,
        },
        // Split by language for better caching
        i18nLanguages: {
          test: /[\\/]locales[\\/][a-z]{2}(-[A-Z]{2})?[\\/]/,
          name(module) {
            const match = module.resource.match(
              /[\\/]locales[\\/]([a-z]{2}(?:-[A-Z]{2})?)[\\/]/,
            );
            return match ? `i18n-${match[1]}` : "i18n-misc";
          },
          chunks: "all",
          enforce: true,
          priority: 25,
        },
        // Split by namespace for lazy loading
        i18nNamespaces: {
          test: /[\\/]locales[\\/][^/]+[\\/]([^/]+)\.json$/,
          name(module) {
            const match = module.resource.match(
              /[\\/]locales[\\/][^/]+[\\/]([^/]+)\.json$/,
            );
            return match ? `i18n-${match[1]}` : "i18n-misc";
          },
          chunks: "all",
          enforce: true,
          priority: 20,
        },
      };

      // Add compression for translation files if plugin is available
      try {
        const CompressionPlugin = require("compression-webpack-plugin");
        config.plugins.push(
          new CompressionPlugin({
            test: /locales.*\.json$/,
            algorithm: "gzip",
            threshold: 1024,
            minRatio: 0.8,
          }),
        );
      } catch (error) {
        // Silently skip if compression plugin not available
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
    if (process.env.ANALYZE === "true") {
      try {
        const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: "server",
            analyzerPort: 8888,
            openAnalyzer: true,
          }),
        );
      } catch (error) {
        // Silently skip if bundle analyzer not available
      }
    }

    return config;
  },

  // Experimental features for better performance
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
    optimizePackageImports: ["lucide-react"],
  },

  // Configure redirects for root path
  async redirects() {
    return [
      // The middleware will handle root redirects
    ];
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
    };
  },
};

export default nextConfig;

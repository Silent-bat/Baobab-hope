// Webpack optimization utilities for translation bundles

interface WebpackConfig {
  optimization?: {
    splitChunks?: {
      chunks?: string
      cacheGroups?: Record<string, any>
    }
  }
  module?: {
    rules?: Array<any>
  }
  plugins?: Array<any>
}

interface I18nOptimizationConfig {
  enableCodeSplitting: boolean
  enableTreeShaking: boolean
  enableCompression: boolean
  chunkSizeThreshold: number
  supportedLanguages: string[]
}

export class WebpackI18nOptimizer {
  private config: I18nOptimizationConfig

  constructor(config: Partial<I18nOptimizationConfig> = {}) {
    this.config = {
      enableCodeSplitting: true,
      enableTreeShaking: true,
      enableCompression: true,
      chunkSizeThreshold: 50000, // 50KB
      supportedLanguages: ['en', 'fr', 'es', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'ar', 'hi'],
      ...config
    }
  }

  /**
   * Generate webpack configuration for i18n optimization
   */
  generateWebpackConfig(): Partial<WebpackConfig> {
    const config: Partial<WebpackConfig> = {}

    if (this.config.enableCodeSplitting) {
      config.optimization = {
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Split translation files into separate chunks
            i18n: {
              test: /[\\/]locales[\\/]/,
              name: 'i18n',
              chunks: 'all',
              enforce: true,
              priority: 30
            },
            // Split by language
            ...this.generateLanguageChunks(),
            // Split by namespace
            ...this.generateNamespaceChunks()
          }
        }
      }
    }

    if (this.config.enableTreeShaking) {
      config.module = {
        rules: [
          {
            test: /\.json$/,
            include: /locales/,
            use: [
              {
                loader: 'json-loader'
              },
              {
                loader: this.getTreeShakingLoader()
              }
            ]
          }
        ]
      }
    }

    return config
  }

  /**
   * Generate language-specific chunk configurations
   */
  private generateLanguageChunks(): Record<string, any> {
    const chunks: Record<string, any> = {}

    for (const language of this.config.supportedLanguages) {
      chunks[`i18n-${language}`] = {
        test: new RegExp(`[\\\\/]locales[\\\\/]${language}[\\\\/]`),
        name: `i18n-${language}`,
        chunks: 'all',
        enforce: true,
        priority: 25
      }
    }

    return chunks
  }

  /**
   * Generate namespace-specific chunk configurations
   */
  private generateNamespaceChunks(): Record<string, any> {
    const namespaces = ['common', 'navigation', 'forms', 'errors', 'pages', 'components']
    const chunks: Record<string, any> = {}

    for (const namespace of namespaces) {
      chunks[`i18n-${namespace}`] = {
        test: new RegExp(`[\\\\/]locales[\\\\/][^/]+[\\\\/]${namespace}\\.json$`),
        name: `i18n-${namespace}`,
        chunks: 'all',
        enforce: true,
        priority: 20
      }
    }

    return chunks
  }

  /**
   * Get tree shaking loader configuration
   */
  private getTreeShakingLoader(): string {
    // This would be a custom webpack loader for tree shaking translations
    // For now, return a placeholder path
    return require.resolve('./webpack-loaders/tree-shake-translations-loader')
  }

  /**
   * Generate Next.js configuration for i18n optimization
   */
  generateNextConfig(): any {
    return {
      webpack: (config: any, { buildId, dev, isServer, defaultLoaders, webpack }: any) => {
        // Add i18n optimization rules
        if (!dev && !isServer) {
          // Add translation bundle optimization
          config.optimization = config.optimization || {}
          config.optimization.splitChunks = config.optimization.splitChunks || {}
          config.optimization.splitChunks.cacheGroups = {
            ...config.optimization.splitChunks.cacheGroups,
            ...this.generateWebpackConfig().optimization?.splitChunks?.cacheGroups
          }

          // Add compression for translation files
          if (this.config.enableCompression) {
            const CompressionPlugin = require('compression-webpack-plugin')
            config.plugins.push(
              new CompressionPlugin({
                test: /locales.*\.json$/,
                algorithm: 'gzip',
                threshold: 1024,
                minRatio: 0.8
              })
            )
          }
        }

        return config
      },
      
      // Experimental features for better i18n support
      experimental: {
        optimizeCss: true,
        optimizePackageImports: ['@/lib/i18n']
      }
    }
  }

  /**
   * Generate bundle analyzer configuration
   */
  generateBundleAnalyzerConfig(): any {
    return {
      enabled: process.env.ANALYZE === 'true',
      bundleAnalyzerConfig: {
        mode: 'server',
        analyzerHost: '127.0.0.1',
        analyzerPort: 8888,
        reportFilename: 'bundle-analysis.html',
        defaultSizes: 'parsed',
        openAnalyzer: true,
        generateStatsFile: true,
        statsFilename: 'bundle-stats.json',
        logLevel: 'info'
      }
    }
  }

  /**
   * Generate service worker configuration for translation caching
   */
  generateServiceWorkerConfig(): any {
    return {
      swSrc: 'public/sw.js',
      swDest: 'static/sw.js',
      runtimeCaching: [
        {
          urlPattern: /^\/locales\/.*\.json$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'i18n-translations',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 24 * 60 * 60 // 24 hours
            },
            cacheKeyWillBeUsed: async ({ request }: any) => {
              // Include language and version in cache key
              const url = new URL(request.url)
              return `${url.pathname}?v=1.0`
            }
          }
        }
      ]
    }
  }

  /**
   * Generate performance budget configuration
   */
  generatePerformanceBudget(): any {
    return {
      performance: {
        maxAssetSize: this.config.chunkSizeThreshold,
        maxEntrypointSize: this.config.chunkSizeThreshold * 2,
        assetFilter: (assetFilename: string) => {
          // Apply budget to translation files
          return assetFilename.includes('i18n') || assetFilename.includes('locales')
        }
      }
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<I18nOptimizationConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Get current configuration
   */
  getConfig(): I18nOptimizationConfig {
    return { ...this.config }
  }
}

// Export singleton instance
export const webpackI18nOptimizer = new WebpackI18nOptimizer()

// Helper function for Next.js configuration
export function withI18nOptimization(nextConfig: any = {}) {
  const optimizer = new WebpackI18nOptimizer()
  const i18nConfig = optimizer.generateNextConfig()
  
  return {
    ...nextConfig,
    ...i18nConfig,
    webpack: (config: any, options: any) => {
      // Apply i18n optimizations
      config = i18nConfig.webpack(config, options)
      
      // Apply user's webpack config if exists
      if (nextConfig.webpack) {
        config = nextConfig.webpack(config, options)
      }
      
      return config
    }
  }
}
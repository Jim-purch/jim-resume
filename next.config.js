const { withContentlayer } = require('next-contentlayer2')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// You might need to insert additional domains in script-src if you are using external services
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app analytics.umami.is;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src *.s3.amazonaws.com;
  connect-src *;
  font-src 'self';
  frame-src giscus.app
`

// Relaxed CSP for legacy static sub-sites (/resume, /tools) that load
// Google Fonts, Font Awesome and pdf.js/jszip from public CDNs.
const LegacyStaticCSP = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' cdnjs.cloudflare.com;
  style-src 'self' 'unsafe-inline' fonts.googleapis.com cdnjs.cloudflare.com;
  img-src * blob: data:;
  connect-src *;
  font-src 'self' fonts.gstatic.com cdnjs.cloudflare.com;
  frame-src 'none';
  worker-src 'self' blob:
`

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

// Subset of security headers for legacy static sub-sites.
// Note: X-Frame-Options is omitted so the pages can be previewed in iframes if needed.
const legacyStaticHeaders = [
  { key: 'Content-Security-Policy', value: LegacyStaticCSP.replace(/\n/g, '') },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
]

const output = process.env.EXPORT ? 'export' : undefined
const basePath = process.env.BASE_PATH || undefined
const unoptimized = process.env.UNOPTIMIZED ? true : undefined

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
module.exports = () => {
  const plugins = [withContentlayer, withBundleAnalyzer]
  return plugins.reduce((acc, next) => next(acc), {
    output,
    basePath,
    reactStrictMode: true,
    trailingSlash: true,
    turbopack: {
      root: process.cwd(),
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'picsum.photos',
        },
      ],
      unoptimized,
    },
    async headers() {
      return [
        // Legacy static sub-sites and root resume get a relaxed CSP that allows Google Fonts
        // and Cloudflare CDN (Font Awesome, pdf.js, jszip, FileSaver.js).
        {
          source: '/',
          headers: legacyStaticHeaders,
        },
        {
          source: '/resume/:path*',
          headers: legacyStaticHeaders,
        },
        {
          source: '/tools/:path*',
          headers: legacyStaticHeaders,
        },
        // Strict CSP applies to all other routes (catch-all excludes root, resume, and tools).
        {
          source: '/((?!resume/|tools/|$).*)',
          headers: securityHeaders,
        },
      ]
    },
    async rewrites() {
      return {
        beforeFiles: [
          // Serve resume at root path
          { source: '/', destination: '/resume/index.html' },
          // Rewrite root image requests to resume images folder for backwards compatibility
          { source: '/images/:path*', destination: '/resume/images/:path*' },
          // Serve legacy static index files when their directory is requested
          // (Next.js does not auto-serve index.html under public/ folders).
          { source: '/resume', destination: '/resume/index.html' },
          { source: '/resume/', destination: '/resume/index.html' },
          { source: '/tools', destination: '/tools/converter.html' },
          { source: '/tools/', destination: '/tools/converter.html' },
        ],
      }
    },
    webpack: (config, options) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      })

      return config
    },
  })
}

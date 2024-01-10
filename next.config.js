const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  experimental: {
    instrumentationHook: true,
    // don't bundle the package
    serverComponentsExternalPackages: ['@google-cloud/datastore']
  }
}

module.exports = nextConfig

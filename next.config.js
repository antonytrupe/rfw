const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  experimental: { instrumentationHook: true }
}

module.exports = nextConfig

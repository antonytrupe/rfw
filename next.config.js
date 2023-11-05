const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        //serverActions: true,
    },
    output: 'standalone',
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
      },
}

module.exports = nextConfig

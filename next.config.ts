/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.us-east-2.amazonaws.com',
        pathname: '/centimentalcomics.com/assets/images/**',
      },
      {
        protocol: 'https',
        hostname: 'www.datocms-assets.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.datocms-assets.com',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig


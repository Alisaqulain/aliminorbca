/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  async redirects() {
    return [
      { source: '/passenger/dashboar', destination: '/passenger/dashboard', permanent: false },
      { source: '/admin/login', destination: '/login/admin', permanent: false },
      { source: '/passenger/tickets/:id', destination: '/ticket/:id', permanent: false },
    ]
  },
}

module.exports = nextConfig


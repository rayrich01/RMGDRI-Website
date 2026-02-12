/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignore ESLint during builds to prevent circular serialization crashes
    // ESLint will still run locally and can be enforced in GitHub Actions
    ignoreDuringBuilds: true,
  },
}

export default nextConfig

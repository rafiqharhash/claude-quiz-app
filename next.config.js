/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent Next.js from bundling pdf-parse (uses Node.js 'fs' internally)
  serverExternalPackages: ['pdf-parse'],
};

module.exports = nextConfig;

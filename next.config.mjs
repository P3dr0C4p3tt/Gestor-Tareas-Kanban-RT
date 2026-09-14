/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  // Mantenemos la regla para Prisma que configuramos antes
  serverExternalPackages: ['@prisma/client'],
};

export default nextConfig;
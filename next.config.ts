import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['@prisma/client', 'bcrypt'],
  // Disable standalone output in development for better performance
  ...(process.env.NODE_ENV === 'development' && {
    output: undefined,
  }),
};

export default nextConfig;

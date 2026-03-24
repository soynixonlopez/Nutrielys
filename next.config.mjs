/** @type {import('next').NextConfig} */
const nextConfig = {
  // Evita conflictos de limpieza de .next en rutas sincronizadas por OneDrive (Windows)
  distDir: ".next-dev",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

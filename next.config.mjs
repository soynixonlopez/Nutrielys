/** @type {import('next').NextConfig} */
const nextConfig = {
  // En Vercel debe usarse el directorio por defecto (.next); si no, falla routes-manifest.
  // En local (p. ej. OneDrive en Windows) se puede usar .next-dev para evitar conflictos de sync.
  ...(process.env.VERCEL ? {} : { distDir: ".next-dev" }),
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

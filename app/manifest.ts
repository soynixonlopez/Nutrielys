import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nutrielys",
    short_name: "Nutrielys",
    description: "Snacks naturales deshidratados",
    start_url: "/",
    display: "standalone",
    background_color: "#FDF8EE",
    theme_color: "#4D654A",
    icons: [
      {
        src: "/logo/nutrielyslogo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo/nutrielyslogo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.nutrielys.com"),
  title: {
    default: "Nutrielys | Snacks naturales deshidratados",
    template: "%s | Nutrielys",
  },
  description:
    "Frutas y vegetales deshidratados con el sabor de Panamá. Snacks saludables, naturales y deliciosos.",
  keywords: ["frutas deshidratadas", "snacks saludables", "Panamá", "nutrición", "natural"],
  icons: {
    icon: [{ url: "/logo/nutrielyslogo.png", sizes: "512x512", type: "image/png" }],
    shortcut: ["/logo/nutrielyslogo.png"],
    apple: [{ url: "/logo/nutrielyslogo.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    title: "Nutrielys | Snacks naturales deshidratados",
    description:
      "Frutas y vegetales deshidratados con el sabor de Panamá. Snacks saludables, naturales y deliciosos.",
    siteName: "Nutrielys",
    images: [
      {
        url: "/logo/nutrielyslogo.png",
        width: 512,
        height: 512,
        alt: "Logo de Nutrielys",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Nutrielys | Snacks naturales deshidratados",
    description:
      "Frutas y vegetales deshidratados con el sabor de Panamá. Snacks saludables, naturales y deliciosos.",
    images: ["/logo/nutrielyslogo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.nutrielys.com";
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nutrielys",
    url: siteUrl,
    logo: `${siteUrl}/logo/nutrielyslogo.png`,
  };

  return (
    <html lang="es" className={`${inter.variable} ${dmSerif.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}

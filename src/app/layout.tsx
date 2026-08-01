import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource-variable/fraunces/opsz-italic.css";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://creaproyectos.com"),
  title: {
    default: "CREA PROYECTOS — Gestión Ambiental y Ejecución de Proyectos en Guatemala",
    template: "%s | CREA PROYECTOS",
  },
  description:
    "Consultoría ambiental especializada en licencias MARN, INAB, CONAP y municipales, más planificación y ejecución de obra civil. Un solo aliado para todo tu proyecto en Guatemala.",
  keywords: [
    "licencia ambiental Guatemala",
    "MARN",
    "INAB",
    "CONAP",
    "CONRED",
    "consultoría ambiental",
    "obra civil Guatemala",
    "estudio de impacto ambiental",
  ],
  icons: {
    icon: "/crealogo.jpeg",
    shortcut: "/crealogo.jpeg",
    apple: "/crealogo.jpeg",
  },
  openGraph: {
    title: "CREA PROYECTOS — Gestión Ambiental y Ejecución de Proyectos",
    description:
      "Licencias ambientales, forestales y municipales + obra civil en Guatemala. Más de una década acompañando proyectos de principio a fin.",
    url: "https://creaproyectos.com",
    siteName: "CREA PROYECTOS",
    locale: "es_GT",
    type: "website",
    images: [{ url: "/BgLandingPageCrea.png", width: 1792, height: 1024 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CREA PROYECTOS — Gestión Ambiental en Guatemala",
    description:
      "Licencias ambientales, forestales y municipales + obra civil. Un solo aliado para todo tu proyecto.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0F1B1E",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CREA PROYECTOS, S.A.",
  url: "https://creaproyectos.com",
  logo: "https://creaproyectos.com/crealogo.jpeg",
  description:
    "Consultoría ambiental y ejecutora de proyectos en Guatemala. Licencias ambientales, forestales y municipales, y planificación y ejecución de obra civil.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "GT",
    addressLocality: "Guatemala",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+502-5413-7785",
    contactType: "customer service",
    areaServed: "GT",
    availableLanguage: "Spanish",
  },
  email: "info@creaproyectos.com",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CREA PROYECTOS",
  url: "https://creaproyectos.com",
  inLanguage: "es-GT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CREA PROYECTOS — Gestión Ambiental Estratégica en Guatemala",
  description:
    "Consultoría ambiental especializada en licencias MARN, INAB, CONAP y municipales. Gestionamos el cumplimiento normativo de tu proyecto en Guatemala.",
  icons: {
    icon: '/crealogo.jpeg',
    shortcut: '/crealogo.jpeg',
    apple: '/crealogo.jpeg',
  },
  openGraph: {
    title: "CREA PROYECTOS — Gestión Ambiental",
    description:
      "Licencias ambientales, forestales y municipales en Guatemala. Más de una década de experiencia.",
    url: "https://creaproyectos.com",
    siteName: "CREA PROYECTOS",
    locale: "es_GT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

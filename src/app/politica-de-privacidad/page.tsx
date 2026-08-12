import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description:
    'Cómo CREA PROYECTOS recopila, usa y protege la información de sus clientes y visitantes.',
  robots: { index: true, follow: true },
};

const LAST_UPDATED = '11 de agosto de 2026';

const SECTIONS = [
  {
    title: 'Información que recopilamos',
    body: 'Cuando nos contactás a través de nuestro sitio web, WhatsApp, redes sociales o formularios, podemos recopilar: nombre completo, nombre de empresa u organización, número de teléfono, correo electrónico, y la información que nos compartas sobre tu proyecto o consulta.',
  },
  {
    title: 'Cómo usamos tu información',
    body: 'Usamos esta información únicamente para: responder a tus consultas, darte seguimiento sobre nuestros servicios, agendar consultas y reuniones, y mejorar nuestra atención al cliente. No usamos tu información para fines distintos a estos.',
  },
  {
    title: 'Comunicación por WhatsApp y chat',
    body: 'Si nos contactás por WhatsApp o por el asistente virtual de nuestro sitio, la conversación puede quedar almacenada para poder darte seguimiento y mejorar nuestro servicio. No compartimos el contenido de estas conversaciones con terceros salvo que la ley lo requiera.',
  },
  {
    title: 'Compartir información con terceros',
    body: 'No vendemos ni alquilamos tu información personal a terceros. Solo la compartimos cuando es necesario para prestar el servicio (por ejemplo, con instituciones gubernamentales como parte de un trámite que gestionamos para vos), o cuando la ley nos lo exige.',
  },
  {
    title: 'Almacenamiento y seguridad',
    body: 'Tomamos medidas razonables para proteger tu información contra acceso no autorizado, pérdida o mal uso. Conservamos tus datos solo el tiempo necesario para los fines descritos en esta política o mientras exista una relación comercial activa.',
  },
  {
    title: 'Tus derechos',
    body: 'Podés solicitarnos en cualquier momento que te confirmemos qué información tenemos sobre vos, que la corrijamos, o que la eliminemos, escribiéndonos a info@creaproyectos.com.',
  },
  {
    title: 'Cambios a esta política',
    body: 'Podemos actualizar esta política ocasionalmente. La fecha de "última actualización" al inicio de este documento indica la versión más reciente.',
  },
  {
    title: 'Contacto',
    body: 'Si tenés preguntas sobre esta política de privacidad, escribinos a info@creaproyectos.com o al +502 5413 7785.',
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-crema min-h-screen font-sans antialiased">
      {/* Header */}
      <header className="border-b border-carbon/10">
        <div className="max-w-3xl mx-auto px-6 md:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="shrink-0">
            <span className="inline-block bg-white rounded-lg p-1 shadow-sm ring-1 ring-black/5">
              <img src="/crealogo.jpeg" alt="CREA PROYECTOS, S.A." className="h-9 w-auto block" />
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-carbon/60 hover:text-teal transition-colors"
          >
            <ArrowLeft size={13} strokeWidth={1.5} />
            VOLVER AL INICIO
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <p className="font-mono text-[11px] tracking-[0.25em] text-teal mb-4">LEGAL</p>
        <h1 className="font-display font-semibold text-4xl md:text-5xl tracking-tight text-carbon mb-3">
          Política de Privacidad
        </h1>
        <p className="font-mono text-[10px] tracking-[0.15em] text-carbon/40 mb-14">
          ÚLTIMA ACTUALIZACIÓN: {LAST_UPDATED.toUpperCase()}
        </p>

        <p className="text-carbon/70 leading-relaxed mb-16 max-w-xl">
          En CREA PROYECTOS valoramos la privacidad de nuestros clientes y visitantes. Esta
          política explica qué información recopilamos, cómo la usamos y cómo la protegemos.
        </p>

        <div className="space-y-14">
          {SECTIONS.map((section, i) => (
            <div key={section.title} className="border-t border-carbon/10 pt-8">
              <div className="flex items-start gap-4 mb-4">
                <span className="font-mono text-[11px] tracking-[0.2em] text-teal mt-1">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="font-display font-medium text-2xl text-carbon">{section.title}</h2>
              </div>
              <p className="text-carbon/70 leading-relaxed pl-9">{section.body}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-carbon/10 mt-16 pt-8 flex flex-col sm:flex-row gap-4 sm:gap-8">
          <a
            href="mailto:info@creaproyectos.com"
            className="flex items-center gap-2.5 text-sm text-carbon/70 hover:text-teal transition-colors"
          >
            <Mail size={14} strokeWidth={1.5} />
            info@creaproyectos.com
          </a>
          <a
            href="https://wa.me/50254137785"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-sm text-carbon/70 hover:text-teal transition-colors"
          >
            <Phone size={14} strokeWidth={1.5} />
            +502 5413 7785
          </a>
        </div>
      </main>
    </div>
  );
}

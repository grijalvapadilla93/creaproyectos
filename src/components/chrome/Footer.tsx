'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Mail, MapPin, Phone } from 'lucide-react';
import { scrollToId, getLenis } from '@/lib/scroll';
import { Magnetic, EASE } from '@/components/ui/primitives';

const WHATSAPP_URL = 'https://wa.me/50254137785?text=Quiero%20informaci%C3%B3n';

// ─── Floating WhatsApp button ─────────────────────────────
export function WhatsAppFloat() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handle = () => setShow(window.scrollY > 480);
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escríbenos por WhatsApp"
          className="fixed bottom-6 right-6 z-[80] group flex items-center"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <span className="pointer-events-none mr-3 font-mono text-[10px] tracking-[0.2em] text-carbon/60 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            ¿HABLAMOS?
          </span>
          <span className="relative w-14 h-14 rounded-full flex items-center justify-center bg-[#25D366] shadow-lg shadow-[#25D366]/30 group-hover:scale-110 group-active:scale-95 transition-transform duration-300">
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" style={{ animationDuration: '2.5s' }} />
            <svg width="26" height="26" viewBox="0 0 24 24" fill="white" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}

// ─── Footer ───────────────────────────────────────────────
export default function Footer() {
  const year = new Date().getFullYear();

  const backToTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-night text-crema overflow-hidden">
      <div className="absolute inset-0 topo-pattern opacity-[0.04]" />
      <div className="absolute inset-0 noise-overlay opacity-[0.03] mix-blend-soft-light pointer-events-none" />
      {/* top gradient hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal/60 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-20 md:pt-28">
        {/* Giant wordmark */}
        <motion.p
          className="font-display font-semibold leading-[0.85] tracking-tight text-[16vw] md:text-[11vw] select-none text-stroke-cream transition-colors duration-700 hover:text-crema/10"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.1, ease: EASE }}
          aria-hidden
        >
          CREA<span className="italic font-light">+</span>
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 py-16 md:py-20">
          {/* Brand */}
          <div className="md:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <span className="inline-block bg-white rounded-lg p-1.5 shadow-lg mb-6">
                <img src="/crealogo.jpeg" alt="CREA PROYECTOS, S.A." className="h-11 w-auto block" />
              </span>
              <p className="text-crema/60 text-sm leading-relaxed max-w-sm mb-8">
                Consultoría ambiental y ejecutora de proyectos. Acompañamos tu proyecto desde la
                gestión de licencias hasta la ejecución de obra, con cumplimiento normativo integral.
              </p>
              <div className="flex gap-2">
                {['#3C6E80', '#5C7A5E', '#C9B896'].map((c, i) => (
                  <motion.span
                    key={i}
                    className="h-[2px] w-10 rounded-full"
                    style={{ backgroundColor: c }}
                    animate={{ opacity: [0.35, 0.9, 0.35] }}
                    transition={{ duration: 3, delay: i * 0.6, repeat: Infinity, ease: 'easeInOut' }}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Nav */}
          <div className="md:col-span-3">
            <p className="font-mono text-[10px] tracking-[0.3em] text-crema/40 mb-6">NAVEGACIÓN</p>
            <div className="space-y-3.5">
              {[
                { label: 'Inicio', id: 'hero' },
                { label: 'Nosotros', id: 'about' },
                { label: 'Servicios', id: 'services' },
                { label: 'Proceso', id: 'process' },
                { label: 'Contacto', id: 'contact' },
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => scrollToId(l.id)}
                  className="block text-sm text-crema/70 hover:text-arena transition-colors duration-300 hover:translate-x-1.5 transform"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="md:col-span-2">
            <p className="font-mono text-[10px] tracking-[0.3em] text-crema/40 mb-6">SERVICIOS</p>
            <div className="space-y-3.5">
              {['EIA', 'PGA', 'Licencias', 'Gestión institucional', 'Obra civil'].map((s) => (
                <button
                  key={s}
                  onClick={() => scrollToId('services')}
                  className="block text-sm text-crema/70 hover:text-arena transition-colors duration-300 hover:translate-x-1.5 transform text-left"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-2">
            <p className="font-mono text-[10px] tracking-[0.3em] text-crema/40 mb-6">CONTACTO</p>
            <div className="space-y-4 text-sm">
              <a href="mailto:info@creaproyectos.com" className="flex items-start gap-2.5 text-crema/70 hover:text-arena transition-colors">
                <Mail size={14} strokeWidth={1.5} className="mt-0.5 shrink-0" />
                info@creaproyectos.com
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 text-crema/70 hover:text-arena transition-colors">
                <Phone size={14} strokeWidth={1.5} className="mt-0.5 shrink-0" />
                +502 5413 7785
              </a>
              <p className="flex items-start gap-2.5 text-crema/70">
                <MapPin size={14} strokeWidth={1.5} className="mt-0.5 shrink-0" />
                Guatemala, C.A.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-crema/10 py-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <p className="font-mono text-[10px] tracking-[0.2em] text-crema/40">
            © {year} CREA PROYECTOS, S.A. — TODOS LOS DERECHOS RESERVADOS
          </p>
          <div className="flex items-center gap-6">
            <p className="font-mono text-[10px] tracking-[0.2em] text-crema/40 hidden sm:block">
              GUATEMALA, CENTROAMÉRICA
            </p>
            <Magnetic strength={18}>
              <button
                onClick={backToTop}
                aria-label="Volver arriba"
                className="w-11 h-11 rounded-full border border-crema/25 flex items-center justify-center text-crema/70 hover:bg-crema hover:text-night transition-colors duration-300"
              >
                <ArrowUp size={16} strokeWidth={1.5} />
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </footer>
  );
}

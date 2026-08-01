'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { Phone, ArrowUpRight } from 'lucide-react';
import { scrollToId } from '@/lib/scroll';
import { EASE } from '@/components/ui/primitives';

const LINKS = [
  { label: 'INICIO', id: 'hero' },
  { label: 'NOSOTROS', id: 'about' },
  { label: 'SERVICIOS', id: 'services' },
  { label: 'PROCESO', id: 'process' },
  { label: 'CONTACTO', id: 'contact' },
];

// ─── Scroll progress bar ──────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[70]"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #3C6E80, #5C7A5E, #C9B896)',
      }}
    />
  );
}

// ─── Side dot navigation (desktop) ────────────────────────
export function SectionDots({ active }: { active: string }) {
  const labels: Record<string, string> = {
    hero: 'INICIO', about: 'NOSOTROS', services: 'SERVICIOS', process: 'PROCESO', contact: 'CONTACTO',
  };
  return (
    <div className="fixed right-6 xl:right-10 top-1/2 -translate-y-1/2 z-[60] hidden lg:flex flex-col items-center gap-4">
      <div className="w-px h-8 bg-carbon/10" />
      {LINKS.map((l) => {
        const isActive = active === l.id;
        return (
          <button
            key={l.id}
            onClick={() => scrollToId(l.id)}
            aria-label={labels[l.id]}
            className="group relative flex items-center justify-center w-5 h-5"
          >
            <motion.span
              className="block rounded-full"
              animate={{
                width: isActive ? 10 : 5,
                height: isActive ? 10 : 5,
                backgroundColor: isActive ? '#3C6E80' : 'rgba(20,20,20,0.22)',
              }}
              transition={{ duration: 0.3 }}
            />
            <span className="absolute right-full mr-4 font-mono text-[9px] tracking-[0.25em] text-carbon/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
              {labels[l.id]}
            </span>
          </button>
        );
      })}
      <div className="w-px h-8 bg-carbon/10" />
    </div>
  );
}

// ─── Main navigation ──────────────────────────────────────
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('hero');

  useEffect(() => {
    let ticking = false;
    const handle = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 60);
        const pos = window.scrollY + window.innerHeight * 0.35;
        let current = 'hero';
        for (const l of LINKS) {
          const el = document.getElementById(l.id);
          if (el && el.offsetTop <= pos) current = l.id;
        }
        setActive(current);
        ticking = false;
      });
    };
    window.addEventListener('scroll', handle, { passive: true });
    handle();
    return () => window.removeEventListener('scroll', handle);
  }, []);

  const go = useCallback((id: string) => {
    setMenuOpen(false);
    scrollToId(id);
  }, []);

  // Text color: cream over the dark hero, carbon once the glass bar kicks in
  const fg = scrolled ? 'text-carbon/80' : 'text-crema/90';

  return (
    <>
      <ScrollProgress />
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 2.1, ease: EASE }}
        className="fixed top-0 left-0 right-0 z-[65] px-5 md:px-10 lg:px-14"
      >
        {/* glass backdrop */}
        <motion.div
          className="absolute inset-0"
          animate={{
            backdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'blur(0px)',
            backgroundColor: scrolled ? 'rgba(247,246,242,0.82)' : 'rgba(247,246,242,0)',
            borderBottom: scrolled ? '1px solid rgba(60,110,128,0.12)' : '1px solid rgba(255,255,255,0)',
            boxShadow: scrolled ? '0 10px 40px rgba(15,27,30,0.06)' : '0 0 0 rgba(0,0,0,0)',
          }}
          transition={{ duration: 0.5 }}
        />

        <div className="relative flex items-center justify-between h-[76px]">
          {/* Logo */}
          <button onClick={() => go('hero')} aria-label="CREA PROYECTOS — inicio" className="shrink-0">
            <motion.span
              className="block bg-white rounded-lg p-1 shadow-sm ring-1 ring-black/5 overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
            >
              <img src="/crealogo.jpeg" alt="CREA PROYECTOS, S.A." className="h-9 md:h-10 w-auto block" />
            </motion.span>
          </button>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Principal">
            {LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => go(link.id)}
                className={`relative px-4 py-2 font-mono text-[10px] tracking-[0.2em] transition-colors duration-300 ${
                  active === link.id ? 'text-teal' : `${fg} hover:text-teal`
                }`}
              >
                {link.label}
                {active === link.id && (
                  <motion.span
                    layoutId="navDot"
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-teal"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/50254137785?text=Quiero%20informaci%C3%B3n"
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden lg:flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] transition-colors ${fg} hover:text-teal`}
            >
              <Phone size={12} strokeWidth={1.5} />
              +502 5413 7785
            </a>
            <motion.button
              onClick={() => go('contact')}
              className="hidden md:inline-flex items-center gap-2 bg-teal text-crema font-mono text-[10px] tracking-[0.2em] px-5 py-2.5 rounded-full overflow-hidden relative group"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <span className="absolute inset-0 bg-teal-deep translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 flex items-center gap-1.5">
                AGENDAR CONSULTA <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </motion.button>

            {/* Mobile burger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              className="md:hidden relative w-9 h-9 flex items-center justify-center"
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 0, backgroundColor: '#F7F6F2' } : { rotate: 0, y: -4, backgroundColor: scrolled ? '#141414' : '#F7F6F2' }}
                className="absolute w-5 h-[1.5px]"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: 0, backgroundColor: '#F7F6F2' } : { rotate: 0, y: 4, backgroundColor: scrolled ? '#141414' : '#F7F6F2' }}
                className="absolute w-5 h-[1.5px]"
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[64] bg-night md:hidden flex flex-col justify-between px-8 pt-28 pb-10"
          >
            <div className="absolute inset-0 topo-pattern opacity-[0.05]" />
            <nav className="relative flex flex-col gap-2" aria-label="Móvil">
              {LINKS.map((link, i) => (
                <motion.button
                  key={link.id}
                  onClick={() => go(link.id)}
                  initial={{ opacity: 0, y: 36 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.07, duration: 0.6, ease: EASE }}
                  className={`text-left font-display text-4xl font-medium tracking-tight py-2 ${
                    active === link.id ? 'text-arena italic' : 'text-crema'
                  }`}
                >
                  <span className="font-mono text-[10px] tracking-[0.3em] text-crema/40 mr-4 align-middle">
                    0{i + 1}
                  </span>
                  {link.label.charAt(0) + link.label.slice(1).toLowerCase()}
                </motion.button>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="relative space-y-3"
            >
              <div className="h-px bg-crema/15 mb-5" />
              <a href="https://wa.me/50254137785?text=Quiero%20informaci%C3%B3n" target="_blank" rel="noopener noreferrer"
                className="block font-mono text-xs tracking-[0.15em] text-crema/70">
                +502 5413 7785
              </a>
              <a href="mailto:info@creaproyectos.com" className="block font-mono text-xs tracking-[0.15em] text-crema/70">
                INFO@CREAPROYECTOS.COM
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

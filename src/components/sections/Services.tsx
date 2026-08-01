'use client';

import { useRef, useState } from 'react';
import {
  motion, AnimatePresence, useMotionValue, useSpring, useTransform, useVelocity,
} from 'framer-motion';
import {
  Leaf, ClipboardList, FileCheck2, Landmark, HardHat, Plus,
  Building2, Zap, Home, Sprout, Mountain, ArrowRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { scrollToId } from '@/lib/scroll';
import { Reveal, Eyebrow, EASE, SpotlightCard } from '@/components/ui/primitives';

type Service = {
  num: string;
  short: string;
  title: string;
  description: string;
  items: string[];
  icon: LucideIcon;
  from: string; // gradient fallback for the hover preview (until real photos are added)
  to: string;
  image?: string; // optional: drop a photo path here (e.g. '/images/services/eia.jpg')
};

const services: Service[] = [
  {
    num: '01', short: 'EIA',
    title: 'Evaluaciones de Impacto Ambiental',
    description: 'Identificamos, evaluamos y gestionamos los impactos ambientales de tu proyecto: estudios técnicos, líneas base, planes de manejo y seguimiento continuo.',
    items: ['Estudios de impacto detallados', 'Líneas base ambientales', 'Planes de manejo y mitigación', 'Monitoreo y seguimiento'],
    icon: Leaf, from: '#3C6E80', to: '#1F3D47',
  },
  {
    num: '02', short: 'PGA',
    title: 'Planes de Gestión Ambiental',
    description: 'Diseñamos e implementamos planes estratégicos de gestión ambiental alineados con la normativa, optimizando recursos y minimizando riesgos.',
    items: ['Planes de gestión integral', 'Programas de cumplimiento', 'Auditorías ambientales internas', 'Sistemas de gestión ambiental'],
    icon: ClipboardList, from: '#5C7A5E', to: '#2E5866',
  },
  {
    num: '03', short: 'LICENCIAS',
    title: 'Licencias Ambientales, Forestales y Municipales',
    description: 'Gestionamos todo el proceso de obtención de licencias ante MARN, INAB, CONAP y municipalidades, con acompañamiento integral en cada etapa.',
    items: ['Licencias ambientales (MARN)', 'Licencias forestales (INAB)', 'Licencias municipales', 'Permisos de construcción y operación'],
    icon: FileCheck2, from: '#C9B896', to: '#5C7A5E',
  },
  {
    num: '04', short: 'GESTIÓN',
    title: 'Gestión Institucional Ambiental',
    description: 'Coordinación y representación técnica ante todas las entidades del sector ambiental guatemalteco, con seguimiento puntual de cada expediente.',
    items: ['Gestión ante MARN y CONAP', 'Coordinación con CONRED', 'Trámites INAB', 'Gestión municipal descentralizada'],
    icon: Landmark, from: '#2E5866', to: '#0F1B1E',
  },
  {
    num: '05', short: 'OBRAS',
    title: 'Planificación y Ejecución de Proyectos',
    description: 'Desarrollamos y ejecutamos proyectos de construcción y obra civil con un enfoque integral: desde la planificación hasta la entrega final.',
    items: ['Planificación y diseño', 'Ejecución de obra civil', 'Gestión de permisos municipales', 'Supervisión y control de calidad'],
    icon: HardHat, from: '#141414', to: '#3C6E80',
  },
];

// ─── Interactive service list with cursor-following preview ─
export function Services() {
  const [active, setActive] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Cursor-following preview panel (desktop)
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 140, damping: 22, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 140, damping: 22, mass: 0.6 });
  const vx = useVelocity(px);
  const rotate = useSpring(useTransform(vx, [-1200, 1200], [-7, 7]), { stiffness: 180, damping: 22 });

  const handleMove = (e: React.MouseEvent) => {
    px.set(e.clientX);
    py.set(e.clientY);
  };

  return (
    <section id="services" className="relative bg-white py-28 md:py-40 px-6 md:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 md:mb-20">
          <div>
            <Eyebrow num="02" label="Servicios" />
            <h2 className="text-carbon font-semibold tracking-tight leading-[1.0] text-4xl md:text-6xl lg:text-[4.4rem]">
              <Reveal>
                Capacidades que
                <br />
                <em className="font-display font-light italic text-teal">cubren todo</em> el ciclo.
              </Reveal>
            </h2>
          </div>
          <Reveal delay={0.15} className="lg:max-w-xs lg:pb-3">
            <p className="text-carbon/60 text-sm leading-relaxed">
              Soluciones ambientales integrales que garantizan el cumplimiento normativo y la
              viabilidad de tu proyecto — antes, durante y después de la obra.
            </p>
          </Reveal>
        </div>

        {/* List */}
        <div ref={listRef} onMouseMove={handleMove} className="relative border-t border-carbon/10">
          {services.map((s, i) => {
            const isActive = active === i;
            const isOpen = open === i;
            return (
              <Reveal key={s.num} delay={i * 0.05} y={28}>
                <div
                  className="border-b border-carbon/10"
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group w-full text-left py-7 md:py-9 grid grid-cols-[auto_1fr_auto] md:grid-cols-[80px_1fr_auto_auto] items-center gap-4 md:gap-8"
                    data-cursor="hover"
                  >
                    <span className={`font-mono text-xs tracking-[0.2em] transition-colors duration-300 ${isActive ? 'text-teal' : 'text-carbon/35'}`}>
                      /{s.num}
                    </span>
                    <span className="min-w-0">
                      <motion.span
                        className="block font-display font-medium text-xl md:text-3xl lg:text-[2.1rem] tracking-tight text-carbon md:truncate"
                        animate={{ x: isActive ? 14 : 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      >
                        {s.title}
                      </motion.span>
                      <span className="block font-mono text-[9px] tracking-[0.3em] text-carbon/40 mt-1.5 md:hidden">
                        {s.short}
                      </span>
                    </span>
                    <span className="hidden md:block font-mono text-[9px] tracking-[0.3em] text-carbon/40">
                      {s.short}
                    </span>
                    <motion.span
                      className={`w-10 h-10 md:w-11 md:h-11 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-300 ${
                        isOpen ? 'bg-teal border-teal text-crema' : 'border-carbon/15 text-carbon/50 group-hover:border-teal group-hover:text-teal'
                      }`}
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                    >
                      <Plus size={16} strokeWidth={1.5} />
                    </motion.span>
                  </button>

                  {/* Expandable detail */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="pb-9 md:pl-[112px] grid grid-cols-1 md:grid-cols-2 gap-6">
                          <p className="text-carbon/65 text-sm leading-relaxed max-w-lg">{s.description}</p>
                          <div>
                            <div className="flex flex-wrap gap-2 mb-6">
                              {s.items.map((item) => (
                                <span key={item} className="inline-flex items-center gap-2 border border-carbon/10 rounded-full px-3.5 py-1.5 text-xs text-carbon/70 bg-crema/60">
                                  <span className="w-1 h-1 rounded-full bg-teal" />
                                  {item}
                                </span>
                              ))}
                            </div>
                            <button
                              onClick={() => scrollToId('contact')}
                              className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-teal hover:gap-3.5 transition-all duration-300"
                            >
                              SOLICITAR ESTE SERVICIO <ArrowRight size={13} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}

          {/* Floating preview panel (desktop only) */}
          <motion.div className="hidden lg:block pointer-events-none fixed top-0 left-0 z-[45]" style={{ x: sx, y: sy }}>
            <AnimatePresence>
              {active !== null && (() => {
                const s = services[active];
                const Icon = s.icon;
                return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.72, rotate: -4 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.72, rotate: 4 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  style={{ rotate, translateX: '28px', translateY: '-50%' }}
                  className="w-[290px] h-[360px] rounded-2xl overflow-hidden shadow-2xl shadow-night/25 ring-1 ring-black/5"
                >
                  {s.image ? (
                    <img
                      src={s.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="relative w-full h-full flex flex-col justify-between p-7"
                      style={{ background: `linear-gradient(150deg, ${s.from}, ${s.to})` }}
                    >
                      <div className="absolute inset-0 topo-pattern opacity-[0.12]" />
                      <div className="relative flex items-center justify-between">
                        <span className="font-mono text-[9px] tracking-[0.35em] text-crema/70">
                          {s.short}
                        </span>
                        <Icon size={22} strokeWidth={1.3} className="text-crema/80" />
                      </div>
                      <div className="relative">
                        <p className="font-display italic font-light text-8xl text-crema/25 leading-none mb-3">
                          {s.num}
                        </p>
                        <p className="font-display text-crema text-xl leading-snug tracking-tight">
                          {s.title}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
                );
              })()}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Sectors grid ─────────────────────────────────────────
const sectors = [
  { icon: Building2, label: 'Construcción e infraestructura' },
  { icon: Zap, label: 'Energía y telecomunicaciones' },
  { icon: Home, label: 'Desarrollo inmobiliario' },
  { icon: Sprout, label: 'Agroindustria' },
  { icon: Mountain, label: 'Turismo y hotelería' },
  { icon: Landmark, label: 'Municipalidades y obra pública' },
];

export function Sectors() {
  return (
    <section className="relative bg-crema py-24 md:py-32 px-6 md:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <Reveal>
            <span className="font-mono text-[11px] tracking-[0.25em] text-carbon/60 uppercase">
              Sectores que atendemos
            </span>
          </Reveal>
          <motion.span
            className="flex-1 h-px bg-carbon/10"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            style={{ transformOrigin: 'left' }}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {sectors.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} y={24} className="h-full">
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="h-full"
                data-cursor="hover"
              >
                <SpotlightCard className="h-full">
                  <div className="relative bg-white rounded-[15px] p-6 h-full flex flex-col items-start gap-8 overflow-hidden">
                    {/* inner cursor wash */}
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: 'radial-gradient(240px circle at var(--sx, 50%) var(--sy, 50%), rgba(60,110,128,0.08), transparent 65%)' }}
                      aria-hidden
                    />
                    <span className="relative w-11 h-11 rounded-xl bg-teal/8 flex items-center justify-center text-teal group-hover:bg-teal group-hover:text-crema transition-colors duration-300">
                      <s.icon size={20} strokeWidth={1.4} />
                    </span>
                    <p className="relative text-[13px] leading-snug text-carbon/75 group-hover:text-carbon transition-colors">
                      {s.label}
                    </p>
                  </div>
                </SpotlightCard>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

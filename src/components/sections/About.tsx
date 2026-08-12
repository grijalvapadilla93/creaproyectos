'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Leaf, HardHat, ArrowUpRight, Landmark, Trees, ShieldCheck, Map } from 'lucide-react';
import { Reveal, Eyebrow, Counter, EASE, TiltCard } from '@/components/ui/primitives';

// ─── Two expertise cards ──────────────────────────────────
const areas = [
  {
    num: '01',
    icon: Leaf,
    title: 'Misión',
    accent: 'text-teal',
    chipBg: 'bg-teal/10',
    desc: 'Impulsar el desarrollo sostenible de Guatemala acompañando cada proyecto con rigor técnico, cumplimiento normativo y un compromiso genuino con el entorno ambiental y social.',
    items: [
      'Acompañamiento integral de principio a fin',
      'Cumplimiento normativo garantizado',
      'Soluciones técnicas de alto estándar',
      'Relaciones de largo plazo con nuestros clientes',
    ],
    gradient: 'from-teal/12 via-transparent to-transparent',
  },
  {
    num: '02',
    icon: HardHat,
    title: 'Visión',
    accent: 'text-verde-deep',
    chipBg: 'bg-verde/10',
    desc: 'Ser la firma de referencia en consultoría y ejecución de proyectos en Guatemala, reconocida por su excelencia técnica, su integridad y su contribución a un país que crece de forma sostenible.',
    items: [
      'Referente nacional en gestión de proyectos',
      'Excelencia e innovación continua',
      'Crecimiento con impacto positivo',
      'Un aliado estratégico para cada cliente',
    ],
    gradient: 'from-verde/12 via-transparent to-transparent',
  },
];

export function About() {
  return (
    <section id="about" className="relative bg-crema py-28 md:py-40 px-6 md:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <Eyebrow num="01" label="Nosotros" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
          <div className="lg:col-span-8">
            <h2 className="text-carbon font-semibold tracking-tight leading-[1.02] text-4xl md:text-6xl lg:text-[4.4rem]">
              <Reveal>
                Un solo aliado,
                <br />
                <em className="font-display font-light italic text-teal">de la licencia</em>{' '}
                <span className="text-carbon/40 font-display font-light italic">a la obra.</span>
              </Reveal>
            </h2>
          </div>
          <div className="lg:col-span-4 flex flex-col justify-end">
          </div>
        </div>

        {/* Expertise cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {areas.map((area, i) => (
            <Reveal key={area.num} delay={i * 0.12}>
              <TiltCard className="group">
              <motion.article
                className="group relative bg-white rounded-3xl p-8 md:p-12 h-full border border-carbon/5 overflow-hidden"
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4, ease: EASE }}
                data-cursor="hover"
              >
                {/* hover wash */}
                <div className={`absolute inset-0 bg-gradient-to-br ${area.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                {/* ghost number */}
                <span className="absolute -top-7 right-4 font-display text-[9rem] leading-none font-light text-carbon/[0.04] select-none group-hover:text-carbon/[0.07] transition-colors duration-500">
                  {area.num}
                </span>

                <div className="relative">
                  <div className="flex items-center justify-between mb-10">
                    <span className={`w-14 h-14 rounded-2xl ${area.chipBg} flex items-center justify-center`}>
                      <area.icon size={26} strokeWidth={1.4} className={area.accent} />
                    </span>
                    <motion.span
                      className="w-10 h-10 rounded-full border border-carbon/10 flex items-center justify-center text-carbon/40 group-hover:bg-teal group-hover:border-teal group-hover:text-crema transition-all duration-300"
                      whileHover={{ rotate: 45 }}
                    >
                      <ArrowUpRight size={16} strokeWidth={1.5} />
                    </motion.span>
                  </div>

                  <h3 className="text-carbon font-display font-medium text-2xl md:text-[1.9rem] tracking-tight mb-4">
                    {area.title}
                  </h3>
                  <p className="text-carbon/60 text-sm leading-relaxed mb-8 max-w-md">{area.desc}</p>

                  <ul className="space-y-3.5">
                    {area.items.map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm text-carbon/70">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${i === 0 ? 'bg-teal' : 'bg-verde'}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Dark stats band ──────────────────────────────────────
const stats = [
  { value: '60+', label: 'Proyectos gestionados', icon: Landmark, note: 'en todo el territorio nacional' },
  { value: '10+', label: 'Años de experiencia', icon: Trees, note: 'del expediente a la entrega' },
  { value: '100%', label: 'Cumplimiento normativo', icon: ShieldCheck, note: 'sin sanciones ni retrasos' },
  { value: '4', label: 'Entidades clave dominadas', icon: Map, note: 'MARN · INAB · CONAP · CONRED' },
];

/** Single stat: cursor glow, gradient number, animated hairline. */
function StatCell({ s, i }: { s: (typeof stats)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--sx', `${e.clientX - rect.left}px`);
    ref.current.style.setProperty('--sy', `${e.clientY - rect.top}px`);
  };
  const Icon = s.icon;
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      className="group relative text-center lg:text-left lg:pl-8 px-2 py-8 lg:py-2"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
    >
      {/* cursor-following glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'radial-gradient(280px circle at var(--sx, 50%) var(--sy, 50%), rgba(60,110,128,0.16), rgba(201,184,150,0.05) 45%, transparent 72%)' }}
        aria-hidden
      />
      {i > 0 && (
        <span className="hidden lg:block absolute left-0 top-1 bottom-1 w-px bg-crema/10" />
      )}
      <div className="relative transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
        <span className="inline-flex lg:flex w-12 h-12 rounded-full border border-crema/10 bg-crema/[0.03] items-center justify-center mb-5 group-hover:border-arena/40 group-hover:bg-teal/15 transition-colors duration-500">
          <Icon size={20} strokeWidth={1.3} className="text-arena transition-transform duration-500 group-hover:scale-110" />
        </span>
        <p className="font-display font-medium text-5xl md:text-6xl lg:text-7xl tracking-tight mb-3.5 bg-gradient-to-b from-crema via-crema to-arena/60 bg-clip-text text-transparent">
          <Counter value={s.value} duration={1.8} />
        </p>
        <motion.span
          className="block h-px w-14 mx-auto lg:mx-0 mb-4"
          style={{ background: 'linear-gradient(90deg, #3C6E80, #5C7A5E, #C9B896)' }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.35 + i * 0.1, ease: EASE }}
        />
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-crema/55 mb-2">{s.label}</p>
        <p className="font-display italic text-xs text-crema/35">{s.note}</p>
      </div>
    </motion.div>
  );
}

export function StatsBand() {
  return (
    <section className="relative bg-night py-20 md:py-28 overflow-hidden" aria-label="Cifras de la empresa">
      <div className="absolute inset-0 topo-pattern opacity-[0.05]" />
      <div className="absolute inset-0 noise-overlay opacity-[0.03] mix-blend-soft-light pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        {/* eyebrow row */}
        <Reveal>
          <div className="flex items-center gap-6 mb-14">
            <p className="font-mono text-[10px] tracking-[0.35em] text-arena/80 whitespace-nowrap">
              CREA PROYECTOS EN CIFRAS
            </p>
            <span className="flex-1 h-px bg-crema/10" />
            <p className="hidden sm:block font-mono text-[10px] tracking-[0.35em] text-crema/35 whitespace-nowrap">
              UNA DÉCADA DE EXPERIENCIA
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8">
          {stats.map((s, i) => (
            <StatCell key={s.label} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

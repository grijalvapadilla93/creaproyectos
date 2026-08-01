'use client';

import { useRef, useState } from 'react';
import {
  motion, useScroll, useSpring, useTransform, useMotionValueEvent,
} from 'framer-motion';
import { Search, Route, FolderKanban, BadgeCheck, Users, Gauge, MapPinned, Scale } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Reveal, Eyebrow, EASE } from '@/components/ui/primitives';

type StepDef = {
  num: string;
  icon: LucideIcon;
  title: string;
  desc: string;
};

const steps: StepDef[] = [
  {
    num: '01', icon: Search, title: 'Diagnóstico',
    desc: 'Evaluamos tu proyecto y determinamos los requisitos ambientales, forestales y municipales aplicables.',
  },
  {
    num: '02', icon: Route, title: 'Estrategia',
    desc: 'Diseñamos una hoja de ruta personalizada con cronograma realista para la obtención de licencias y permisos.',
  },
  {
    num: '03', icon: FolderKanban, title: 'Gestión',
    desc: 'Coordinamos y damos seguimiento a todos los trámites ante las entidades correspondientes, con reportes puntuales.',
  },
  {
    num: '04', icon: BadgeCheck, title: 'Entrega y cierre',
    desc: 'Entregamos las licencias y permisos, asegurando el cumplimiento continuo de tu proyecto en el tiempo.',
  },
];

// ─── Single step: lights up when the progress line passes it ─
function Step({
  step, index, isLast, progress,
}: {
  step: StepDef; index: number; isLast: boolean; progress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const [on, setOn] = useState(false);
  const threshold = (index + 0.45) / steps.length;
  const passed = useTransform(progress, (p: number) => p >= threshold);
  useMotionValueEvent(passed, 'change', (v) => { if (v) setOn(true); });

  const Icon = step.icon;

  return (
    <div className="relative flex lg:block gap-6 lg:gap-0">
      {/* Vertical connector to the next circle (mobile / tablet) */}
      {!isLast && (
        <span
          className="lg:hidden absolute left-[25.5px] top-[26px] w-px bg-crema/10 overflow-hidden"
          style={{ height: 'calc(100% + 3.5rem)' }}
          aria-hidden
        >
          <motion.span
            className="absolute inset-0 origin-top bg-gradient-to-b from-teal via-verde to-arena"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: on ? 1 : 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.2 }}
          />
        </span>
      )}

      {/* Node circle */}
      <div className="relative z-10 shrink-0">
        {/* activation ping */}
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-arena/70"
          initial={{ scale: 1, opacity: 0 }}
          animate={on ? { scale: [1, 2.1], opacity: [0.5, 0] } : {}}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          aria-hidden
        />
        <motion.span
          className="relative w-[52px] h-[52px] rounded-full border flex items-center justify-center"
          animate={{
            scale: on ? [1, 1.16, 1] : 1,
            backgroundColor: on ? '#3C6E80' : '#0F1B1E',
            borderColor: on ? 'rgba(201,184,150,0.55)' : 'rgba(247,246,242,0.2)',
          }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <Icon
            size={20}
            strokeWidth={1.3}
            className={`transition-colors duration-500 ${on ? 'text-crema' : 'text-arena/80'}`}
          />
        </motion.span>
      </div>

      {/* Copy — sits below the circle on desktop, beside it on mobile */}
      <div className="lg:mt-7 min-w-0">
        <span className={`block font-mono text-[10px] tracking-[0.3em] mb-2.5 transition-colors duration-500 ${on ? 'text-arena' : 'text-crema/35'}`}>
          PASO {step.num}
        </span>
        <h3 className={`font-display font-medium text-2xl tracking-tight mb-3 transition-colors duration-500 ${on ? 'text-crema' : 'text-crema/50'}`}>
          {step.title}
        </h3>
        <p className={`text-sm leading-relaxed transition-colors duration-500 ${on ? 'text-crema/60' : 'text-crema/35'}`}>
          {step.desc}
        </p>
      </div>
    </div>
  );
}

export function Process() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start 0.82', 'end 0.55'] });
  const lineScale = useSpring(scrollYProgress, { stiffness: 80, damping: 26 });

  return (
    <section id="process" className="relative bg-night py-28 md:py-40 px-6 md:px-12 lg:px-16 overflow-hidden">
      <div className="absolute inset-0 topo-pattern opacity-[0.045]" />
      <div className="absolute inset-0 noise-overlay opacity-[0.03] mix-blend-soft-light pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-verde/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20">
          <div>
            <Eyebrow num="03" label="Proceso" dark />
            <h2 className="text-crema font-semibold tracking-tight leading-[1.0] text-4xl md:text-6xl lg:text-[4.4rem]">
              <Reveal>
                Método claro,
                <br />
                <em className="font-display font-light italic text-arena">resultados medibles.</em>
              </Reveal>
            </h2>
          </div>
          <Reveal delay={0.15} className="lg:max-w-xs lg:pb-3">
            <p className="text-crema/55 text-sm leading-relaxed">
              Un proceso probado que convierte la complejidad normativa en pasos concretos —
              con plazos realistas desde la primera reunión.
            </p>
          </Reveal>
        </div>

        {/* Timeline — horizontal on desktop, vertical on mobile/tablet */}
        <div ref={trackRef} className="relative">
          {/* Horizontal track line (lg+): from first circle center to last circle center */}
          <div
            className="hidden lg:block absolute top-[26px] left-[26px] h-px bg-crema/10 z-0"
            style={{ right: 'calc((100% - 6rem) / 4 - 26px)' }}
            aria-hidden
          >
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-teal via-verde to-arena"
              style={{ scaleX: lineScale }}
            />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-14 lg:gap-8">
            {steps.map((step, i) => (
              <Step
                key={step.num}
                step={step}
                index={i}
                isLast={i === steps.length - 1}
                progress={scrollYProgress}
              />
            ))}
          </div>
        </div>

        {/* Why CREA */}
        <div className="mt-24 md:mt-32 border-t border-crema/10 pt-16">
          <Reveal>
            <p className="font-mono text-[10px] tracking-[0.35em] text-arena/80 mb-12">
              POR QUÉ CREA PROYECTOS
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
            {whyUs.map((w, i) => (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
              >
                <w.icon size={22} strokeWidth={1.3} className="text-teal mb-5" />
                <h4 className="text-crema font-medium text-[15px] mb-2.5">{w.title}</h4>
                <p className="text-crema/50 text-[13px] leading-relaxed">{w.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const whyUs = [
  { icon: Scale, title: 'Dominio normativo', desc: 'Conocimiento profundo de la regulación ambiental guatemalteca y sus criterios institucionales.' },
  { icon: Users, title: 'Un solo interlocutor', desc: 'Licencias y obra bajo un mismo equipo: menos coordinación, menos riesgos, más velocidad.' },
  { icon: Gauge, title: 'Respuesta ágil', desc: 'Seguimiento diario de expedientes y comunicación directa con tu equipo de proyecto.' },
  { icon: MapPinned, title: 'Cobertura nacional', desc: 'Operamos en todo el territorio: Petén, Izabal, Alta Verapaz, Escuintla y más.' },
];

// ─── Institutions strip ───────────────────────────────────
const institutions = [
  { name: 'MARN', full: 'Ministerio de Ambiente y Recursos Naturales', img: '/logos/marn.png' },
  { name: 'CONAP', full: 'Consejo Nacional de Áreas Protegidas', img: '/logos/conap.png' },
  { name: 'INAB', full: 'Instituto Nacional de Bosques', img: '/logos/inab.png' },
  { name: 'CONRED', full: 'Coordinadora Nacional para la Reducción de Desastres', img: '/logos/conred.png' },
];

export function Institutions() {
  return (
    <section className="relative bg-white py-24 md:py-32 px-6 md:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-14">
            <p className="font-mono text-[10px] tracking-[0.35em] text-carbon/45 mb-3">
              ENTIDADES CON LAS QUE TRABAJAMOS
            </p>
            <div className="w-12 h-px bg-teal/40 mx-auto" />
          </div>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {institutions.map((inst, i) => (
            <Reveal key={inst.name} delay={i * 0.08} y={24}>
              <motion.figure
                className="group flex flex-col items-center text-center gap-4 bg-crema/60 border border-carbon/5 rounded-2xl p-7 hover:bg-white hover:shadow-xl hover:shadow-teal/5 hover:border-teal/20 transition-all duration-500"
                whileHover={{ y: -6 }}
                data-cursor="hover"
              >
                <div className="relative w-20 h-20 rounded-xl bg-white border border-carbon/5 p-3 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500">
                  <img src={inst.img} alt={`Logo de ${inst.name}`} className="w-full h-full object-contain" loading="lazy" />
                  {/* shine sweep on hover */}
                  <span
                    className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-teal/10 to-transparent"
                    aria-hidden
                  />
                </div>
                <figcaption>
                  <p className="font-mono text-xs tracking-[0.25em] text-carbon mb-1.5">{inst.name}</p>
                  <p className="text-[11px] leading-snug text-carbon/45 max-w-[170px] mx-auto">{inst.full}</p>
                </figcaption>
              </motion.figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

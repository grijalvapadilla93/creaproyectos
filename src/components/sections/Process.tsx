'use client';

import { useRef, useState } from 'react';
import {
  motion, useScroll, useSpring, useTransform, useMotionValueEvent,
} from 'framer-motion';
import { Search, Route, FolderKanban, BadgeCheck } from 'lucide-react';
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
      </div>
    </section>
  );
}

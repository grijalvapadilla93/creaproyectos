'use client';

import { useRef } from 'react';
import {
  motion, useScroll, useTransform, useMotionValue, useSpring,
} from 'framer-motion';
import { ArrowDown, ArrowRight, Leaf, HardHat } from 'lucide-react';
import { scrollToId } from '@/lib/scroll';
import { Magnetic, EASE } from '@/components/ui/primitives';

/**
 * Full-bleed dark hero over the aerial project photograph.
 * Choreography starts after the preloader lifts (ready flag).
 */
export default function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  // Parallax: image drifts down + content fades as you scroll away
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  // Mouse-depth parallax: background and content drift in opposite
  // directions as the cursor moves (desktop only — inert on touch).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 46, damping: 18, mass: 0.7 });
  const smy = useSpring(my, { stiffness: 46, damping: 18, mass: 0.7 });
  const bgX = useTransform(smx, [-0.5, 0.5], [18, -18]);
  const bgYM = useTransform(smy, [-0.5, 0.5], [12, -12]);
  const contentX = useTransform(smx, [-0.5, 0.5], [-10, 10]);

  const handleMouse = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const d = (base: number) => (ready ? base : base + 60); // delays assume preloader done

  return (
    <section
      id="hero"
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      className="relative min-h-screen overflow-hidden bg-night flex flex-col"
    >
      {/* ── Background photograph ── */}
      <motion.div className="absolute -inset-[3%]" style={{ y: imgY, x: bgX }}>
        <motion.div className="absolute inset-0" style={{ y: bgYM }}>
        <motion.img
          src="/BgLandingPageCrea.png"
          alt="Proyecto de construcción rodeado de bosque nuboso en Guatemala, vista aérea"
          className="w-full h-full object-cover will-change-transform"
          initial={{ scale: 1.18 }}
          animate={ready ? { scale: 1.02 } : {}}
          transition={{ duration: 7, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Cinematic grading overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-night/95 via-night/60 to-night/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-night/40" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 60%, rgba(60,110,128,0.18), transparent 60%)' }} />
        </motion.div>
      </motion.div>

      {/* ── Content ── */}
      <motion.div
        style={{ y: contentY, x: contentX, opacity: contentOpacity }}
        className="relative flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16 pt-32 pb-24 max-w-7xl mx-auto w-full"
      >
        {/* Eyebrow */}
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: 24 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: d(0.15), ease: EASE }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-arena opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-arena" />
          </span>
          <span className="font-mono text-[10px] md:text-[11px] tracking-[0.35em] text-crema/70">
            CONSULTORÍA AMBIENTAL · EJECUCIÓN DE OBRA · GUATEMALA
          </span>
        </motion.div>

        {/* Headline — sans + serif italic mix */}
        <h1 className="text-crema font-semibold tracking-tight leading-[0.95] text-[13vw] sm:text-6xl md:text-7xl lg:text-[5.6rem] xl:text-[6.4rem] mb-8">
          <span className="block overflow-hidden">
            <motion.span
              className="block will-change-transform"
              initial={{ y: '110%' }}
              animate={ready ? { y: 0 } : {}}
              transition={{ duration: 1, delay: d(0.3), ease: EASE }}
            >
              Gestión ambiental
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className="block will-change-transform"
              initial={{ y: '110%' }}
              animate={ready ? { y: 0 } : {}}
              transition={{ duration: 1, delay: d(0.42), ease: EASE }}
            >
              que{' '}
              <em className="font-display font-light italic bg-gradient-to-r from-arena via-teal to-verde bg-clip-text text-transparent">
                hace avanzar
              </em>
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className="block will-change-transform"
              initial={{ y: '110%' }}
              animate={ready ? { y: 0 } : {}}
              transition={{ duration: 1, delay: d(0.54), ease: EASE }}
            >
              tu proyecto.
            </motion.span>
          </span>
        </h1>

        {/* Subcopy */}
        <motion.p
          className="text-crema/70 text-base md:text-lg leading-relaxed max-w-xl mb-4"
          initial={{ opacity: 0, y: 24 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: d(0.75), ease: EASE }}
        >
          Licencias ambientales, forestales y municipales ante{' '}
          <span className="text-arena">MARN, INAB, CONAP y CONRED</span>, más planificación y
          ejecución de obra civil. Un solo aliado, de principio a fin.
        </motion.p>
        <motion.p
          className="font-display italic text-crema/50 text-lg md:text-xl mb-10"
          initial={{ opacity: 0, y: 24 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: d(0.88), ease: EASE }}
        >
          Gestionamos licencias y ejecutamos obras.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 24 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: d(1.0), ease: EASE }}
        >
          <Magnetic strength={35}>
            <button
              onClick={() => scrollToId('services')}
              className="group relative inline-flex items-center gap-3 bg-crema text-night font-mono text-[11px] tracking-[0.2em] px-8 py-4 rounded-full overflow-hidden"
            >
              <span className="absolute inset-0 bg-teal translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out" />
              <span className="relative z-10 group-hover:text-crema transition-colors duration-300">VER SERVICIOS</span>
              <ArrowRight size={14} className="relative z-10 group-hover:text-crema group-hover:translate-x-1 transition-all duration-300" />
            </button>
          </Magnetic>
          <Magnetic strength={28}>
            <button
              onClick={() => scrollToId('contact')}
              className="inline-flex items-center gap-3 border border-crema/30 text-crema font-mono text-[11px] tracking-[0.2em] px-8 py-4 rounded-full hover:bg-crema/10 hover:border-crema/60 transition-all duration-300"
            >
              AGENDAR CONSULTA
            </button>
          </Magnetic>
        </motion.div>

        {/* Dual-expertise chips */}
        <motion.div
          className="flex flex-wrap gap-3 mt-12"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: d(1.2) }}
        >
          {[
            { icon: Leaf, label: 'Consultoría ambiental' },
            { icon: HardHat, label: 'Ejecución de obras' },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 border border-crema/15 bg-crema/5 backdrop-blur-sm rounded-full px-4 py-2 text-xs text-crema/70"
            >
              <Icon size={13} strokeWidth={1.5} className="text-arena" />
              {label}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Bottom bar: scroll cue + trust line ── */}
      <motion.div
        className="relative flex items-end justify-between px-6 md:px-12 lg:px-16 pb-8 max-w-7xl mx-auto w-full"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: d(1.5) }}
      >
        <button
          onClick={() => scrollToId('about')}
          aria-label="Bajar a la siguiente sección"
          className="group flex flex-col items-center gap-3"
        >
          <span className="font-mono text-[9px] tracking-[0.35em] text-crema/50 group-hover:text-arena transition-colors [writing-mode:vertical-lr]">
            DESCUBRE
          </span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-arena"
          >
            <ArrowDown size={15} strokeWidth={1.5} />
          </motion.span>
        </button>
        <p className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-crema/40 text-right leading-relaxed">
          MARN · INAB · CONAP · CONRED
          <span className="hidden md:block text-crema/25 mt-1">MÁS DE UNA DÉCADA DE EXPERIENCIA</span>
        </p>
      </motion.div>
    </section>
  );
}

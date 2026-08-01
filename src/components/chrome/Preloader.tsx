'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { EASE } from '@/components/ui/primitives';

/**
 * Brand intro: counter 0→100 with wordmark, then a curtain wipe upward.
 * Calls onDone when the reveal finishes so the hero choreography can start.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const duration = 1500;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setExiting(true), 250);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const letters = 'CREA'.split('');

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-night overflow-hidden"
      animate={exiting ? { y: '-100%' } : { y: 0 }}
      transition={{ duration: 0.9, ease: EASE }}
      onAnimationComplete={() => exiting && onDone()}
      aria-hidden
    >
      {/* subtle topo texture */}
      <div className="absolute inset-0 topo-pattern opacity-[0.05]" />

      {/* Wordmark */}
      <div className="relative flex items-baseline gap-1">
        {letters.map((l, i) => (
          <motion.span
            key={i}
            className="font-display text-6xl md:text-8xl font-semibold text-crema tracking-tight"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 + i * 0.08, ease: EASE }}
          >
            {l}
          </motion.span>
        ))}
        <motion.span
          className="font-display text-6xl md:text-8xl font-light italic text-arena tracking-tight"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
        >
          +
        </motion.span>
      </div>
      <motion.p
        className="relative font-mono text-[10px] tracking-[0.5em] text-crema/50 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        PROYECTOS, S.A.
      </motion.p>

      {/* Counter + progress line */}
      <div className="absolute bottom-12 md:bottom-16 left-6 right-6 md:left-16 md:right-16 flex items-end justify-between">
        <motion.div
          className="h-px bg-crema/20 flex-1 mr-8 mb-2 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div
            className="h-full bg-gradient-to-r from-teal via-verde to-arena transition-[width] duration-100"
            style={{ width: `${progress}%` }}
          />
        </motion.div>
        <span className="font-mono text-sm text-crema/60 tabular-nums">{progress}%</span>
      </div>
    </motion.div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion, useInView, useMotionValue, useSpring, useReducedMotion,
} from 'framer-motion';

export const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Scroll reveal ────────────────────────────────────────
export function Reveal({
  children, delay = 0, y = 44, className = '', once = true,
}: {
  children: React.ReactNode; delay?: number; y?: number; className?: string; once?: boolean;
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const isInView = useInView(ref, { once, margin: '-70px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// ─── Word-by-word staggered reveal ────────────────────────
export function StaggerWords({
  text, className = '', delay = 0, as: Tag = 'span',
}: {
  text: string; className?: string; delay?: number; as?: 'span' | 'p' | 'h1' | 'h2' | 'h3';
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <Tag ref={ref as never} className={`inline-flex flex-wrap ${className}`}>
      {text.split(' ').map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.24em]">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: '110%', opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: delay + i * 0.055, ease: EASE }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

// ─── Character-by-character reveal ────────────────────────
export function SplitChars({
  text, className = '', delay = 0,
}: {
  text: string; className?: string; delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`} aria-label={text} role="text">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block will-change-transform"
          initial={{ y: '108%', rotateX: -50, opacity: 0 }}
          animate={isInView ? { y: 0, rotateX: 0, opacity: 1 } : {}}
          transition={{ duration: 0.55, delay: delay + i * 0.022, ease: EASE }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

// ─── Animated counter ─────────────────────────────────────
export function Counter({
  value, duration = 1.6,
}: {
  value: string; duration?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const match = value.match(/^(\d+)(.*)$/);
  const num = match ? parseInt(match[1], 10) : NaN;
  const suffix = match ? match[2] : '';
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView || isNaN(num)) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 4); // easeOutQuart
      setDisplay(Math.round(eased * num));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, num, duration]);

  if (isNaN(num)) return <span ref={ref}>{value}</span>;
  return <span ref={ref} className="tabular-nums">{display}{suffix}</span>;
}

// ─── Magnetic hover wrapper ───────────────────────────────
export function Magnetic({
  children, strength = 25, className = '',
}: {
  children: React.ReactNode; strength?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 160, damping: 16, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 160, damping: 16, mass: 0.4 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) / strength);
    y.set((e.clientY - rect.top - rect.height / 2) / strength);
  };

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
}

// ─── Section eyebrow label ────────────────────────────────
export function Eyebrow({
  num, label, dark = false, center = false,
}: {
  num?: string; label: string; dark?: boolean; center?: boolean;
}) {
  return (
    <Reveal>
      <div className={`flex items-center gap-4 mb-6 ${center ? 'justify-center' : ''}`}>
        {num && (
          <span className={`font-mono text-[11px] tracking-[0.25em] ${dark ? 'text-arena' : 'text-teal'}`}>
            {num}
          </span>
        )}
        <motion.span
          className={`h-px ${dark ? 'bg-crema/25' : 'bg-teal/30'}`}
          initial={{ width: 0 }}
          whileInView={{ width: 44 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
        />
        <span className={`font-mono text-[11px] tracking-[0.25em] uppercase ${dark ? 'text-crema/70' : 'text-carbon/60'}`}>
          {label}
        </span>
      </div>
    </Reveal>
  );
}

// ─── Infinite marquee ─────────────────────────────────────
export function Marquee({
  children, duration = 32, className = '', reverse = false,
}: {
  children: React.ReactNode; duration?: number; className?: string; reverse?: boolean;
}) {
  return (
    <div className={`overflow-hidden marquee-paused ${className}`}>
      <div
        className="animate-marquee flex w-max items-center will-change-transform"
        style={{
          ['--marquee-duration' as string]: `${duration}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}

// ─── Gradient brand line ──────────────────────────────────
export function BrandLine({ className = 'h-[3px] w-20' }: { className?: string }) {
  return (
    <div
      className={className}
      style={{ background: 'linear-gradient(90deg, #3C6E80, #5C7A5E, #C9B896)' }}
    />
  );
}

// ─── Spotlight card (cursor-following glow + border light) ─
export function SpotlightCard({
  children, className = '', radius = 240,
}: {
  children: React.ReactNode; className?: string; radius?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--sx', `${e.clientX - rect.left}px`);
    ref.current.style.setProperty('--sy', `${e.clientY - rect.top}px`);
  };
  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={`group relative rounded-2xl p-px overflow-hidden bg-carbon/5 ${className}`}
    >
      {/* glowing border */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(${radius}px circle at var(--sx, 50%) var(--sy, 50%), rgba(60,110,128,0.65), rgba(92,122,94,0.25) 45%, transparent 70%)` }}
        aria-hidden
      />
      {children}
    </div>
  );
}

// ─── 3D tilt card with moving glare ───────────────────────
export function TiltCard({
  children, max = 6, className = '',
}: {
  children: React.ReactNode; max?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 140, damping: 18, mass: 0.4 });
  const sry = useSpring(ry, { stiffness: 140, damping: 18, mass: 0.4 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    ry.set((px - 0.5) * max);
    rx.set((0.5 - py) * max);
    ref.current.style.setProperty('--gx', `${px * 100}%`);
    ref.current.style.setProperty('--gy', `${py * 100}%`);
  };
  const reset = () => { rx.set(0); ry.set(0); };

  return (
    <div style={{ perspective: 1200 }} className={`h-full ${className}`}>
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}
        className="relative h-full will-change-transform"
      >
        {children}
        {/* moving glare */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'radial-gradient(420px circle at var(--gx, 50%) var(--gy, 50%), rgba(60,110,128,0.09), rgba(255,255,255,0.35) 30%, transparent 65%)' }}
          aria-hidden
        />
      </motion.div>
    </div>
  );
}

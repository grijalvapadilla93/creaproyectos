'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  motion, useScroll, useTransform, useInView,
  AnimatePresence, useMotionValue, useSpring,
} from 'framer-motion';
import Lenis from '@studio-freight/lenis';

// ─── Color tokens ─────────────────────────────────────────
const TEAL = '#3C6E80';
const TEAL_DARK = '#2E5866';
const CREMA = '#F7F6F2';
const CARBON = '#141414';
const VERDE = '#5C7A5E';
const ARENA = '#C9B896';


// ─── Mouse position hook ──────────────────────────────────
function useMousePosition() {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      x.set(e.clientX / window.innerWidth);
      y.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, [x, y]);
  return { x, y };
}

// ─── Staggered text ───────────────────────────────────────
const StaggerText = ({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {text.split(' ').map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: '100%', opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: delay + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

// ─── Section reveal ───────────────────────────────────────
const SectionReveal = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── Counter ──────────────────────────────────────────────
const Counter = ({ value }: { value: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const match = value.match(/^(\d+)(.*)$/);
  const num = match ? parseInt(match[1]) : NaN;
  const suffix = match ? match[2] : '';
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!isInView || isNaN(num)) return;
    let start = 0;
    const step = Math.ceil(num / (1500 / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setDisplay(num); clearInterval(timer); }
      else setDisplay(start);
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, num]);
  if (isNaN(num)) return <span ref={ref}>{value}</span>;
  return <span ref={ref} className="tabular-nums">{display}{suffix}</span>;
};

// ─── Particles ────────────────────────────────────────────
const Particles = ({ count = 20, color = TEAL }: { count?: number; color?: string }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {Array.from({ length: count }, (_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: Math.random() * 3 + 1,
          height: Math.random() * 3 + 1,
          backgroundColor: color,
          opacity: 0.12,
        }}
        animate={{ y: [0, -30, 0], opacity: [0.06, 0.18, 0.06] }}
        transition={{ duration: Math.random() * 8 + 6, delay: Math.random() * 5, repeat: Infinity, ease: 'easeInOut' }}
      />
    ))}
  </div>
);

// ─── Magnetic wrapper ─────────────────────────────────────
const Magnetic = ({ children, strength = 25 }: { children: React.ReactNode; strength?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });
  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) / strength);
    y.set((e.clientY - rect.top - rect.height / 2) / strength);
  };
  return (
    <motion.div ref={ref} onMouseMove={handleMouse} onMouseLeave={() => { x.set(0); y.set(0); }} style={{ x: springX, y: springY }}>
      {children}
    </motion.div>
  );
};

// ─── Wave divider ─────────────────────────────────────────
const WaveDivider = ({ color = CREMA, flip = false }: { color?: string; flip?: boolean }) => (
  <div className="relative w-full h-[60px] md:h-[80px] overflow-hidden -mb-px">
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
    >
      <path
        d={flip
          ? 'M0,0 C360,80 1080,80 1440,0 L1440,80 L0,80 Z'
          : 'M0,80 C360,0 1080,0 1440,80 L1440,0 L0,0 Z'
        }
        fill={color}
      />
    </svg>
  </div>
);

// ─── Progress bar ─────────────────────────────────────────
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[60]"
      style={{
        scaleX: useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 }),
        background: `linear-gradient(90deg, ${TEAL}, ${VERDE}, ${ARENA})`,
      }}
    />
  );
};

// ─── Grain / noise overlay ────────────────────────────────
const GrainOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-[55] opacity-[0.015] mix-blend-soft-light" style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
  }} />
);

// ─── Split chars animation ────────────────────────────────
const SplitChars = ({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const chars = text.split('');
  return (
    <span ref={ref} className={`inline-flex flex-wrap overflow-hidden ${className}`}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: '105%', rotateX: -60, opacity: 0 }}
          animate={isInView ? { y: 0, rotateX: 0, opacity: 1 } : {}}
          transition={{ duration: 0.55, delay: delay + i * 0.025, ease: [0.22, 1, 0.36, 1] }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};

// ─── 3D Tilt wrapper ──────────────────────────────────────
const Tilt = ({ children, max = 6, className = '' }: { children: React.ReactNode; max?: number; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({});
  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setStyle({
      transform: `perspective(1000px) rotateX(${(y - 0.5) * max}deg) rotateY(${(x - 0.5) * -max}deg) scale3d(1.01,1.01,1.01)`,
    });
  };
  const handleLeave = () => setStyle({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)' });
  return (
    <motion.div ref={ref} onMouseMove={handleMouse} onMouseLeave={handleLeave}
      style={style} className={className}
      transition={{ type: 'spring', stiffness: 250, damping: 25 }}
    >
      {children}
    </motion.div>
  );
};

// ─── Subtle parallax ──────────────────────────────────────
const Parallax = ({ children, speed = 0.15, className = '' }: { children: React.ReactNode; speed?: number; className?: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [speed * 120, -speed * 120]);
  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
};

// ─── Section progress nav ─────────────────────────────────
const SectionNav = () => {
  const [active, setActive] = useState('hero');
  const sectionIds = ['hero', 'about', 'services', 'process', 'contact'];

  useEffect(() => {
    const obs: IntersectionObserver[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(id); },
        { threshold: 0.3 }
      );
      o.observe(el);
      obs.push(o);
    });
    return () => obs.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="fixed right-5 md:right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-3">
      <div className="w-px h-6 bg-[#141414]/10 mb-1" />
      {sectionIds.map((id) => {
        const labels: Record<string, string> = { hero: 'INICIO', about: 'NOSOTROS', services: 'SERVICIOS', process: 'PROCESO', contact: 'CONTACTO' };
        const isActive = active === id;
        return (
          <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative flex items-center justify-center w-5 h-5"
          >
            <motion.span className="block rounded-full"
              style={{ backgroundColor: isActive ? TEAL : 'rgba(20,20,20,0.18)' }}
              animate={{ width: isActive ? 10 : 5, height: isActive ? 10 : 5 }}
              transition={{ duration: 0.3 }}
            />
            {!isActive && (
              <motion.span className="absolute inset-0 rounded-full"
                style={{ backgroundColor: `${TEAL}15` }}
                animate={{ scale: [1, 1.6, 1], opacity: [0, 0.4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            <span className="absolute right-full mr-3 text-[9px] tracking-[0.2em] font-medium text-[#141414]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
              {labels[id]}
            </span>
          </button>
        );
      })}
      <div className="w-px h-6 bg-[#141414]/10 mt-1" />
    </div>
  );
};

// ─── Navigation ───────────────────────────────────────────
const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const links = [
    { label: 'INICIO', id: 'hero' },
    { label: 'NOSOTROS', id: 'about' },
    { label: 'SERVICIOS', id: 'services' },
    { label: 'PROCESO', id: 'process' },
    { label: 'CONTACTO', id: 'contact' },
  ];

  useEffect(() => {
    const handle = () => {
      setScrolled(window.scrollY > 80);
      const sections = links.map((l) => document.getElementById(l.id));
      const pos = window.scrollY + 200;
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] && sections[i]!.offsetTop <= pos) {
          setActiveSection(links[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handle);
    return () => window.removeEventListener('scroll', handle);
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  }, []);

  return (
    <>
      <ScrollProgress />
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 lg:px-16"
      >
        <motion.div
          className="absolute inset-0 rounded-none md:rounded-b-2xl"
          animate={{
            backdropFilter: scrolled ? 'blur(24px) saturate(1.4)' : 'blur(0px)',
            backgroundColor: scrolled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0)',
            borderBottom: scrolled ? '1px solid rgba(60,110,128,0.1)' : '1px solid rgba(255,255,255,0)',
            boxShadow: scrolled ? '0 8px 40px rgba(0,0,0,0.06)' : '0 8px 40px rgba(0,0,0,0)',
          }}
          transition={{ duration: 0.6 }}
        />
        <div className="relative flex items-center justify-between py-4">
          <Magnetic strength={30}>
            <button onClick={() => scrollTo('hero')}>
              <motion.img
                src="/crealogo.jpeg"
                alt="CREA PROYECTOS"
                className="h-10 md:h-12 w-auto"
                whileHover={{ scale: 1.05 }}
              />
            </button>
          </Magnetic>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <motion.button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="relative px-5 py-2 text-xs tracking-[0.15em] font-medium transition-colors"
                style={{ color: activeSection === link.id ? TEAL : 'rgba(20,20,20,0.8)' }}
                whileHover={{ color: TEAL, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
              >
                {link.label}
                <motion.span className="absolute bottom-0 left-4 right-4 h-[1.5px] origin-left rounded-full"
                  style={{ backgroundColor: TEAL }}
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
                {activeSection === link.id && (
                  <>
                    <motion.div
                      layoutId="navGlow"
                      className="absolute inset-0 rounded-full"
                      style={{ background: `radial-gradient(ellipse at center, ${TEAL}10 0%, transparent 70%)` }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                    <motion.div
                      layoutId="navDot"
                      className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ backgroundColor: TEAL }}
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  </>
                )}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <span className="hidden md:block text-[11px] tracking-[0.2em] font-medium" style={{ color: 'rgba(20,20,20,0.6)' }}>
              INFO@CREAPROYECTOS.COM
            </span>
            <motion.button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden relative w-8 h-8 flex items-center justify-center"
              whileTap={{ scale: 0.9 }}
            >
              <motion.span animate={menuOpen ? { rotate: 45, y: 4 } : {}} className="absolute w-5 h-[2px] bg-[#141414]" />
              <motion.span animate={menuOpen ? { opacity: 0 } : {}} className="absolute w-5 h-[2px] bg-[#141414]" />
              <motion.span animate={menuOpen ? { rotate: -45, y: -4 } : {}} className="absolute w-5 h-[2px] bg-[#141414]" />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-2xl md:hidden flex flex-col items-center justify-center gap-8"
          >
            {links.map((link, i) => (
              <motion.button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-3xl font-bold tracking-tight"
                style={{ color: activeSection === link.id ? TEAL : CARBON }}
                whileHover={{ scale: 1.05, x: 10 }}
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ─── Hero ─────────────────────────────────────────────────
const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const { x: mx, y: my } = useMousePosition();
  const orbX = useTransform(mx, [0, 1], [-80, 80]);
  const orbY = useTransform(my, [0, 1], [-80, 80]);

  return (
    <section id="hero" ref={ref} className="relative h-screen overflow-hidden">
      {/* Background image */}
      <motion.div style={{ y }} className="absolute inset-0">
        <img src="/BgLandingPageCrea.png" alt="Paisaje natural fondo hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/50 to-white/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />
      </motion.div>
      <Particles count={25} color={TEAL} />

      <motion.div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none" style={{ x: orbX, y: orbY, background: `radial-gradient(circle, ${TEAL}08 0%, transparent 70%)` }} />
      <motion.div className="absolute w-[400px] h-[400px] rounded-full pointer-events-none" style={{ x: useTransform(mx, [0, 1], [80, -80]), y: useTransform(my, [0, 1], [80, -80]), background: `radial-gradient(circle, ${VERDE}06 0%, transparent 70%)` }} />

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.025]">
        <svg className="w-full h-full">
          <defs>
            <pattern id="heroGrid" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M 64 0 L 0 0 0 64" fill="none" stroke={TEAL} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#heroGrid)" />
        </svg>
      </div>

      {/* Decorative circles */}
      <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
        <motion.div className="absolute top-20 right-[10%] w-32 h-32 rounded-full border border-[#3C6E80]/10" animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} />
        <motion.div className="absolute bottom-[30%] right-[5%] w-20 h-20 rounded-full border border-[#5C7A5E]/15" animate={{ rotate: -360 }} transition={{ duration: 45, repeat: Infinity, ease: 'linear' }} />
        <motion.div className="absolute top-[40%] left-[5%] w-16 h-16 rounded-full bg-[#C9B896]/10" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
      </motion.div>

      <motion.div style={{ opacity }} className="relative h-full flex flex-col justify-center px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto w-full">
          <motion.div initial={{ width: 0 }} animate={{ width: 80 }} transition={{ duration: 1, delay: 0.4 }} className="h-[3px] mb-10" style={{ background: `linear-gradient(90deg, ${TEAL}, ${VERDE}, ${ARENA})` }} />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex items-center gap-3 mb-8">
            <motion.svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path d="M12 22v-4l-3 3" />
              <path d="M12 22v-4l3 3" />
              <path d="M12 2v10" />
              <path d="M8 6c0 2.21 1.79 4 4 4 2.21 0 4-1.79 4-4" />
              <path d="M6 10c0 2.76 2.24 5 5 5h2c2.76 0 5-2.24 5-5" />
            </motion.svg>
          </motion.div>

          <h1 className="text-[#141414] text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] mb-6 overflow-hidden">
            <StaggerText text="GESTIÓN" delay={0.6} /><br />
            <span className="bg-gradient-to-r from-[#3C6E80] to-[#5C7A5E] bg-clip-text text-transparent"><SplitChars text="AMBIENTAL" delay={0.8} /></span><br />
            <StaggerText text="QUE IMPULSA" delay={0.6} /><br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${CARBON}, ${TEAL_DARK})` }}>
              <SplitChars text="TU PROYECTO" delay={0.9} />
            </span>
          </h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.2 }} className="text-[#141414]/70 text-base md:text-lg max-w-xl leading-relaxed mb-10">
            Acompañamos a empresas y municipios en la{' '}
            <span className="text-[#3C6E80] font-medium">gestión integral de licencias ambientales</span>,
            forestales y municipales, con más de una década de experiencia en el sector.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.7 }} className="flex flex-wrap gap-4">
            <Magnetic strength={40}>
              <motion.a href="#services" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="relative overflow-hidden group inline-flex items-center gap-3 px-8 py-3.5 text-xs tracking-[0.2em] font-medium text-white"
                style={{ backgroundColor: TEAL }}
              >
                <motion.span className="absolute inset-0" style={{ backgroundColor: TEAL_DARK }} initial={{ x: '-100%' }} whileHover={{ x: 0 }} transition={{ duration: 0.4 }} />
                <span className="relative z-10 flex items-center gap-3">VER SERVICIOS <span className="group-hover:translate-x-1 transition-transform">→</span></span>
              </motion.a>
            </Magnetic>
            <Magnetic strength={30}>
              <motion.a href="#contact" whileHover={{ scale: 1.03, backgroundColor: `${TEAL}08` }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 px-8 py-3.5 text-xs tracking-[0.2em] font-medium transition-all duration-300"
                style={{ color: TEAL, border: `1px solid ${TEAL}40` }}
              >
                CONTÁCTANOS
              </motion.a>
            </Magnetic>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.span className="text-[#3C6E80]/50 text-[10px] tracking-[0.25em]" animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 3, repeat: Infinity }}>
          DESCUBRE MÁS
        </motion.span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="text-[#3C6E80]/50">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

// ─── About ────────────────────────────────────────────────
const About = () => (
  <Parallax speed={0.08}>
  <section id="about" className="relative bg-white py-28 md:py-36 px-6 md:px-12 lg:px-20 overflow-hidden">
    <Particles count={15} color={VERDE} />
    <div className="max-w-6xl mx-auto relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-1">
          <SectionReveal>
            <div className="flex lg:flex-col items-center lg:items-start gap-2 lg:gap-0">
              <p className="text-[#3C6E80] text-[10px] tracking-[0.2em] font-medium">01</p>
              <div className="w-8 h-px bg-[#3C6E80]/30 lg:mt-2" />
            </div>
          </SectionReveal>
        </div>
        <div className="lg:col-span-11">
          <SectionReveal>
            <h2 className="text-[#141414] text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] mb-8">
              SOMOS <span className="bg-gradient-to-r from-[#3C6E80] to-[#2E5866] bg-clip-text text-transparent"><SplitChars text="CREA" delay={0.1} /></span>{' '}
              <span className="text-[#5C7A5E]"><SplitChars text="PROYECTOS" delay={0.2} /></span>
            </h2>
          </SectionReveal>
          <SectionReveal delay={0.15}>
            <p className="text-[#141414]/70 text-base lg:text-lg leading-relaxed max-w-3xl mb-12">
              Una firma de consultoría ambiental especializada en{' '}
              <span className="text-[#141414] font-medium">gestión institucional</span> y
              licenciamiento ambiental, forestal y municipal. Trabajamos de la mano con{' '}
              <span className="text-[#141414] font-medium">MARN, CONAP, CONRED, INAB</span> y
              municipalidades para asegurar que cada proyecto cumpla con la normativa vigente.
            </p>
          </SectionReveal>
          <SectionReveal delay={0.2}>
            <div className="relative h-px bg-[#3C6E80]/10 mb-12 overflow-hidden">
              <motion.div className="absolute inset-0" initial={{ x: '-100%' }} whileInView={{ x: '200%' }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                style={{ background: `linear-gradient(90deg, transparent, ${TEAL}, ${VERDE}, ${ARENA}, transparent)` }} />
            </div>
          </SectionReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { value: '60+', label: 'PROYECTOS\nGESTIONADOS' },
              { value: '10+', label: 'AÑOS DE\nEXPERIENCIA' },
              { value: '100%', label: 'CUMPLIMIENTO\nNORMATIVO' },
            ].map((stat, i) => (
              <SectionReveal key={i} delay={0.1 * i}>
                <motion.div className="group cursor-default" whileHover={{ x: 8 }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="w-10 h-[2px] mb-5" style={{ backgroundColor: i === 0 ? TEAL : i === 1 ? VERDE : ARENA }} />
                  <p className="text-4xl md:text-5xl font-bold tracking-tight mb-2" style={{ color: i === 0 ? TEAL : i === 1 ? VERDE : CARBON }}>
                    <Counter value={stat.value} />
                  </p>
                  <p className="text-[#141414]/60 text-[11px] tracking-[0.15em] whitespace-pre-line leading-relaxed">{stat.label}</p>
                </motion.div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
  </Parallax>
);

// ─── SVG Icons for services ──────────────────────────────
const LeafIconSvg = ({ color = TEAL }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);
const ClipboardIconSvg = ({ color = VERDE }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" />
  </svg>
);
const DocumentIconSvg = ({ color = ARENA }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);
const BuildingIconSvg = ({ color = TEAL_DARK }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" /><line x1="8" x2="10" y1="6" y2="6" /><line x1="14" x2="16" y1="6" y2="6" />
    <line x1="8" x2="10" y1="10" y2="10" /><line x1="14" x2="16" y1="10" y2="10" />
    <line x1="8" x2="10" y1="14" y2="14" /><line x1="14" x2="16" y1="14" y2="14" />
  </svg>
);

const serviceIcons = [LeafIconSvg, ClipboardIconSvg, DocumentIconSvg, BuildingIconSvg];

const services = [
  {
    num: '01', short: 'EIA',
    title: 'Evaluaciones de Impacto Ambiental',
    description: 'Identificamos, evaluamos y gestionamos los impactos ambientales de tu proyecto. Preparación de estudios técnicos, líneas base, planes de manejo y seguimiento.',
    items: ['Estudios de impacto ambiental detallados', 'Líneas base ambientales', 'Planes de manejo y mitigación', 'Monitoreo y seguimiento ambiental'],
    color: TEAL,
  },
  {
    num: '02', short: 'PGA',
    title: 'Planes de Gestión Ambiental',
    description: 'Diseñamos e implementamos planes estratégicos de gestión ambiental alineados con la normativa, optimizando recursos y minimizando riesgos.',
    items: ['Planes de gestión integral', 'Programas de cumplimiento ambiental', 'Auditorías ambientales internas', 'Sistemas de gestión ambiental'],
    color: VERDE,
  },
  {
    num: '03', short: 'LICENCIAS',
    title: 'Licencias Ambientales, Forestales y Municipales',
    description: 'Gestionamos todo el proceso de obtención de licencias ante MARN, INAB, CONAP y municipalidades. Acompañamiento integral.',
    items: ['Licencias ambientales (MARN)', 'Licencias forestales (INAB)', 'Licencias municipales', 'Permisos de construcción y operación'],
    color: ARENA,
  },
  {
    num: '04', short: 'GESTIÓN',
    title: 'Gestión Institucional Ambiental',
    description: 'Coordinación y representación técnica ante todas las entidades del sector ambiental guatemalteco.',
    items: ['Gestión ante MARN y CONAP', 'Coordinación con CONRED', 'Trámites INAB', 'Gestión municipal descentralizada'],
    color: TEAL_DARK,
  },
];

const Services = () => {


  return (
    <section id="services" className="relative bg-[#F7F6F2] py-28 md:py-36 px-6 md:px-12 lg:px-20 overflow-hidden">
      <Particles count={20} color={ARENA} />
      <div className="max-w-6xl mx-auto relative">
        <SectionReveal>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[#3C6E80] text-[10px] tracking-[0.2em] font-medium">02</span>
            <div className="flex-1 h-px bg-[#3C6E80]/10" />
          </div>
          <h2 className="text-[#141414] text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] mb-6">
            NUESTRAS <span className="text-[#3C6E80]"><SplitChars text="CAPACIDADES" delay={0.1} /></span>
          </h2>
          <p className="text-[#141414]/70 text-base md:text-lg max-w-xl leading-relaxed mb-16">
            Soluciones ambientales integrales que garantizan el cumplimiento normativo y la viabilidad de tu proyecto.
          </p>
        </SectionReveal>

        <div className="space-y-4">
          {services.map((s, i) => {
            const Icon = serviceIcons[i];
            return (
              <SectionReveal key={i} delay={i * 0.06}>
                  <Tilt max={5}>
                  <motion.div
                    className="relative bg-white rounded-xl overflow-hidden group border border-[#141414]/5"
                    whileHover={{ y: -4, boxShadow: `0 12px 40px ${TEAL}10` }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div className="absolute left-0 top-0 bottom-0 w-1 group-hover:w-1.5" style={{ backgroundColor: s.color }}
                      transition={{ duration: 0.3 }} />
                    <div className="p-5 md:p-7 pl-7 md:pl-9">
                      <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                        <motion.div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}12` }}
                          whileHover={{ scale: 1.1, backgroundColor: `${s.color}25` }}
                        >
                          <Icon color={s.color} />
                        </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className="text-[10px] tracking-[0.2em] font-medium px-2.5 py-0.5 rounded-full"
                            style={{ color: s.color, backgroundColor: `${s.color}15` }}
                          >
                            {s.short}
                          </span>
                          <span className="text-[#141414]/40 text-[10px] tracking-[0.1em]">/{s.num}</span>
                        </div>
                        <h3 className="text-[#141414] text-base md:text-lg font-bold tracking-tight mb-1.5">{s.title}</h3>
                        <p className="text-[#141414]/75 text-sm md:text-sm leading-relaxed mb-3 max-w-2xl">{s.description}</p>
                        <div className="flex flex-wrap gap-x-6 gap-y-1.5">
                          {s.items.map((item, idx) => (
                            <span key={idx} className="flex items-center gap-1.5 text-xs text-[#141414]/60">
                              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                  </Tilt>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ─── Process ──────────────────────────────────────────────
const processSteps = [
  { num: '01', title: 'Diagnóstico', desc: 'Evaluamos tu proyecto y determinamos los requisitos ambientales, forestales y municipales aplicables.', color: TEAL },
  { num: '02', title: 'Estrategia', desc: 'Diseñamos una hoja de ruta personalizada para la obtención de licencias y permisos.', color: VERDE },
  { num: '03', title: 'Gestión', desc: 'Coordinamos y damos seguimiento a todos los trámites ante las entidades correspondientes.', color: ARENA },
  { num: '04', title: 'Cierre', desc: 'Entregamos las licencias y permisos, asegurando el cumplimiento continuo de tu proyecto.', color: TEAL_DARK },
];

// ─── ProcessCard ─────────────────────────────────────────
const ProcessCard = ({ children, color }: { children: React.ReactNode; color?: string }) => (
  <Tilt max={4}>
  <motion.div
    className="bg-white border border-[#141434]/8 group cursor-default"
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    whileHover={{ y: -6, boxShadow: `0 20px 60px rgba(20,20,20,0.06)` }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
  </Tilt>
);

const Process = () => {
  return (
    <section id="process" className="relative bg-white py-28 md:py-36 px-6 md:px-12 lg:px-20 overflow-hidden">
      <Particles count={15} color={TEAL} />
      <div className="max-w-6xl mx-auto">
        <SectionReveal>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[#3C6E80] text-[10px] tracking-[0.2em] font-medium">03</span>
            <div className="flex-1 h-px bg-[#3C6E80]/10" />
          </div>
          <h2 className="text-[#141414] text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] mb-16">
            CÓMO <span className="text-[#3C6E80]"><SplitChars text="TRABAJAMOS" delay={0.1} /></span>
          </h2>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((step, i) => (
            <SectionReveal key={i} delay={i * 0.08}>
              <ProcessCard>
                <div className="h-1.5 w-full group-hover:h-2 transition-all duration-300" style={{ backgroundColor: step.color }} />
                <div className="p-7 md:p-8">
                  <motion.p className="text-6xl md:text-7xl font-bold tracking-tight mb-5 transition-colors duration-300"
                    style={{ color: `${step.color}25` }}
                    whileHover={{ color: `${step.color}60` }}
                  >
                    {step.num}
                  </motion.p>
                  <h3 className="text-[#141414] text-xl md:text-2xl font-bold tracking-tight mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[#141414]/65 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                  <div className="mt-5 pt-4 border-t border-[#141414]/6 group-hover:border-[#141414]/20 transition-colors duration-300">
                    <motion.svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={step.color} strokeWidth="1.5"
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </motion.svg>
                  </div>
                </div>
              </ProcessCard>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Contact ──────────────────────────────────────────────
const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = `mailto:info@creaproyectos.com?subject=Contacto desde web&body=Nombre: ${form.name}%0AEmail: ${form.email}%0A%0A${form.message}`;
    window.open(mailto);
  };

  return (
    <section id="contact" className="relative py-28 md:py-36 px-6 md:px-12 lg:px-20 overflow-hidden" style={{ backgroundColor: CREMA }}>

      <div className="max-w-6xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-1">
            <SectionReveal>
              <p className="text-[#141414]/50 text-[10px] tracking-[0.2em] font-medium">05</p>
              <p className="text-[#141414]/40 text-[10px] tracking-[0.2em] mt-1">CONTACTO</p>
            </SectionReveal>
          </div>
          <div className="lg:col-span-11">
            <SectionReveal>
              <h2 className="text-[#141414] text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-10">
                HABLEMOS DE<br />
                <span style={{ color: TEAL_DARK }}><SplitChars text="TU PROYECTO" delay={0.15} /></span>
              </h2>
            </SectionReveal>
            <SectionReveal delay={0.15}>
              <p className="text-[#141414]/70 text-base lg:text-lg leading-relaxed max-w-xl mb-16">
                Cuéntanos sobre tu proyecto. Te asesoramos sobre los requisitos ambientales,
                forestales y municipales necesarios para su viabilidad.
              </p>
            </SectionReveal>
            <SectionReveal delay={0.25}>
              <motion.form onSubmit={handleSubmit}
                className="bg-white p-8 md:p-12 max-w-2xl rounded-2xl border border-[#3C6E80]/10 shadow-sm select-text"
                whileHover={{ borderColor: `${TEAL}30`, boxShadow: `0 8px 40px ${TEAL}10` }}
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[#141414]/50 text-[11px] tracking-[0.2em] block mb-2">01 NOMBRE</label>
                      <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-transparent border-b border-[#141414]/20 pb-3 text-[#141414] text-sm focus:border-[#3C6E80] outline-none transition-all duration-300 placeholder:text-[#141414]/30"
                        placeholder="Tu nombre" />
                    </div>
                    <div>
                      <label className="text-[#141414]/50 text-[11px] tracking-[0.2em] block mb-2">02 CORREO</label>
                      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full bg-transparent border-b border-[#141414]/20 pb-3 text-[#141414] text-sm focus:border-[#3C6E80] outline-none transition-all duration-300 placeholder:text-[#141414]/30"
                        placeholder="correo@ejemplo.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[#141414]/50 text-[11px] tracking-[0.2em] block mb-2">03 MENSAJE</label>
                    <textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full bg-transparent border-b border-[#141414]/20 pb-3 text-[#141414] text-sm focus:border-[#3C6E80] outline-none transition-all duration-300 resize-none placeholder:text-[#141414]/30"
                      placeholder="Cuéntanos sobre tu proyecto..." />
                  </div>
                  <div className="flex justify-end pt-4">
                    <Magnetic strength={35}>
                      <motion.button whileHover={{ scale: 1.02, boxShadow: `0 0 30px ${TEAL}25` }} whileTap={{ scale: 0.97 }}
                        className="relative overflow-hidden group px-8 py-3 text-xs tracking-[0.2em] font-medium text-white rounded-sm"
                        style={{ backgroundColor: TEAL }}
                      >
                        <motion.span className="absolute inset-0" style={{ backgroundColor: TEAL_DARK }}
                          initial={{ x: '-100%' }} whileHover={{ x: 0 }} transition={{ duration: 0.4 }} />
                        <span className="relative z-10 flex items-center gap-3">ENVIAR MENSAJE <span className="group-hover:translate-x-1 transition-transform">→</span></span>
                      </motion.button>
                    </Magnetic>
                  </div>
                </div>
              </motion.form>
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Logos Trust Bar ──────────────────────────────────────
const logos = [
  { name: 'MARN', full: 'Ministerio de Ambiente y Recursos Naturales', img: '/logos/marn.png' },
  { name: 'CONAP', full: 'Consejo Nacional de Áreas Protegidas', img: '/logos/conap.png' },
  { name: 'INAB', full: 'Instituto Nacional de Bosques', img: '/logos/inab.png' },
  { name: 'CONRED', full: 'Coordinadora Nacional para la Reducción de Desastres', img: '/logos/conred.png' },
];

const LogoSection = () => (
  <section className="relative bg-white py-20 md:py-24 px-6 md:px-12 lg:px-20 overflow-hidden">
    <div className="max-w-5xl mx-auto">
      <SectionReveal>
        <p className="text-[#141414]/40 text-[10px] tracking-[0.2em] text-center mb-1">ENTIDADES CON LAS QUE TRABAJAMOS</p>
        <div className="w-12 h-px bg-[#3C6E80]/30 mx-auto mb-8" />
      </SectionReveal>
      <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 md:gap-x-16">
        {logos.map((l, i) => (
          <SectionReveal key={i} delay={i * 0.08}>
            <motion.div
              className="flex flex-col items-center gap-2"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-20 h-20 rounded-xl flex items-center justify-center bg-white border border-[#141414]/5 p-3">
                <img src={l.img} alt={l.name} className="w-full h-full object-contain" />
              </div>
              <p className="text-[#141414]/40 text-[9px] tracking-[0.1em] text-center max-w-[120px] leading-tight">{l.full}</p>
            </motion.div>
          </SectionReveal>
        ))}
      </div>
    </div>
  </section>
);

// ─── FAQ ───────────────────────────────────────────────────
const faqs = [
  {
    q: '¿Cuánto tiempo toma obtener una licencia ambiental en Guatemala?',
    r: 'Depende del tipo de proyecto y su categoría. Los proyectos de bajo impacto pueden resolverse en 2-3 meses, mientras que los de alto impacto pueden tomar 6-12 meses. Te damos un cronograma realista desde la primera reunión.',
  },
  {
    q: '¿Qué documentos necesito para iniciar el trámite?',
    r: 'Los requisitos varían según el proyecto y la entidad (MARN, INAB, CONAP o municipalidad). En general se necesita: escritura del terreno, planos, descripción del proyecto y estudio de impacto ambiental. Nosotros te guiamos con una lista personalizada.',
  },
  {
    q: '¿Trabajan solo en la ciudad de Guatemala?',
    r: 'No. Trabajamos en todo el territorio guatemalteco. Hemos gestionado proyectos en Petén, Izabal, Alta Verapaz, Escuintla y más. Nos desplazamos según las necesidades del proyecto.',
  },
  {
    q: '¿Qué incluye el acompañamiento de CREA PROYECTOS?',
    r: 'Acompañamiento integral: diagnóstico inicial, preparación de estudios, gestión ante entidades, seguimiento de trámites y entrega de licencias. También ofrecemos auditorías ambientales y planes de manejo.',
  },
  {
    q: '¿Cuánto cuestan sus servicios?',
    r: 'Cada proyecto es único. El costo depende de la complejidad, las entidades involucradas y los plazos. Ofrecemos una consultoría inicial gratuita para evaluar tu proyecto y darte un presupuesto claro.',
  },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="relative bg-white py-28 md:py-36 px-6 md:px-12 lg:px-20 overflow-hidden">
      <Particles count={10} color={ARENA} />
      <div className="max-w-4xl mx-auto">
        <SectionReveal>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[#3C6E80] text-[10px] tracking-[0.2em] font-medium">—</span>
            <div className="flex-1 h-px bg-[#3C6E80]/10" />
          </div>
          <h2 className="text-[#141414] text-4xl md:text-6xl lg:text-6xl font-bold tracking-tight leading-[0.95] mb-6">
            PREGUNTAS <span className="text-[#3C6E80]"><SplitChars text="FRECUENTES" delay={0.1} /></span>
          </h2>
          <p className="text-[#141414]/60 text-base md:text-lg max-w-xl leading-relaxed mb-16">
            Resolvemos tus dudas sobre nuestros servicios y procesos ambientales en Guatemala.
          </p>
        </SectionReveal>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <SectionReveal key={i} delay={i * 0.05}>
                <motion.div
                  className="border border-[#141414]/8 bg-white overflow-hidden"
                  initial={false}
                >
                  <motion.button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left"
                    whileHover={{ backgroundColor: 'rgba(60,110,128,0.03)' }}
                  >
                    <span className="text-[#141414] text-sm md:text-base font-medium tracking-tight flex-1 pr-4">
                      {faq.q}
                    </span>
                    <motion.svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="2" strokeLinecap="round"
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </motion.svg>
                  </motion.button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 md:px-6 pb-5 md:pb-6 text-[#141414]/60 text-sm leading-relaxed border-t border-[#141414]/6 pt-4">
                          {faq.r}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ─── Footer ───────────────────────────────────────────────
const Footer = () => (
  <footer className="px-6 md:px-12 lg:px-20 py-16" style={{ backgroundColor: CREMA }}>
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <motion.img src="/crealogo.jpeg" alt="CREA PROYECTOS" className="h-12 w-auto mb-6" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} />
          <p className="text-[#141414]/60 text-sm leading-relaxed max-w-xs mb-8">
            Consultoría ambiental estratégica. Acompañamos tu proyecto desde la gestión de licencias hasta el cumplimiento normativo integral.
          </p>
          <div className="flex gap-3">
            {[TEAL, VERDE, ARENA].map((color, i) => (
              <motion.span key={i} className="h-[2px] rounded-full" style={{ backgroundColor: color, width: 40 }}
                animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 3, delay: i * 0.5, repeat: Infinity, ease: 'easeInOut' }} />
            ))}
          </div>
        </div>
        <div className="md:col-span-3">
          <p className="text-[#141414]/50 text-[11px] tracking-[0.2em] mb-6">SERVICIOS</p>
          <div className="space-y-3">
            {['EIA', 'PGA', 'Licencias', 'Gestión Institucional'].map((item, i) => (
              <motion.p key={i} className="text-[#141414]/70 text-sm cursor-pointer relative w-fit"
                whileHover={{ x: 8, color: CARBON, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                {item}
                <motion.span className="absolute -bottom-px left-0 right-0 h-px bg-[#3C6E80]/40 origin-left rounded-full"
                  initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: 0.3 }}
                />
              </motion.p>
            ))}
          </div>
        </div>
        <div className="md:col-span-4">
          <p className="text-[#141414]/50 text-[11px] tracking-[0.2em] mb-6">CONTACTO</p>
          <div className="space-y-3">
            {['info@creaproyectos.com', '+502 1234 5678', 'Guatemala'].map((item, i) => (
              <motion.p key={i} className="text-[#141414]/70 text-sm inline-block" whileHover={{ x: 6, color: TEAL, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >{item}</motion.p>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-[#141414]/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <p className="text-[#141414]/40 text-[11px] tracking-[0.15em]">© {new Date().getFullYear()} CREA PROYECTOS · Todos los derechos reservados</p>
        <div className="flex gap-6">
          {['Aviso de Privacidad', 'Términos'].map((item, i) => (
            <p key={i} className="text-[#141414]/40 text-[11px] tracking-[0.15em] hover:text-[#141414]/70 cursor-pointer transition-colors">{item}</p>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

// ─── Main App ─────────────────────────────────────────────
export default function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div className="bg-white min-h-screen font-sans antialiased overflow-x-hidden select-none">
      <GrainOverlay />
      <SectionNav />
      <Navigation />
      <Hero />
      <WaveDivider color={CREMA} />
      <About />
      <LogoSection />
      <Services />
      <WaveDivider color="white" flip />
      <Process />
      <FAQ />
      <WaveDivider color={CREMA} flip />
      <Contact />
      <Footer />
    </div>
  );
}

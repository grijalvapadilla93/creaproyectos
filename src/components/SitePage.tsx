'use client';

import { useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { initLenis, destroyLenis, getLenis } from '@/lib/scroll';
import Preloader from '@/components/chrome/Preloader';
import CustomCursor from '@/components/chrome/CustomCursor';
import Navbar, { SectionDots } from '@/components/chrome/Navbar';
import Footer, { WhatsAppFloat } from '@/components/chrome/Footer';
import Hero from '@/components/sections/Hero';
import { About, StatsBand } from '@/components/sections/About';
import { Services, Sectors } from '@/components/sections/Services';
import { Process } from '@/components/sections/Process';
import { Faq, Contact } from '@/components/sections/FaqContact';

const SECTION_IDS = ['hero', 'about', 'services', 'process', 'contact'];

export default function SitePage() {
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState('hero');

  // Smooth scrolling engine — paused during the preloader
  useEffect(() => {
    const lenis = initLenis();
    lenis.stop();
    return () => destroyLenis();
  }, []);

  useEffect(() => {
    if (ready) getLenis()?.start();
  }, [ready]);

  // Active section tracking for the side dots
  useEffect(() => {
    let ticking = false;
    const handle = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const pos = window.scrollY + window.innerHeight * 0.35;
        let current = 'hero';
        for (const id of SECTION_IDS) {
          const el = document.getElementById(id);
          if (el && el.offsetTop <= pos) current = id;
        }
        setActive(current);
        ticking = false;
      });
    };
    window.addEventListener('scroll', handle, { passive: true });
    handle();
    return () => window.removeEventListener('scroll', handle);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-crema min-h-screen font-sans antialiased overflow-x-hidden">
        {/* Film grain */}
        <div className="fixed inset-0 pointer-events-none z-[88] noise-overlay opacity-[0.02] mix-blend-soft-light" />

        {!ready && <Preloader onDone={() => setReady(true)} />}

        <CustomCursor />
        <Navbar />
        <SectionDots active={active} />

        <main>
          <Hero ready={ready} />
          <About />
          <StatsBand />
          <Services />
          <Sectors />
          <Process />
          <Faq />
          <Contact />
        </main>

        <Footer />
        <WhatsAppFloat />
      </div>
    </MotionConfig>
  );
}
